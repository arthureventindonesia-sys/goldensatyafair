import { createServerFn } from "@tanstack/react-start";
import {
  EVENT,
  PER_USER_LIMIT,
  QRIS,
  STAGE_COPY,
  STAGE_IDS,
  TICKET_COPY,
  TICKET_IDS,
  isSalesStageId,
  isTicketTypeId,
  type SalesStageId,
  type TicketTypeId,
} from "@/lib/event";
import { isValidAddress, isValidEmail, isValidName, isValidWhatsapp, normalizeWhatsapp, uniqueCodeFromPhone } from "@/lib/format";

export type OrderStatus = "pending" | "submitted" | "paid" | "expired" | "cancelled";

export type CatalogTicket = {
  id: TicketTypeId;
  name: string;
  priceIdr: number;
  quota: number;
  remaining: number;
  perUserLimit: number;
};

export type CatalogStage = {
  id: SalesStageId;
  name: string;
  startsAt: string | null;
  endsAt: string | null;
};

export type OrderLine = {
  ticketTypeId: TicketTypeId;
  ticketName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderRecord = {
  id: string;
  ticketTypeId: TicketTypeId;
  ticketName: string;
  quantity: number;
  items: OrderLine[];
  grossAmount: number;
  uniqueCode: number;
  payableAmount: number;
  email: string;
  whatsapp: string;
  holderName: string;
  holderAddress: string;
  status: OrderStatus;
  paymentType: string | null;
  createdAt: string;
  paidAt: string | null;
  hasProof: boolean;
  proofUploadedAt: string | null;
  referralCode: string;
};

export type TicketRecord = {
  id: string;
  orderId: string;
  ticketTypeId: TicketTypeId;
  ticketName: string;
  code: string;
  holderEmail: string;
  holderWhatsapp: string;
  holderName: string;
  holderAddress: string;
  createdAt: string;
};

export type PaymentSession = {
  orderId: string;
  qrisImage: string;
  grossAmount: number;
  uniqueCode: number;
  payableAmount: number;
  ticketName: string;
  quantity: number;
  items: { name: string; quantity: number }[];
};

type TypeRow = {
  id: string;
  name: string;
  price_idr: number;
  quota: number;
  per_user_limit: number;
};

type OrderRow = {
  id: string;
  user_id: string;
  ticket_type_id: string;
  quantity: number;
  gross_amount: number;
  email: string;
  whatsapp: string;
  holder_name: string | null;
  holder_address: string | null;
  status: string;
  payment_type: string | null;
  midtrans_token: string | null;
  created_at: string;
  paid_at: string | null;
  referral_code?: string | null;
};

type TicketRow = {
  id: string;
  order_id: string;
  user_id: string;
  ticket_type_id: string;
  code: string;
  holder_email: string;
  holder_whatsapp: string;
  holder_name: string | null;
  holder_address: string | null;
  created_at: string;
};

type ItemRow = {
  id: string;
  order_id: string;
  ticket_type_id: string;
  quantity: number;
  unit_price: number;
};

type Sql = Awaited<ReturnType<typeof import("@/lib/db").getSql>>;

function asInt(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function guestBuyerId(whatsapp: string) {
  return `guest:${normalizeWhatsapp(whatsapp)}`;
}

async function resolveAgentReferral(sql: Sql, requested: string) {
  const ref = String(requested ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);
  if (!ref) return null;
  const agents = await sql<{ username: string; referral_code: string | null }>`
    select username, referral_code from staff
    where role = 'agent'
      and (lower(username) = ${ref} or lower(coalesce(referral_code, '')) = ${ref})
    limit 1
  `;
  if (!agents[0]) throw new Error("Kode referal tidak valid.");
  return String(agents[0].referral_code || agents[0].username).toLowerCase();
}

type StageRow = {
  id: string;
  name: string;
  enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

async function expireStale(sql: Sql) {
  await sql`
    update orders
    set status = 'expired'
    where status = 'pending'
      and created_at < now() - interval '15 minutes'
  `;
}

async function remainingFor(sql: Sql, typeId: string, stageId: string) {
  const offers = await sql<{ price_idr: number; quota: number }>`
    select price_idr, quota from ticket_stage_offers
    where stage_id = ${stageId} and ticket_type_id = ${typeId}
    limit 1
  `;
  const offer = offers[0];
  if (!offer) return null;
  const held = await sql<{ total: number }>`
    select coalesce(sum(oi.quantity), 0)::int as total
    from order_items oi
    join orders o on o.id = oi.order_id
    where oi.ticket_type_id = ${typeId}
      and coalesce(o.stage_id, '') = ${stageId}
      and o.status in ('pending', 'submitted', 'paid')
  `;
  return {
    priceIdr: asInt(offer.price_idr),
    quota: asInt(offer.quota),
    remaining: Math.max(0, asInt(offer.quota) - asInt(held[0]?.total)),
  };
}

async function userHeld(sql: Sql, userId: string, typeId: string) {
  const rows = await sql<{ total: number }>`
    select coalesce(sum(oi.quantity), 0)::int as total
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.user_id = ${userId}
      and oi.ticket_type_id = ${typeId}
      and o.status in ('pending', 'submitted', 'paid')
  `;
  return asInt(rows[0]?.total);
}

async function ensureStageSeed(sql: Sql) {
  await sql.query(`
    insert into ticket_types (id, name, price_idr, quota, per_user_limit, sort_order)
    values ('vvip', 'VVIP', 2000, 100, 5, 0)
    on conflict (id) do nothing
  `);
  await sql.query(`
    create table if not exists ticket_stages (
      id text primary key,
      name text not null,
      enabled boolean not null default false,
      starts_at timestamptz,
      ends_at timestamptz,
      sort_order integer not null default 0
    )
  `);
  await sql.query(`
    create table if not exists ticket_stage_offers (
      stage_id text not null,
      ticket_type_id text not null,
      price_idr integer not null,
      quota integer not null,
      primary key (stage_id, ticket_type_id)
    )
  `);
  try {
    await sql.query(`alter table orders add column if not exists stage_id text`);
  } catch {
    /* exists */
  }
  await sql.query(`
    insert into ticket_stages (id, name, enabled, starts_at, ends_at, sort_order)
    values
      ('early_bird', 'Early Bird', true, '2026-09-01 00:00:00+07', '2026-10-15 23:59:00+07', 1),
      ('presale_1', 'Presale 1', false, '2026-10-16 00:00:00+07', '2026-10-31 23:59:00+07', 2),
      ('presale_2', 'Presale 2', false, '2026-11-01 00:00:00+07', '2026-11-13 23:59:00+07', 3),
      ('on_the_spot', 'On the spot', false, '2026-11-14 12:00:00+07', '2026-11-14 22:30:00+07', 4)
    on conflict (id) do nothing
  `);
  await sql.query(`
    insert into ticket_stage_offers (stage_id, ticket_type_id, price_idr, quota)
    values
      ('early_bird', 'vip', 1000, 100),
      ('early_bird', 'festival', 500, 200),
      ('presale_1', 'vvip', 2000, 30),
      ('presale_1', 'vip', 1000, 150),
      ('presale_1', 'festival', 500, 400),
      ('presale_2', 'vvip', 2000, 40),
      ('presale_2', 'vip', 1000, 150),
      ('presale_2', 'festival', 500, 500),
      ('on_the_spot', 'vvip', 2000, 20),
      ('on_the_spot', 'vip', 1000, 50),
      ('on_the_spot', 'festival', 500, 200)
    on conflict (stage_id, ticket_type_id) do nothing
  `);
}

async function loadActiveStage(sql: Sql) {
  await ensureStageSeed(sql);
  const rows = await sql<StageRow>`
    select id, name, enabled, starts_at, ends_at, sort_order
    from ticket_stages
    where enabled = true
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    order by sort_order asc
    limit 1
  `;
  const row = rows[0];
  if (!row || !isSalesStageId(row.id)) return null;
  return { ...row, id: row.id as SalesStageId };
}

async function loadCatalog(sql: Sql) {
  const stage = await loadActiveStage(sql);
  const tickets: CatalogTicket[] = [];
  if (stage) {
    const allowed = STAGE_COPY[stage.id].types;
    for (const typeId of allowed) {
      const stock = await remainingFor(sql, typeId, stage.id);
      if (!stock) continue;
      tickets.push({
        id: typeId,
        name: TICKET_COPY[typeId].name,
        priceIdr: stock.priceIdr,
        quota: stock.quota,
        remaining: stock.remaining,
        perUserLimit: PER_USER_LIMIT,
      });
    }
  }
  return {
    event: {
      id: EVENT.id,
      name: EVENT.name,
      venue: EVENT.venue,
      city: EVENT.city,
      startsAt: EVENT.startsAt,
    },
    stage: stage
      ? {
          id: stage.id as SalesStageId,
          name: STAGE_COPY[stage.id as SalesStageId].name,
          startsAt: stage.starts_at ? String(stage.starts_at) : null,
          endsAt: stage.ends_at ? String(stage.ends_at) : null,
        }
      : null,
    tickets,
  };
}

function mapLine(row: ItemRow): OrderLine {
  const ticketTypeId = isTicketTypeId(row.ticket_type_id) ? row.ticket_type_id : "festival";
  return {
    ticketTypeId,
    ticketName: TICKET_COPY[ticketTypeId].name,
    quantity: asInt(row.quantity),
    unitPrice: asInt(row.unit_price),
  };
}

function summarizeLines(lines: OrderLine[]) {
  const quantity = lines.reduce((n, line) => n + line.quantity, 0);
  const ticketName = lines.map((line) => `${line.quantity} ${line.ticketName}`).join(" · ");
  const ticketTypeId = lines[0]?.ticketTypeId ?? "festival";
  return { quantity, ticketName, ticketTypeId };
}

function mapOrder(row: OrderRow, items: ItemRow[] = []): OrderRecord {
  const lines =
    items.length > 0
      ? items.map(mapLine)
      : [
          mapLine({
            id: row.id,
            order_id: row.id,
            ticket_type_id: row.ticket_type_id,
            quantity: row.quantity,
            unit_price:
              asInt(row.quantity) > 0 ? Math.round(asInt(row.gross_amount) / asInt(row.quantity)) : 0,
          }),
        ];
  const summary = summarizeLines(lines);
  return {
    id: row.id,
    ticketTypeId: summary.ticketTypeId,
    ticketName: summary.ticketName,
    quantity: summary.quantity,
    items: lines,
    grossAmount: asInt(row.gross_amount),
    uniqueCode: uniqueCodeFromPhone(row.whatsapp),
    payableAmount: asInt(row.gross_amount) + uniqueCodeFromPhone(row.whatsapp),
    email: row.email,
    whatsapp: row.whatsapp,
    holderName: row.holder_name ?? "",
    holderAddress: row.holder_address ?? "",
    status: row.status as OrderStatus,
    paymentType: row.payment_type,
    createdAt: String(row.created_at),
    paidAt: row.paid_at ? String(row.paid_at) : null,
    hasProof: false,
    proofUploadedAt: null,
    referralCode: String(row.referral_code ?? "").trim().toLowerCase(),
  };
}

function mapTicket(row: TicketRow): TicketRecord {
  const ticketTypeId = isTicketTypeId(row.ticket_type_id) ? row.ticket_type_id : "festival";
  return {
    id: row.id,
    orderId: row.order_id,
    ticketTypeId,
    ticketName: TICKET_COPY[ticketTypeId].name,
    code: row.code,
    holderEmail: row.holder_email,
    holderWhatsapp: row.holder_whatsapp,
    holderName: row.holder_name ?? "",
    holderAddress: row.holder_address ?? "",
    createdAt: String(row.created_at),
  };
}

function randomHex(bytes: number) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function itemsFor(sql: Sql, orderId: string) {
  return sql<ItemRow>`
    select * from order_items where order_id = ${orderId} order by ticket_type_id
  `;
}

async function mapOrderFull(sql: Sql, row: OrderRow) {
  const items = await itemsFor(sql, row.id);
  const proofs = await sql<{ uploaded_at: string }>`
    select uploaded_at from payment_proofs where order_id = ${row.id} limit 1
  `;
  const mapped = mapOrder(row, items);
  mapped.hasProof = proofs.length > 0;
  mapped.proofUploadedAt = proofs[0]?.uploaded_at ? String(proofs[0].uploaded_at) : null;
  return mapped;
}

async function issueTickets(sql: Sql, order: OrderRow) {
  const stored = await itemsFor(sql, order.id);
  const lines =
    stored.length > 0
      ? stored
      : [
          {
            id: order.id,
            order_id: order.id,
            ticket_type_id: order.ticket_type_id,
            quantity: order.quantity,
            unit_price: 0,
          },
        ];
  for (const line of lines) {
    const prefix = line.ticket_type_id === "vvip" ? "VVIP" : line.ticket_type_id === "vip" ? "VIP" : "FST";
    for (let i = 0; i < asInt(line.quantity); i += 1) {
      const code = `GSF-${prefix}-${randomHex(4)}`;
      await sql`
        insert into tickets (id, order_id, user_id, ticket_type_id, code, holder_email, holder_whatsapp, holder_name, holder_address)
        values (
          ${crypto.randomUUID()},
          ${order.id},
          ${order.user_id},
          ${line.ticket_type_id},
          ${code},
          ${order.email},
          ${order.whatsapp},
          ${order.holder_name ?? ""},
          ${order.holder_address ?? ""}
        )
      `;
    }
  }
}

export async function applyMidtransNotification(
  sql: Sql,
  orderId: string,
  opts: { paid: boolean; closed: boolean; paymentType?: string | null },
) {
  if (opts.paid) {
    return fulfillPaidOrder(sql, orderId, opts.paymentType ?? "qris");
  }
  if (opts.closed) {
    await sql`
      update orders
      set status = 'expired'
      where id = ${orderId} and status = 'pending'
    `;
  }
  const rows = await sql<OrderRow>`select * from orders where id = ${orderId} limit 1`;
  return rows[0] ?? null;
}

export async function fulfillPaidOrder(sql: Sql, orderId: string, paymentType?: string | null) {
  const rows = await sql<OrderRow>`select * from orders where id = ${orderId} limit 1`;
  const order = rows[0];
  if (!order) return null;
  if (order.status === "paid") return order;
  if (order.status !== "pending" && order.status !== "submitted") return null;
  await sql`
    update orders
    set status = 'paid',
        paid_at = now(),
        payment_type = ${paymentType ?? order.payment_type}
    where id = ${orderId} and status = 'pending'
  `;
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from tickets where order_id = ${orderId}
  `;
  if (asInt(existing[0]?.n) === 0) {
    await issueTickets(sql, order);
  }
  const updated = await sql<OrderRow>`select * from orders where id = ${orderId} limit 1`;
  return updated[0] ?? null;
}

function newOrderId() {
  const n = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GSF-${n}-${r}`;
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await expireStale(sql);
  return loadCatalog(sql);
});

export const getCheckoutState = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({
    token: String((input as { token?: string } | null)?.token ?? ""),
    whatsapp: String((input as { whatsapp?: string } | null)?.whatsapp ?? ""),
  }))
  .handler(async ({ data }) => {
    try {
    const { assertNotStaffBuyer } = await import("@/lib/admin.server");
    assertNotStaffBuyer(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await expireStale(sql);
    const catalog = await loadCatalog(sql);
    const buyerId = isValidWhatsapp(data.whatsapp) ? guestBuyerId(data.whatsapp) : "";
    const held = {
      vvip: buyerId ? await userHeld(sql, buyerId, "vvip") : 0,
      vip: buyerId ? await userHeld(sql, buyerId, "vip") : 0,
      festival: buyerId ? await userHeld(sql, buyerId, "festival") : 0,
    } satisfies Record<TicketTypeId, number>;
    return { ...catalog, held };
    } catch (e: unknown) {
      if (e instanceof Error && (e.message === "Unauthorized" || e.message.includes("tidak bisa membeli"))) throw e;
      throw new Error(e instanceof Error ? e.message : "Gagal memuat checkout.");
    }
  });

export const createOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as {
      items?: { ticketTypeId?: string; quantity?: number }[];
      ticketTypeId?: string;
      quantity?: number;
      email?: string;
      whatsapp?: string;
      name?: string;
      address?: string;
      referral?: string;
      token?: string;
    };
    const rawItems =
      Array.isArray(data.items) && data.items.length > 0
        ? data.items
        : [{ ticketTypeId: data.ticketTypeId, quantity: data.quantity }];
    const items: { ticketTypeId: TicketTypeId; quantity: number }[] = [];
    for (const item of rawItems) {
      const ticketTypeId = String(item.ticketTypeId ?? "");
      const quantity = Number(item.quantity);
      if (!isTicketTypeId(ticketTypeId)) continue;
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > PER_USER_LIMIT) {
        throw new Error(`Jumlah tiket ${TICKET_COPY[ticketTypeId as TicketTypeId]?.name ?? ""} 0–${PER_USER_LIMIT}.`);
      }
      if (quantity === 0) continue;
      if (items.some((row) => row.ticketTypeId === ticketTypeId)) {
        throw new Error("Jenis tiket duplikat.");
      }
      items.push({ ticketTypeId, quantity });
    }
    if (items.length === 0) throw new Error("Pilih minimal satu tiket.");
    const email = String(data.email ?? "")
      .trim()
      .toLowerCase();
    const whatsapp = String(data.whatsapp ?? "").trim();
    const name = String(data.name ?? "").trim().replace(/\s+/g, " ");
    const address = String(data.address ?? "").trim().replace(/\s+/g, " ");
    if (!isValidName(name)) throw new Error("Nama lengkap wajib diisi.");
    if (!isValidAddress(address)) throw new Error("Alamat wajib diisi (minimal 8 karakter).");
    if (!isValidEmail(email)) throw new Error("Email tidak valid.");
    if (!isValidWhatsapp(whatsapp)) throw new Error("Nomor WhatsApp Indonesia tidak valid.");
    const referral = String(data.referral ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24);
    return {
      items,
      email,
      whatsapp: normalizeWhatsapp(whatsapp),
      name,
      address,
      referral,
      token: String(data.token ?? ""),
    };
  })
  .handler(async ({ data }): Promise<PaymentSession> => {
    const { assertNotStaffBuyer } = await import("@/lib/admin.server");
    assertNotStaffBuyer(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await expireStale(sql);
    const buyerId = guestBuyerId(data.whatsapp);

    await sql`
      update orders
      set status = 'cancelled'
      where user_id = ${buyerId} and status = 'pending'
    `;

    const lines: OrderLine[] = [];
    const stage = await loadActiveStage(sql);
    if (!stage) throw new Error("Penjualan tiket sedang ditutup.");
    const allowed = STAGE_COPY[stage.id];
    for (const item of data.items) {
      if (!allowed.types.includes(item.ticketTypeId)) {
        throw new Error(`Tiket ${TICKET_COPY[item.ticketTypeId].name} tidak dijual pada ${allowed.name}.`);
      }
      const stock = await remainingFor(sql, item.ticketTypeId, stage.id);
      if (!stock) throw new Error("Jenis tiket tidak ditemukan.");
      if (stock.remaining < item.quantity) {
        throw new Error(
          stock.remaining === 0
            ? `Tiket ${TICKET_COPY[item.ticketTypeId].name} sudah habis.`
            : `Sisa tiket ${TICKET_COPY[item.ticketTypeId].name} tidak cukup. Kurangi jumlah.`,
        );
      }
      const held = await userHeld(sql, buyerId, item.ticketTypeId);
      if (held + item.quantity > PER_USER_LIMIT) {
        const left = Math.max(0, PER_USER_LIMIT - held);
        throw new Error(
          left === 0
            ? `Batas ${PER_USER_LIMIT} tiket ${TICKET_COPY[item.ticketTypeId].name} per nomor WhatsApp sudah terpenuhi.`
            : `Nomor ini masih bisa membeli ${left} tiket ${TICKET_COPY[item.ticketTypeId].name}.`,
        );
      }
      lines.push({
        ticketTypeId: item.ticketTypeId,
        ticketName: TICKET_COPY[item.ticketTypeId].name,
        quantity: item.quantity,
        unitPrice: stock.priceIdr,
      });
    }

    const summary = summarizeLines(lines);
    const grossAmount = lines.reduce((n, line) => n + line.unitPrice * line.quantity, 0);
    const uniqueCode = uniqueCodeFromPhone(data.whatsapp);
    const payableAmount = grossAmount + uniqueCode;
    const orderId = newOrderId();
    let referral: string | null = null;
    try {
      referral = await resolveAgentReferral(sql, data.referral);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "Kode referal tidak valid.") throw e;
      referral = null;
    }
    try {
      await ensureBuyerProfiles(sql);
      const existing = await sql<{ user_id: string }>`
        select user_id from buyer_profiles where user_id = ${buyerId} limit 1
      `;
      if (existing[0]) {
        await sql`
          update buyer_profiles
          set email = ${data.email},
              whatsapp = ${data.whatsapp},
              referral_code = coalesce(referral_code, ${referral})
          where user_id = ${buyerId}
        `;
      } else {
        await sql`
          insert into buyer_profiles (user_id, email, whatsapp, referral_code)
          values (${buyerId}, ${data.email}, ${data.whatsapp}, ${referral})
        `;
      }
    } catch {
      /* profile is best-effort for admin lists */
    }

    await sql`
      insert into orders (
        id, user_id, ticket_type_id, quantity, gross_amount, email, whatsapp, holder_name, holder_address, status, payment_type, midtrans_token, referral_code, stage_id
      ) values (
        ${orderId},
        ${buyerId},
        ${summary.ticketTypeId},
        ${summary.quantity},
        ${grossAmount},
        ${data.email},
        ${data.whatsapp},
        ${data.name},
        ${data.address},
        'pending',
        ${"qris"},
        ${null},
        ${referral},
        ${stage.id}
      )
    `;

    for (const line of lines) {
      await sql`
        insert into order_items (id, order_id, ticket_type_id, quantity, unit_price)
        values (
          ${crypto.randomUUID()},
          ${orderId},
          ${line.ticketTypeId},
          ${line.quantity},
          ${line.unitPrice}
        )
      `;
    }

    return {
      orderId,
      qrisImage: QRIS.image,
      grossAmount,
      uniqueCode,
      payableAmount,
      ticketName: summary.ticketName,
      quantity: summary.quantity,
      items: lines.map((line) => ({ name: line.ticketName, quantity: line.quantity })),
    };
  });

export const confirmDemoPayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { orderId?: string; paymentType?: string };
    const orderId = String(data.orderId ?? "").trim();
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    return {
      orderId,
      paymentType: String(data.paymentType ?? "qris").slice(0, 40),
    };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.orderId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    if (order.status === "paid") {
      const tickets = await sql<TicketRow>`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
      return { order: await mapOrderFull(sql, order), tickets: tickets.map(mapTicket) };
    }
    if (order.status !== "pending") throw new Error("Pesanan ini sudah tidak aktif.");
    const paid = await fulfillPaidOrder(sql, order.id, data.paymentType);
    if (!paid) throw new Error("Gagal mengonfirmasi pembayaran.");
    const tickets = await sql<TicketRow>`
      select * from tickets where order_id = ${paid.id} order by created_at
    `;
    return { order: await mapOrderFull(sql, paid), tickets: tickets.map(mapTicket) };
  });

export const confirmMidtransPayment = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const orderId = String((input as { orderId?: string }).orderId ?? "").trim();
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    return { orderId };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const { fetchMidtransStatus, isPaidStatus, isMidtransConfigured } = await import(
      "@/lib/midtrans.server"
    );
    const sql = await getSql();
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.orderId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    if (order.status === "paid") {
      const tickets = await sql<TicketRow>`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
      return { order: await mapOrderFull(sql, order), tickets: tickets.map(mapTicket) };
    }
    if (!isMidtransConfigured()) {
      throw new Error("Midtrans belum dikonfigurasi.");
    }
    const status = await fetchMidtransStatus(order.id);
    if (!isPaidStatus(status?.transaction_status)) {
      throw new Error("Pembayaran belum lunas di Midtrans.");
    }
    const paid = await fulfillPaidOrder(sql, order.id, status?.payment_type ?? null);
    if (!paid) throw new Error("Gagal mengonfirmasi pembayaran.");
    const tickets = await sql<TicketRow>`
      select * from tickets where order_id = ${paid.id} order by created_at
    `;
    return { order: await mapOrderFull(sql, paid), tickets: tickets.map(mapTicket) };
  });

export const getMyTickets = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { email?: string; whatsapp?: string };
    const email = String(data.email ?? "").trim().toLowerCase();
    const whatsapp = String(data.whatsapp ?? "").trim();
    if (!isValidEmail(email)) throw new Error("Email tidak valid.");
    if (!isValidWhatsapp(whatsapp)) throw new Error("Nomor WhatsApp Indonesia tidak valid.");
    return { email, whatsapp: normalizeWhatsapp(whatsapp) };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await expireStale(sql);
    const tickets = await sql<TicketRow>`
      select * from tickets
      where holder_email = ${data.email} and holder_whatsapp = ${data.whatsapp}
      order by created_at desc
    `;
    const pending = await sql<OrderRow>`
      select * from orders
      where email = ${data.email} and whatsapp = ${data.whatsapp} and status in ('pending', 'submitted')
      order by created_at desc
    `;
    return {
      tickets: tickets.map(mapTicket),
      pending: await Promise.all(pending.map((row) => mapOrderFull(sql, row))),
    };
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const orderId = String((input as { orderId?: string }).orderId ?? "").trim();
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    return { orderId };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await expireStale(sql);
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.orderId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    const tickets = await sql<TicketRow>`
      select * from tickets where order_id = ${order.id} order by created_at
    `;
    return { order: await mapOrderFull(sql, order), tickets: tickets.map(mapTicket) };
  });

const PROOF_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const PROOF_MAX_CHARS = 5_500_000;

export const uploadPaymentProof = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as {
      orderId?: string;
      fileName?: string;
      mime?: string;
      data?: string;
    };
    const orderId = String(data.orderId ?? "").trim();
    const fileName = String(data.fileName ?? "bukti.jpg").replace(/[^\w.\- ()]/g, "").slice(0, 120);
    const mime = String(data.mime ?? "").toLowerCase();
    const payload = String(data.data ?? "").replace(/\s/g, "");
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    if (!PROOF_MIME.has(mime)) throw new Error("Unggah foto JPG, PNG, atau WEBP.");
    if (!payload || payload.length < 80) throw new Error("File bukti transfer tidak valid.");
    if (payload.length > PROOF_MAX_CHARS) throw new Error("Ukuran bukti terlalu besar. Maksimal sekitar 4 MB.");
    return { orderId, fileName: fileName || "bukti.jpg", mime: mime === "image/jpg" ? "image/jpeg" : mime, data: payload };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await expireStale(sql);
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.orderId} limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("Pesanan tidak ditemukan.");
    if (order.status === "paid") throw new Error("Pesanan ini sudah lunas.");
    if (order.status !== "pending" && order.status !== "submitted") {
      throw new Error("Pesanan ini sudah tidak aktif.");
    }
    await sql`
      insert into payment_proofs (order_id, user_id, file_name, mime, data, uploaded_at)
      values (${order.id}, ${order.user_id}, ${data.fileName}, ${data.mime}, ${data.data}, now())
      on conflict (order_id) do update set
        file_name = excluded.file_name,
        mime = excluded.mime,
        data = excluded.data,
        uploaded_at = now()
    `;
    await sql`
      update orders
      set status = 'submitted', payment_type = 'qris'
      where id = ${order.id} and status in ('pending', 'submitted')
    `;
    const updated = await sql<OrderRow>`
      select * from orders where id = ${order.id} limit 1
    `;
    return { order: await mapOrderFull(sql, updated[0] ?? order) };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { username?: string; password?: string };
    return {
      username: String(data.username ?? "").trim().toLowerCase(),
      password: String(data.password ?? ""),
    };
  })
  .handler(async ({ data }) => {
    const {
      ADMIN_PASSWORD,
      ADMIN_USERNAME,
      hashPassword,
      issueStaffToken,
      setStaffCookie,
      verifyPassword,
    } = await import("@/lib/admin.server");
    let role: "admin" | "crew" | "agent" | null = null;
    if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      role = "admin";
    }
    try {
      const { getSql } = await import("@/lib/db");
      const { asStaffRole } = await import("@/lib/admin.server");
      const sql = await getSql();
      await ensureStaffSeed(sql, hashPassword);
      if (!role) {
        const rows = await sql<{ username: string; password_hash: string; role: string }>`
          select username, password_hash, role from staff where username = ${data.username} limit 1
        `;
        const row = rows[0];
        if (row && verifyPassword(data.password, row.password_hash)) {
          role = asStaffRole(row.role);
        }
      }
    } catch {
      /* DB optional for the seeded admin account */
    }
    if (!role) throw new Error("User atau password salah.");
    const token = issueStaffToken(data.username, role);
    setStaffCookie(data.username, role);
    return { ok: true as const, username: data.username, role, token };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearStaffCookie } = await import("@/lib/admin.server");
  clearStaffCookie();
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ token: String((input as { token?: string }).token ?? "") }))
  .handler(async ({ data }) => {
    const { readStaffSession } = await import("@/lib/admin.server");
    const session = readStaffSession(data.token);
    if (!session) return { ok: false as const };
    return { ok: true as const, username: session.username, role: session.role };
  });

export type AdminTypeStat = {
  id: TicketTypeId;
  name: string;
  priceIdr: number;
  quota: number;
  sold: number;
  remaining: number;
};

export type AdminUser = {
  username: string;
  role: "admin" | "crew" | "agent";
  createdAt: string;
  referralCode: string;
};

export type AdminBuyer = {
  id: string;
  email: string;
  whatsapp: string;
  createdAt: string;
  referralCode: string;
};

export type AdminStageOffer = {
  ticketTypeId: TicketTypeId;
  name: string;
  priceIdr: number;
  quota: number;
  sold: number;
};

export type AdminStage = {
  id: SalesStageId;
  name: string;
  enabled: boolean;
  startsAt: string | null;
  endsAt: string | null;
  offers: AdminStageOffer[];
};

export type AdminDashboard = {
  username: string;
  role: "admin" | "crew" | "agent";
  types: AdminTypeStat[];
  ticketsSold: number;
  revenue: number;
  submittedCount: number;
  users: AdminUser[];
  buyers: AdminBuyer[];
  orders: OrderRecord[];
  referralCode: string;
  stages: AdminStage[];
  activeStageId: SalesStageId | null;
};

async function ensureBuyerProfiles(sql: Sql) {
  await sql.query(`
    create table if not exists buyer_profiles (
      user_id text primary key,
      email text not null,
      whatsapp text not null,
      referral_code text,
      created_at timestamptz not null default now()
    )
  `);
  try {
    await sql.query(`alter table buyer_profiles add column if not exists referral_code text`);
  } catch {
    /* exists */
  }
}

async function loadBuyers(sql: Sql): Promise<AdminBuyer[]> {
  await ensureBuyerProfiles(sql);
  try {
    const rows = await sql<{
      user_id: string;
      email: string;
      whatsapp: string;
      created_at: string;
      referral_code: string | null;
    }>`
      select user_id, email, whatsapp, created_at, referral_code
      from buyer_profiles
      order by created_at desc
    `;
    return rows.map((row) => ({
      id: row.user_id,
      email: row.email,
      whatsapp: row.whatsapp,
      createdAt: String(row.created_at),
      referralCode: String(row.referral_code || ""),
    }));
  } catch {
    return [];
  }
}
async function ensureStaffSeed(
  sql: Sql,
  hashPassword: (password: string) => string,
) {
  await sql.query(`
    create table if not exists staff (
      username text primary key,
      password_hash text not null,
      role text not null,
      referral_code text,
      created_at timestamptz not null default now()
    )
  `);
  for (const stmt of [
    `alter table staff add column if not exists referral_code text`,
    `alter table orders add column if not exists referral_code text`,
    `alter table staff drop constraint if exists staff_role_check`,
  ]) {
    try {
      await sql.query(stmt);
    } catch {
      /* already applied */
    }
  }
  try {
    await sql.query(
      `alter table staff add constraint staff_role_check check (role in ('admin', 'crew', 'agent'))`,
    );
  } catch {
    /* exists */
  }
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from staff where username = ${"iang"}
  `;
  if (asInt(existing[0]?.n) > 0) return;
  await sql`
    insert into staff (username, password_hash, role)
    values (${"iang"}, ${hashPassword("$golden")}, ${"admin"})
    on conflict (username) do nothing
  `;
}

export const getAdminDashboard = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ token: String((input as { token?: string }).token ?? "") }))
  .handler(async ({ data }) => {
  try {
  const { requireStaff, hashPassword } = await import("@/lib/admin.server");
  const session = requireStaff(data.token);
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await expireStale(sql);
  await ensureStaffSeed(sql, hashPassword);
  await ensureStageSeed(sql);

  const types = await sql<TypeRow>`
    select id, name, price_idr, quota, per_user_limit from ticket_types order by sort_order
  `;
  const soldRows = await sql<{ ticket_type_id: string; sold: number }>`
    select t.ticket_type_id, count(*)::int as sold
    from tickets t
    group by t.ticket_type_id
  `;
  const soldMap = Object.fromEntries(soldRows.map((row) => [row.ticket_type_id, asInt(row.sold)]));
  const typeStats: AdminTypeStat[] = [];
  for (const type of types) {
    if (!isTicketTypeId(type.id)) continue;
    const sold = asInt(soldMap[type.id]);
    const quota = asInt(type.quota);
    typeStats.push({
      id: type.id,
      name: type.name,
      priceIdr: asInt(type.price_idr),
      quota,
      sold,
      remaining: Math.max(0, quota - sold),
    });
  }

  const paid = await sql<OrderRow>`
    select * from orders where status = 'paid' order by paid_at desc
  `;
  const review = await sql<OrderRow>`
    select * from orders
    where status in ('submitted', 'paid')
    order by created_at desc
    limit 80
  `;
  const me = await sql<{ referral_code: string | null }>`
    select referral_code from staff where username = ${session.username} limit 1
  `;
  const referralCode = String(me[0]?.referral_code || (session.role === "agent" ? session.username : "")).toLowerCase();
  const scopedPaid =
    session.role === "agent"
      ? paid.filter((row) => String(row.referral_code ?? "").toLowerCase() === referralCode)
      : paid;
  const scopedReview =
    session.role === "agent"
      ? review.filter((row) => String(row.referral_code ?? "").toLowerCase() === referralCode)
      : review;
  const revenue = scopedPaid.reduce(
    (sum, row) => sum + asInt(row.gross_amount) + uniqueCodeFromPhone(row.whatsapp),
    0,
  );
  const submittedCount = scopedReview.filter((row) => row.status === "submitted").length;
  const users =
    session.role === "admin"
      ? await sql<{ username: string; role: string; created_at: string; referral_code: string | null }>`
          select username, role, created_at, referral_code from staff order by created_at asc
        `
      : [];

  const agentSold: Record<TicketTypeId, number> = { vvip: 0, vip: 0, festival: 0 };
  if (session.role === "agent") {
    for (const row of scopedPaid) {
      const full = await mapOrderFull(sql, row);
      for (const item of full.items) {
        if (isTicketTypeId(item.ticketTypeId)) agentSold[item.ticketTypeId] += item.quantity;
      }
    }
  }

  const active = await loadActiveStage(sql);
  const stageRows = await sql<StageRow>`
    select id, name, enabled, starts_at, ends_at, sort_order from ticket_stages order by sort_order
  `;
  const offerRows = await sql<{ stage_id: string; ticket_type_id: string; price_idr: number; quota: number }>`
    select stage_id, ticket_type_id, price_idr, quota from ticket_stage_offers
  `;
  const soldStageRows = await sql<{ stage_id: string; ticket_type_id: string; sold: number }>`
    select coalesce(o.stage_id, '') as stage_id, oi.ticket_type_id, coalesce(sum(oi.quantity), 0)::int as sold
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.status in ('pending', 'submitted', 'paid')
    group by coalesce(o.stage_id, ''), oi.ticket_type_id
  `;
  const soldStageMap = Object.fromEntries(
    soldStageRows.map((row) => [`${row.stage_id}:${row.ticket_type_id}`, asInt(row.sold)]),
  );
  const stages: AdminStage[] = stageRows.filter((row) => isSalesStageId(row.id)).map((row) => {
    const id = row.id as SalesStageId;
    const allowed = STAGE_COPY[id].types;
    return {
      id,
      name: STAGE_COPY[id].name,
      enabled: Boolean(row.enabled),
      startsAt: row.starts_at ? String(row.starts_at) : null,
      endsAt: row.ends_at ? String(row.ends_at) : null,
      offers: allowed.map((typeId) => {
        const offer = offerRows.find((item) => item.stage_id === id && item.ticket_type_id === typeId);
        return {
          ticketTypeId: typeId,
          name: TICKET_COPY[typeId].name,
          priceIdr: asInt(offer?.price_idr ?? 0),
          quota: asInt(offer?.quota ?? 0),
          sold: asInt(soldStageMap[`${id}:${typeId}`]),
        };
      }),
    };
  });

  return {
    username: session.username,
    role: session.role,
    types:
      session.role === "agent"
        ? typeStats.map((t) => ({ ...t, sold: agentSold[t.id], remaining: Math.max(0, t.quota - t.sold) }))
        : typeStats,
    ticketsSold:
      session.role === "agent"
        ? agentSold.vvip + agentSold.vip + agentSold.festival
        : typeStats.reduce((n, t) => n + t.sold, 0),
    revenue: session.role === "admin" ? revenue : session.role === "agent" ? revenue : 0,
    submittedCount,
    users: users.map((row) => ({
      username: row.username,
      role: row.role === "agent" ? "agent" : row.role === "admin" ? "admin" : "crew",
      createdAt: String(row.created_at),
      referralCode: String(row.referral_code || (row.role === "agent" ? row.username : "")),
    })),
    buyers: session.role === "admin" ? await loadBuyers(sql) : [],
    orders: await Promise.all(scopedReview.map((row) => mapOrderFull(sql, row))),
    referralCode,
    stages,
    activeStageId: active && isSalesStageId(active.id) ? active.id : null,
  } satisfies AdminDashboard;
  } catch (e: unknown) {
    if (e instanceof Error && (e.message === "Unauthorized" || e.message.startsWith("Hanya"))) throw e;
    throw new Error(e instanceof Error ? e.message : "Gagal memuat dashboard.");
  }
});

export const updateTicketStages = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as {
      token?: string;
      stages?: {
        id?: string;
        enabled?: boolean;
        startsAt?: string | null;
        endsAt?: string | null;
        offers?: { ticketTypeId?: string; priceIdr?: number; quota?: number }[];
      }[];
    };
    const stages: {
      id: SalesStageId;
      enabled: boolean;
      startsAt: string | null;
      endsAt: string | null;
      offers: { ticketTypeId: TicketTypeId; priceIdr: number; quota: number }[];
    }[] = [];
    for (const stage of data.stages ?? []) {
      const id = String(stage.id ?? "");
      if (!isSalesStageId(id)) continue;
      const allowed = STAGE_COPY[id].types;
      const offers: { ticketTypeId: TicketTypeId; priceIdr: number; quota: number }[] = [];
      for (const offer of stage.offers ?? []) {
        const ticketTypeId = String(offer.ticketTypeId ?? "");
        if (!isTicketTypeId(ticketTypeId)) continue;
        if (!allowed.includes(ticketTypeId)) continue;
        const priceIdr = Number(offer.priceIdr);
        const quota = Number(offer.quota);
        if (!Number.isInteger(priceIdr) || priceIdr < 1) throw new Error(`Harga ${TICKET_COPY[ticketTypeId].name} minimal Rp 1.`);
        if (!Number.isInteger(quota) || quota < 0) throw new Error(`Kuota ${TICKET_COPY[ticketTypeId].name} tidak valid.`);
        offers.push({ ticketTypeId, priceIdr, quota });
      }
      if (offers.length === 0) throw new Error(`${STAGE_COPY[id].name} wajib punya minimal satu jenis tiket.`);
      const startsAt = stage.startsAt ? String(stage.startsAt) : null;
      const endsAt = stage.endsAt ? String(stage.endsAt) : null;
      if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
        throw new Error(`${STAGE_COPY[id].name}: waktu mulai harus sebelum waktu selesai.`);
      }
      stages.push({
        id,
        enabled: Boolean(stage.enabled),
        startsAt,
        endsAt,
        offers,
      });
    }
    if (stages.length === 0) throw new Error("Tidak ada tahap penjualan.");
    return { stages, token: String(data.token ?? "") };
  })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin.server");
    requireAdmin(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await ensureStageSeed(sql);
    for (const stage of data.stages) {
      for (const offer of stage.offers) {
        const stock = await remainingFor(sql, offer.ticketTypeId, stage.id);
        const sold = stock ? stock.quota - stock.remaining : 0;
        if (offer.quota < sold) {
          throw new Error(
            `Kuota ${TICKET_COPY[offer.ticketTypeId].name} pada ${STAGE_COPY[stage.id].name} tidak boleh lebih kecil dari yang sudah terjual (${sold}).`,
          );
        }
      }
      await sql`
        update ticket_stages
        set enabled = ${stage.enabled},
            starts_at = ${stage.startsAt},
            ends_at = ${stage.endsAt}
        where id = ${stage.id}
      `;
      await sql`delete from ticket_stage_offers where stage_id = ${stage.id}`;
      for (const offer of stage.offers) {
        await sql`
          insert into ticket_stage_offers (stage_id, ticket_type_id, price_idr, quota)
          values (${stage.id}, ${offer.ticketTypeId}, ${offer.priceIdr}, ${offer.quota})
        `;
      }
    }
    return { ok: true as const };
  });

export const createStaffAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { username?: string; password?: string; role?: string; token?: string };
    const username = String(data.username ?? "").trim().toLowerCase();
    const password = String(data.password ?? "");
    const role = data.role === "admin" ? "admin" : data.role === "agent" ? "agent" : "crew";
    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
      throw new Error("Username 3–24 karakter, huruf kecil, angka, atau underscore.");
    }
    if (username === "iang") throw new Error("Username ini sudah dipakai.");
    if (password.length < 6) throw new Error("Password minimal 6 karakter.");
    return { username, password, role, token: String(data.token ?? "") };
  })
  .handler(async ({ data }) => {
    const { requireAdmin, hashPassword } = await import("@/lib/admin.server");
    requireAdmin(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await ensureStaffSeed(sql, hashPassword);
    const taken = await sql<{ username: string }>`
      select username from staff where username = ${data.username} limit 1
    `;
    if (taken[0]) throw new Error("Username sudah dipakai.");
    const referral = data.role === "agent" ? data.username : null;
    try {
      await sql`
        insert into staff (username, password_hash, role, referral_code)
        values (${data.username}, ${hashPassword(data.password)}, ${data.role}, ${referral})
      `;
    } catch (e: unknown) {
      const takenAgain = await sql<{ username: string }>`
        select username from staff where username = ${data.username} limit 1
      `;
      if (takenAgain[0]) throw new Error("Username sudah dipakai.");
      throw new Error(e instanceof Error ? e.message : "Gagal membuat akun.");
    }
    return { ok: true as const, username: data.username, role: data.role };
  });

export const deleteStaffAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { username?: string; token?: string };
    const username = String(data.username ?? "").trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Akun tidak ditemukan.");
    return { username, token: String(data.token ?? "") };
  })
  .handler(async ({ data }) => {
    try {
      const { ADMIN_USERNAME, requireAdmin } = await import("@/lib/admin.server");
      const session = requireAdmin(data.token);
      if (data.username === ADMIN_USERNAME) throw new Error("Akun admin utama tidak bisa dihapus.");
      if (data.username === session.username) throw new Error("Tidak bisa menghapus akun yang sedang dipakai.");
      const { getSql } = await import("@/lib/db");
      const { hashPassword } = await import("@/lib/admin.server");
      const sql = await getSql();
      await ensureStaffSeed(sql, hashPassword);
      const rows = await sql<{ username: string; role: string }>`
        select username, role from staff where username = ${data.username} limit 1
      `;
      if (!rows[0]) throw new Error("Akun tidak ditemukan.");
      if (rows[0].role === "admin") {
        const admins = await sql<{ n: number }>`
          select count(*)::int as n from staff where role = 'admin'
        `;
        const n = Number(admins[0]?.n ?? 0);
        if (n <= 1) throw new Error("Tidak bisa menghapus admin terakhir.");
      }
      const removed = await sql<{ username: string }>`
        delete from staff where username = ${data.username} returning username
      `;
      if (!removed[0]) throw new Error("Akun tidak ditemukan.");
      return { ok: true as const, username: data.username };
    } catch (e: unknown) {
      if (e instanceof Error && /tidak bisa|tidak ditemukan|Unauthorized|Hanya admin/i.test(e.message)) {
        throw e;
      }
      throw new Error(e instanceof Error ? e.message : "Gagal menghapus akun.");
    }
  });

export const listAdminOrders = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ token: String((input as { token?: string }).token ?? "") }))
  .handler(async ({ data }) => {
  const { requireStaff } = await import("@/lib/admin.server");
  requireStaff(data.token);
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<OrderRow>`
    select * from orders
    where status in ('submitted', 'paid')
    order by created_at desc
    limit 80
  `;
  return Promise.all(rows.map((row) => mapOrderFull(sql, row)));
});

export const getAdminProof = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { orderId?: string; token?: string };
    const orderId = String(data.orderId ?? "").trim();
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    return { orderId, token: String(data.token ?? "") };
  })
  .handler(async ({ data }) => {
    const { requireCrew } = await import("@/lib/admin.server");
    requireCrew(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ file_name: string; mime: string; data: string }>`
      select file_name, mime, data from payment_proofs where order_id = ${data.orderId} limit 1
    `;
    const proof = rows[0];
    if (!proof) throw new Error("Bukti transfer belum diunggah.");
    return { fileName: proof.file_name, mime: proof.mime, data: proof.data };
  });

export const adminConfirmOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { orderId?: string; token?: string };
    const orderId = String(data.orderId ?? "").trim();
    if (!orderId) throw new Error("Pesanan tidak ditemukan.");
    return { orderId, token: String(data.token ?? "") };
  })
  .handler(async ({ data }) => {
    const { requireCrew } = await import("@/lib/admin.server");
    requireCrew(data.token);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const paid = await fulfillPaidOrder(sql, data.orderId, "qris");
    if (!paid) throw new Error("Pesanan tidak bisa dikonfirmasi.");
    return { order: await mapOrderFull(sql, paid) };
  });

export const getTicketByCode = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const code = String((input as { code?: string }).code ?? "")
      .trim()
      .toUpperCase();
    if (!code) throw new Error("Tiket tidak ditemukan.");
    return { code };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<TicketRow>`
      select * from tickets where code = ${data.code} limit 1
    `;
    const ticket = rows[0];
    if (!ticket) throw new Error("Tiket tidak ditemukan.");
    return mapTicket(ticket);
  });
