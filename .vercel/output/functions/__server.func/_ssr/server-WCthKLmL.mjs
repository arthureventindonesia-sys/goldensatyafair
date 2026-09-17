import { c as isValidName, d as uniqueCodeFromPhone, l as isValidWhatsapp, o as isValidAddress, s as isValidEmail, u as normalizeWhatsapp } from "./format-LT3CbQE3.mjs";
import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as STAGE_COPY, c as isSalesStageId, i as QRIS, l as isTicketTypeId, o as TICKET_COPY, t as EVENT } from "./event-IC9aXe9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-WCthKLmL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asInt(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function guestBuyerId(whatsapp) {
	return `guest:${normalizeWhatsapp(whatsapp)}`;
}
async function resolveAgentReferral(sql, requested) {
	const ref = String(requested ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
	if (!ref) return null;
	const agents = await sql`
    select username, referral_code from staff
    where role = 'agent'
      and (lower(username) = ${ref} or lower(coalesce(referral_code, '')) = ${ref})
    limit 1
  `;
	if (!agents[0]) throw new Error("Kode referal tidak valid.");
	return String(agents[0].referral_code || agents[0].username).toLowerCase();
}
async function expireStale(sql) {
	await sql`
    update orders
    set status = 'expired'
    where status = 'pending'
      and created_at < now() - interval '15 minutes'
  `;
}
async function remainingFor(sql, typeId, stageId) {
	const offer = (await sql`
    select price_idr, quota from ticket_stage_offers
    where stage_id = ${stageId} and ticket_type_id = ${typeId}
    limit 1
  `)[0];
	if (!offer) return null;
	const held = await sql`
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
		remaining: Math.max(0, asInt(offer.quota) - asInt(held[0]?.total))
	};
}
async function userHeld(sql, userId, typeId) {
	return asInt((await sql`
    select coalesce(sum(oi.quantity), 0)::int as total
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.user_id = ${userId}
      and oi.ticket_type_id = ${typeId}
      and o.status in ('pending', 'submitted', 'paid')
  `)[0]?.total);
}
async function ensureStageSeed(sql) {
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
	} catch {}
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
async function loadActiveStage(sql) {
	await ensureStageSeed(sql);
	const row = (await sql`
    select id, name, enabled, starts_at, ends_at, sort_order
    from ticket_stages
    where enabled = true
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    order by sort_order asc
    limit 1
  `)[0];
	if (!row || !isSalesStageId(row.id)) return null;
	return {
		...row,
		id: row.id
	};
}
async function loadCatalog(sql) {
	const stage = await loadActiveStage(sql);
	const tickets = [];
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
				perUserLimit: 5
			});
		}
	}
	return {
		event: {
			id: EVENT.id,
			name: EVENT.name,
			venue: EVENT.venue,
			city: EVENT.city,
			startsAt: EVENT.startsAt
		},
		stage: stage ? {
			id: stage.id,
			name: STAGE_COPY[stage.id].name,
			startsAt: stage.starts_at ? String(stage.starts_at) : null,
			endsAt: stage.ends_at ? String(stage.ends_at) : null
		} : null,
		tickets
	};
}
function mapLine(row) {
	const ticketTypeId = isTicketTypeId(row.ticket_type_id) ? row.ticket_type_id : "festival";
	return {
		ticketTypeId,
		ticketName: TICKET_COPY[ticketTypeId].name,
		quantity: asInt(row.quantity),
		unitPrice: asInt(row.unit_price)
	};
}
function summarizeLines(lines) {
	return {
		quantity: lines.reduce((n, line) => n + line.quantity, 0),
		ticketName: lines.map((line) => `${line.quantity} ${line.ticketName}`).join(" · "),
		ticketTypeId: lines[0]?.ticketTypeId ?? "festival"
	};
}
function mapOrder(row, items = []) {
	const lines = items.length > 0 ? items.map(mapLine) : [mapLine({
		id: row.id,
		order_id: row.id,
		ticket_type_id: row.ticket_type_id,
		quantity: row.quantity,
		unit_price: asInt(row.quantity) > 0 ? Math.round(asInt(row.gross_amount) / asInt(row.quantity)) : 0
	})];
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
		status: row.status,
		paymentType: row.payment_type,
		createdAt: String(row.created_at),
		paidAt: row.paid_at ? String(row.paid_at) : null,
		hasProof: false,
		proofUploadedAt: null,
		referralCode: String(row.referral_code ?? "").trim().toLowerCase()
	};
}
function mapTicket(row) {
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
		createdAt: String(row.created_at)
	};
}
function randomHex(bytes) {
	const buf = new Uint8Array(bytes);
	crypto.getRandomValues(buf);
	return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
async function itemsFor(sql, orderId) {
	return sql`
    select * from order_items where order_id = ${orderId} order by ticket_type_id
  `;
}
async function mapOrderFull(sql, row) {
	const items = await itemsFor(sql, row.id);
	const proofs = await sql`
    select uploaded_at from payment_proofs where order_id = ${row.id} limit 1
  `;
	const mapped = mapOrder(row, items);
	mapped.hasProof = proofs.length > 0;
	mapped.proofUploadedAt = proofs[0]?.uploaded_at ? String(proofs[0].uploaded_at) : null;
	return mapped;
}
async function issueTickets(sql, order) {
	const stored = await itemsFor(sql, order.id);
	const lines = stored.length > 0 ? stored : [{
		id: order.id,
		order_id: order.id,
		ticket_type_id: order.ticket_type_id,
		quantity: order.quantity,
		unit_price: 0
	}];
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
async function fulfillPaidOrder(sql, orderId, paymentType) {
	const order = (await sql`select * from orders where id = ${orderId} limit 1`)[0];
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
	if (asInt((await sql`
    select count(*)::int as n from tickets where order_id = ${orderId}
  `)[0]?.n) === 0) await issueTickets(sql, order);
	return (await sql`select * from orders where id = ${orderId} limit 1`)[0] ?? null;
}
function newOrderId() {
	return `GSF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
var getCatalog_createServerFn_handler = createServerRpc({
	id: "7af4c2fe32b4e9a3f8d823c7c3844104d0c8ab2f4d8e58465f9bdbfb21b12acc",
	name: "getCatalog",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).handler(getCatalog_createServerFn_handler, async () => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	return loadCatalog(sql);
});
var getCheckoutState_createServerFn_handler = createServerRpc({
	id: "3ee8d25cb77ae25a33de5df486cfcb89f76b0c782da3ddcfccebfaedae596f31",
	name: "getCheckoutState",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getCheckoutState.__executeServer(opts));
var getCheckoutState = createServerFn({ method: "POST" }).validator((input) => ({
	token: String(input?.token ?? ""),
	whatsapp: String(input?.whatsapp ?? "")
})).handler(getCheckoutState_createServerFn_handler, async ({ data }) => {
	try {
		const { assertNotStaffBuyer } = await import("./admin.server-ZpDtM_jc.mjs");
		assertNotStaffBuyer(data.token);
		const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
		const sql = await getSql();
		await expireStale(sql);
		const catalog = await loadCatalog(sql);
		const buyerId = isValidWhatsapp(data.whatsapp) ? guestBuyerId(data.whatsapp) : "";
		const held = {
			vvip: buyerId ? await userHeld(sql, buyerId, "vvip") : 0,
			vip: buyerId ? await userHeld(sql, buyerId, "vip") : 0,
			festival: buyerId ? await userHeld(sql, buyerId, "festival") : 0
		};
		return {
			...catalog,
			held
		};
	} catch (e) {
		if (e instanceof Error && (e.message === "Unauthorized" || e.message.includes("tidak bisa membeli"))) throw e;
		throw new Error(e instanceof Error ? e.message : "Gagal memuat checkout.");
	}
});
var createOrder_createServerFn_handler = createServerRpc({
	id: "683ccb44b33bed7a2d1ce13be2ac4f5cf1d9840f5fcbf247ffb2679c4abacbc0",
	name: "createOrder",
	filename: "src/lib/tickets/server.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const rawItems = Array.isArray(data.items) && data.items.length > 0 ? data.items : [{
		ticketTypeId: data.ticketTypeId,
		quantity: data.quantity
	}];
	const items = [];
	for (const item of rawItems) {
		const ticketTypeId = String(item.ticketTypeId ?? "");
		const quantity = Number(item.quantity);
		if (!isTicketTypeId(ticketTypeId)) continue;
		if (!Number.isInteger(quantity) || quantity < 0 || quantity > 5) throw new Error(`Jumlah tiket ${TICKET_COPY[ticketTypeId]?.name ?? ""} 0–5.`);
		if (quantity === 0) continue;
		if (items.some((row) => row.ticketTypeId === ticketTypeId)) throw new Error("Jenis tiket duplikat.");
		items.push({
			ticketTypeId,
			quantity
		});
	}
	if (items.length === 0) throw new Error("Pilih minimal satu tiket.");
	const email = String(data.email ?? "").trim().toLowerCase();
	const whatsapp = String(data.whatsapp ?? "").trim();
	const name = String(data.name ?? "").trim().replace(/\s+/g, " ");
	const address = String(data.address ?? "").trim().replace(/\s+/g, " ");
	if (!isValidName(name)) throw new Error("Nama lengkap wajib diisi.");
	if (!isValidAddress(address)) throw new Error("Alamat wajib diisi (minimal 8 karakter).");
	if (!isValidEmail(email)) throw new Error("Email tidak valid.");
	if (!isValidWhatsapp(whatsapp)) throw new Error("Nomor WhatsApp Indonesia tidak valid.");
	const referral = String(data.referral ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
	return {
		items,
		email,
		whatsapp: normalizeWhatsapp(whatsapp),
		name,
		address,
		referral,
		token: String(data.token ?? "")
	};
}).handler(createOrder_createServerFn_handler, async ({ data }) => {
	const { assertNotStaffBuyer } = await import("./admin.server-ZpDtM_jc.mjs");
	assertNotStaffBuyer(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const buyerId = guestBuyerId(data.whatsapp);
	await sql`
      update orders
      set status = 'cancelled'
      where user_id = ${buyerId} and status = 'pending'
    `;
	const lines = [];
	const stage = await loadActiveStage(sql);
	if (!stage) throw new Error("Penjualan tiket sedang ditutup.");
	const allowed = STAGE_COPY[stage.id];
	for (const item of data.items) {
		if (!allowed.types.includes(item.ticketTypeId)) throw new Error(`Tiket ${TICKET_COPY[item.ticketTypeId].name} tidak dijual pada ${allowed.name}.`);
		const stock = await remainingFor(sql, item.ticketTypeId, stage.id);
		if (!stock) throw new Error("Jenis tiket tidak ditemukan.");
		if (stock.remaining < item.quantity) throw new Error(stock.remaining === 0 ? `Tiket ${TICKET_COPY[item.ticketTypeId].name} sudah habis.` : `Sisa tiket ${TICKET_COPY[item.ticketTypeId].name} tidak cukup. Kurangi jumlah.`);
		const held = await userHeld(sql, buyerId, item.ticketTypeId);
		if (held + item.quantity > 5) {
			const left = Math.max(0, 5 - held);
			throw new Error(left === 0 ? `Batas 5 tiket ${TICKET_COPY[item.ticketTypeId].name} per nomor WhatsApp sudah terpenuhi.` : `Nomor ini masih bisa membeli ${left} tiket ${TICKET_COPY[item.ticketTypeId].name}.`);
		}
		lines.push({
			ticketTypeId: item.ticketTypeId,
			ticketName: TICKET_COPY[item.ticketTypeId].name,
			quantity: item.quantity,
			unitPrice: stock.priceIdr
		});
	}
	const summary = summarizeLines(lines);
	const grossAmount = lines.reduce((n, line) => n + line.unitPrice * line.quantity, 0);
	const uniqueCode = uniqueCodeFromPhone(data.whatsapp);
	const payableAmount = grossAmount + uniqueCode;
	const orderId = newOrderId();
	let referral = null;
	try {
		referral = await resolveAgentReferral(sql, data.referral);
	} catch (e) {
		if (e instanceof Error && e.message === "Kode referal tidak valid.") throw e;
		referral = null;
	}
	try {
		await ensureBuyerProfiles(sql);
		if ((await sql`
        select user_id from buyer_profiles where user_id = ${buyerId} limit 1
      `)[0]) await sql`
          update buyer_profiles
          set email = ${data.email},
              whatsapp = ${data.whatsapp},
              referral_code = coalesce(referral_code, ${referral})
          where user_id = ${buyerId}
        `;
		else await sql`
          insert into buyer_profiles (user_id, email, whatsapp, referral_code)
          values (${buyerId}, ${data.email}, ${data.whatsapp}, ${referral})
        `;
	} catch {}
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
	for (const line of lines) await sql`
        insert into order_items (id, order_id, ticket_type_id, quantity, unit_price)
        values (
          ${crypto.randomUUID()},
          ${orderId},
          ${line.ticketTypeId},
          ${line.quantity},
          ${line.unitPrice}
        )
      `;
	return {
		orderId,
		qrisImage: QRIS.image,
		grossAmount,
		uniqueCode,
		payableAmount,
		ticketName: summary.ticketName,
		quantity: summary.quantity,
		items: lines.map((line) => ({
			name: line.ticketName,
			quantity: line.quantity
		}))
	};
});
var confirmDemoPayment_createServerFn_handler = createServerRpc({
	id: "7bfbcb1d3ceadc1945d34f6e2cc91cf63a8e2edcfa56e5cde910b9309d5eef32",
	name: "confirmDemoPayment",
	filename: "src/lib/tickets/server.ts"
}, (opts) => confirmDemoPayment.__executeServer(opts));
var confirmDemoPayment = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		paymentType: String(data.paymentType ?? "qris").slice(0, 40)
	};
}).handler(confirmDemoPayment_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.orderId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	if (order.status === "paid") {
		const tickets = await sql`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
		return {
			order: await mapOrderFull(sql, order),
			tickets: tickets.map(mapTicket)
		};
	}
	if (order.status !== "pending") throw new Error("Pesanan ini sudah tidak aktif.");
	const paid = await fulfillPaidOrder(sql, order.id, data.paymentType);
	if (!paid) throw new Error("Gagal mengonfirmasi pembayaran.");
	const tickets = await sql`
      select * from tickets where order_id = ${paid.id} order by created_at
    `;
	return {
		order: await mapOrderFull(sql, paid),
		tickets: tickets.map(mapTicket)
	};
});
var confirmMidtransPayment_createServerFn_handler = createServerRpc({
	id: "1a9a6a9b2a79adfd5ebf80d48622b5cb7d27ab68f2423322faf82887f4120026",
	name: "confirmMidtransPayment",
	filename: "src/lib/tickets/server.ts"
}, (opts) => confirmMidtransPayment.__executeServer(opts));
var confirmMidtransPayment = createServerFn({ method: "POST" }).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(confirmMidtransPayment_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const { fetchMidtransStatus, isPaidStatus, isMidtransConfigured } = await import("./midtrans.server-BMbxrYey.mjs");
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.orderId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	if (order.status === "paid") {
		const tickets = await sql`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
		return {
			order: await mapOrderFull(sql, order),
			tickets: tickets.map(mapTicket)
		};
	}
	if (!isMidtransConfigured()) throw new Error("Midtrans belum dikonfigurasi.");
	const status = await fetchMidtransStatus(order.id);
	if (!isPaidStatus(status?.transaction_status)) throw new Error("Pembayaran belum lunas di Midtrans.");
	const paid = await fulfillPaidOrder(sql, order.id, status?.payment_type ?? null);
	if (!paid) throw new Error("Gagal mengonfirmasi pembayaran.");
	const tickets = await sql`
      select * from tickets where order_id = ${paid.id} order by created_at
    `;
	return {
		order: await mapOrderFull(sql, paid),
		tickets: tickets.map(mapTicket)
	};
});
var getMyTickets_createServerFn_handler = createServerRpc({
	id: "36d15d2ad4673680eb9dd908bcf3606494e3b967078abae683e244e6a0bf1dad",
	name: "getMyTickets",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getMyTickets.__executeServer(opts));
var getMyTickets = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const email = String(data.email ?? "").trim().toLowerCase();
	const whatsapp = String(data.whatsapp ?? "").trim();
	if (!isValidEmail(email)) throw new Error("Email tidak valid.");
	if (!isValidWhatsapp(whatsapp)) throw new Error("Nomor WhatsApp Indonesia tidak valid.");
	return {
		email,
		whatsapp: normalizeWhatsapp(whatsapp)
	};
}).handler(getMyTickets_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const tickets = await sql`
      select * from tickets
      where holder_email = ${data.email} and holder_whatsapp = ${data.whatsapp}
      order by created_at desc
    `;
	const pending = await sql`
      select * from orders
      where email = ${data.email} and whatsapp = ${data.whatsapp} and status in ('pending', 'submitted')
      order by created_at desc
    `;
	return {
		tickets: tickets.map(mapTicket),
		pending: await Promise.all(pending.map((row) => mapOrderFull(sql, row)))
	};
});
var getOrder_createServerFn_handler = createServerRpc({
	id: "8bb61fe423bfe400b9834c9ccce13804035ef691ed3cf6b3a4628c0247c785c2",
	name: "getOrder",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(getOrder_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const order = (await sql`
      select * from orders where id = ${data.orderId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	const tickets = await sql`
      select * from tickets where order_id = ${order.id} order by created_at
    `;
	return {
		order: await mapOrderFull(sql, order),
		tickets: tickets.map(mapTicket)
	};
});
var PROOF_MIME = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg"
]);
var PROOF_MAX_CHARS = 55e5;
var uploadPaymentProof_createServerFn_handler = createServerRpc({
	id: "a1c23c4d440002885f69861e008c5eee143ad23b1b13ae3bd0ccef4533669d6a",
	name: "uploadPaymentProof",
	filename: "src/lib/tickets/server.ts"
}, (opts) => uploadPaymentProof.__executeServer(opts));
var uploadPaymentProof = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	const fileName = String(data.fileName ?? "bukti.jpg").replace(/[^\w.\- ()]/g, "").slice(0, 120);
	const mime = String(data.mime ?? "").toLowerCase();
	const payload = String(data.data ?? "").replace(/\s/g, "");
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	if (!PROOF_MIME.has(mime)) throw new Error("Unggah foto JPG, PNG, atau WEBP.");
	if (!payload || payload.length < 80) throw new Error("File bukti transfer tidak valid.");
	if (payload.length > PROOF_MAX_CHARS) throw new Error("Ukuran bukti terlalu besar. Maksimal sekitar 4 MB.");
	return {
		orderId,
		fileName: fileName || "bukti.jpg",
		mime: mime === "image/jpg" ? "image/jpeg" : mime,
		data: payload
	};
}).handler(uploadPaymentProof_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const order = (await sql`
      select * from orders where id = ${data.orderId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	if (order.status === "paid") throw new Error("Pesanan ini sudah lunas.");
	if (order.status !== "pending" && order.status !== "submitted") throw new Error("Pesanan ini sudah tidak aktif.");
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
	return { order: await mapOrderFull(sql, (await sql`
      select * from orders where id = ${order.id} limit 1
    `)[0] ?? order) };
});
var adminLogin_createServerFn_handler = createServerRpc({
	id: "cd213d60f5a86f05013834f0ad442b9aa86ff059b6e06b1203387bf87d7318af",
	name: "adminLogin",
	filename: "src/lib/tickets/server.ts"
}, (opts) => adminLogin.__executeServer(opts));
var adminLogin = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		username: String(data.username ?? "").trim().toLowerCase(),
		password: String(data.password ?? "")
	};
}).handler(adminLogin_createServerFn_handler, async ({ data }) => {
	const { ADMIN_PASSWORD, ADMIN_USERNAME, hashPassword, issueStaffToken, setStaffCookie, verifyPassword } = await import("./admin.server-ZpDtM_jc.mjs");
	let role = null;
	if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) role = "admin";
	try {
		const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
		const { asStaffRole } = await import("./admin.server-ZpDtM_jc.mjs");
		const sql = await getSql();
		await ensureStaffSeed(sql, hashPassword);
		if (!role) {
			const row = (await sql`
          select username, password_hash, role from staff where username = ${data.username} limit 1
        `)[0];
			if (row && verifyPassword(data.password, row.password_hash)) role = asStaffRole(row.role);
		}
	} catch {}
	if (!role) throw new Error("User atau password salah.");
	const token = issueStaffToken(data.username, role);
	setStaffCookie(data.username, role);
	return {
		ok: true,
		username: data.username,
		role,
		token
	};
});
var adminLogout_createServerFn_handler = createServerRpc({
	id: "12a63c16d23e19b1199357c1c37e8a4d15633f9f8c9d25bcd5e07eb6e447fdb7",
	name: "adminLogout",
	filename: "src/lib/tickets/server.ts"
}, (opts) => adminLogout.__executeServer(opts));
var adminLogout = createServerFn({ method: "POST" }).handler(adminLogout_createServerFn_handler, async () => {
	const { clearStaffCookie } = await import("./admin.server-ZpDtM_jc.mjs");
	clearStaffCookie();
	return { ok: true };
});
var getAdminSession_createServerFn_handler = createServerRpc({
	id: "75430dedbb6cea6bc0cdca0ef899221c1957e3e8a2f1b0fbaa157fd4dd872f37",
	name: "getAdminSession",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getAdminSession.__executeServer(opts));
var getAdminSession = createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(getAdminSession_createServerFn_handler, async ({ data }) => {
	const { readStaffSession } = await import("./admin.server-ZpDtM_jc.mjs");
	const session = readStaffSession(data.token);
	if (!session) return { ok: false };
	return {
		ok: true,
		username: session.username,
		role: session.role
	};
});
async function ensureBuyerProfiles(sql) {
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
	} catch {}
}
async function loadBuyers(sql) {
	await ensureBuyerProfiles(sql);
	try {
		return (await sql`
      select user_id, email, whatsapp, created_at, referral_code
      from buyer_profiles
      order by created_at desc
    `).map((row) => ({
			id: row.user_id,
			email: row.email,
			whatsapp: row.whatsapp,
			createdAt: String(row.created_at),
			referralCode: String(row.referral_code || "")
		}));
	} catch {
		return [];
	}
}
async function ensureStaffSeed(sql, hashPassword) {
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
		`alter table staff drop constraint if exists staff_role_check`
	]) try {
		await sql.query(stmt);
	} catch {}
	try {
		await sql.query(`alter table staff add constraint staff_role_check check (role in ('admin', 'crew', 'agent'))`);
	} catch {}
	if (asInt((await sql`
    select count(*)::int as n from staff where username = ${"iang"}
  `)[0]?.n) > 0) return;
	await sql`
    insert into staff (username, password_hash, role)
    values (${"iang"}, ${hashPassword("$golden")}, ${"admin"})
    on conflict (username) do nothing
  `;
}
var getAdminDashboard_createServerFn_handler = createServerRpc({
	id: "9080277f88b6e5de22bbecfb5e9f79ed2ca0c5a913ded90150a7edffdfbaf963",
	name: "getAdminDashboard",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getAdminDashboard.__executeServer(opts));
var getAdminDashboard = createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(getAdminDashboard_createServerFn_handler, async ({ data }) => {
	try {
		const { requireStaff, hashPassword } = await import("./admin.server-ZpDtM_jc.mjs");
		const session = requireStaff(data.token);
		const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
		const sql = await getSql();
		await expireStale(sql);
		await ensureStaffSeed(sql, hashPassword);
		await ensureStageSeed(sql);
		const types = await sql`
    select id, name, price_idr, quota, per_user_limit from ticket_types order by sort_order
  `;
		const soldRows = await sql`
    select t.ticket_type_id, count(*)::int as sold
    from tickets t
    group by t.ticket_type_id
  `;
		const soldMap = Object.fromEntries(soldRows.map((row) => [row.ticket_type_id, asInt(row.sold)]));
		const typeStats = [];
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
				remaining: Math.max(0, quota - sold)
			});
		}
		const paid = await sql`
    select * from orders where status = 'paid' order by paid_at desc
  `;
		const review = await sql`
    select * from orders
    where status in ('submitted', 'paid')
    order by created_at desc
    limit 80
  `;
		const me = await sql`
    select referral_code from staff where username = ${session.username} limit 1
  `;
		const referralCode = String(me[0]?.referral_code || (session.role === "agent" ? session.username : "")).toLowerCase();
		const scopedPaid = session.role === "agent" ? paid.filter((row) => String(row.referral_code ?? "").toLowerCase() === referralCode) : paid;
		const scopedReview = session.role === "agent" ? review.filter((row) => String(row.referral_code ?? "").toLowerCase() === referralCode) : review;
		const revenue = scopedPaid.reduce((sum, row) => sum + asInt(row.gross_amount) + uniqueCodeFromPhone(row.whatsapp), 0);
		const submittedCount = scopedReview.filter((row) => row.status === "submitted").length;
		const users = session.role === "admin" ? await sql`
          select username, role, created_at, referral_code from staff order by created_at asc
        ` : [];
		const agentSold = {
			vvip: 0,
			vip: 0,
			festival: 0
		};
		if (session.role === "agent") for (const row of scopedPaid) {
			const full = await mapOrderFull(sql, row);
			for (const item of full.items) if (isTicketTypeId(item.ticketTypeId)) agentSold[item.ticketTypeId] += item.quantity;
		}
		const active = await loadActiveStage(sql);
		const stageRows = await sql`
    select id, name, enabled, starts_at, ends_at, sort_order from ticket_stages order by sort_order
  `;
		const offerRows = await sql`
    select stage_id, ticket_type_id, price_idr, quota from ticket_stage_offers
  `;
		const soldStageRows = await sql`
    select coalesce(o.stage_id, '') as stage_id, oi.ticket_type_id, coalesce(sum(oi.quantity), 0)::int as sold
    from order_items oi
    join orders o on o.id = oi.order_id
    where o.status in ('pending', 'submitted', 'paid')
    group by coalesce(o.stage_id, ''), oi.ticket_type_id
  `;
		const soldStageMap = Object.fromEntries(soldStageRows.map((row) => [`${row.stage_id}:${row.ticket_type_id}`, asInt(row.sold)]));
		const stages = stageRows.filter((row) => isSalesStageId(row.id)).map((row) => {
			const id = row.id;
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
						sold: asInt(soldStageMap[`${id}:${typeId}`])
					};
				})
			};
		});
		return {
			username: session.username,
			role: session.role,
			types: session.role === "agent" ? typeStats.map((t) => ({
				...t,
				sold: agentSold[t.id],
				remaining: Math.max(0, t.quota - t.sold)
			})) : typeStats,
			ticketsSold: session.role === "agent" ? agentSold.vvip + agentSold.vip + agentSold.festival : typeStats.reduce((n, t) => n + t.sold, 0),
			revenue: session.role === "admin" ? revenue : session.role === "agent" ? revenue : 0,
			submittedCount,
			users: users.map((row) => ({
				username: row.username,
				role: row.role === "agent" ? "agent" : row.role === "admin" ? "admin" : "crew",
				createdAt: String(row.created_at),
				referralCode: String(row.referral_code || (row.role === "agent" ? row.username : ""))
			})),
			buyers: session.role === "admin" ? await loadBuyers(sql) : [],
			orders: await Promise.all(scopedReview.map((row) => mapOrderFull(sql, row))),
			referralCode,
			stages,
			activeStageId: active && isSalesStageId(active.id) ? active.id : null
		};
	} catch (e) {
		if (e instanceof Error && (e.message === "Unauthorized" || e.message.startsWith("Hanya"))) throw e;
		throw new Error(e instanceof Error ? e.message : "Gagal memuat dashboard.");
	}
});
var updateTicketStages_createServerFn_handler = createServerRpc({
	id: "29e36bde2c110943c2b9ff8ebf0ab2c929c6bcc9b6ad3e3b50f38909cf127769",
	name: "updateTicketStages",
	filename: "src/lib/tickets/server.ts"
}, (opts) => updateTicketStages.__executeServer(opts));
var updateTicketStages = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const stages = [];
	for (const stage of data.stages ?? []) {
		const id = String(stage.id ?? "");
		if (!isSalesStageId(id)) continue;
		const allowed = STAGE_COPY[id].types;
		const offers = [];
		for (const offer of stage.offers ?? []) {
			const ticketTypeId = String(offer.ticketTypeId ?? "");
			if (!isTicketTypeId(ticketTypeId)) continue;
			if (!allowed.includes(ticketTypeId)) continue;
			const priceIdr = Number(offer.priceIdr);
			const quota = Number(offer.quota);
			if (!Number.isInteger(priceIdr) || priceIdr < 1) throw new Error(`Harga ${TICKET_COPY[ticketTypeId].name} minimal Rp 1.`);
			if (!Number.isInteger(quota) || quota < 0) throw new Error(`Kuota ${TICKET_COPY[ticketTypeId].name} tidak valid.`);
			offers.push({
				ticketTypeId,
				priceIdr,
				quota
			});
		}
		if (offers.length === 0) throw new Error(`${STAGE_COPY[id].name} wajib punya minimal satu jenis tiket.`);
		const startsAt = stage.startsAt ? String(stage.startsAt) : null;
		const endsAt = stage.endsAt ? String(stage.endsAt) : null;
		if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) throw new Error(`${STAGE_COPY[id].name}: waktu mulai harus sebelum waktu selesai.`);
		stages.push({
			id,
			enabled: Boolean(stage.enabled),
			startsAt,
			endsAt,
			offers
		});
	}
	if (stages.length === 0) throw new Error("Tidak ada tahap penjualan.");
	return {
		stages,
		token: String(data.token ?? "")
	};
}).handler(updateTicketStages_createServerFn_handler, async ({ data }) => {
	const { requireAdmin } = await import("./admin.server-ZpDtM_jc.mjs");
	requireAdmin(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await ensureStageSeed(sql);
	for (const stage of data.stages) {
		for (const offer of stage.offers) {
			const stock = await remainingFor(sql, offer.ticketTypeId, stage.id);
			const sold = stock ? stock.quota - stock.remaining : 0;
			if (offer.quota < sold) throw new Error(`Kuota ${TICKET_COPY[offer.ticketTypeId].name} pada ${STAGE_COPY[stage.id].name} tidak boleh lebih kecil dari yang sudah terjual (${sold}).`);
		}
		await sql`
        update ticket_stages
        set enabled = ${stage.enabled},
            starts_at = ${stage.startsAt},
            ends_at = ${stage.endsAt}
        where id = ${stage.id}
      `;
		await sql`delete from ticket_stage_offers where stage_id = ${stage.id}`;
		for (const offer of stage.offers) await sql`
          insert into ticket_stage_offers (stage_id, ticket_type_id, price_idr, quota)
          values (${stage.id}, ${offer.ticketTypeId}, ${offer.priceIdr}, ${offer.quota})
        `;
	}
	return { ok: true };
});
var createStaffAccount_createServerFn_handler = createServerRpc({
	id: "b06e50fa0483dd27f89e920b87301bfa7694bde7cfe7a0f0ae985f7bf6ea5766",
	name: "createStaffAccount",
	filename: "src/lib/tickets/server.ts"
}, (opts) => createStaffAccount.__executeServer(opts));
var createStaffAccount = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const username = String(data.username ?? "").trim().toLowerCase();
	const password = String(data.password ?? "");
	const role = data.role === "admin" ? "admin" : data.role === "agent" ? "agent" : "crew";
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username 3–24 karakter, huruf kecil, angka, atau underscore.");
	if (username === "iang") throw new Error("Username ini sudah dipakai.");
	if (password.length < 6) throw new Error("Password minimal 6 karakter.");
	return {
		username,
		password,
		role,
		token: String(data.token ?? "")
	};
}).handler(createStaffAccount_createServerFn_handler, async ({ data }) => {
	const { requireAdmin, hashPassword } = await import("./admin.server-ZpDtM_jc.mjs");
	requireAdmin(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	await ensureStaffSeed(sql, hashPassword);
	if ((await sql`
      select username from staff where username = ${data.username} limit 1
    `)[0]) throw new Error("Username sudah dipakai.");
	const referral = data.role === "agent" ? data.username : null;
	try {
		await sql`
        insert into staff (username, password_hash, role, referral_code)
        values (${data.username}, ${hashPassword(data.password)}, ${data.role}, ${referral})
      `;
	} catch (e) {
		if ((await sql`
        select username from staff where username = ${data.username} limit 1
      `)[0]) throw new Error("Username sudah dipakai.");
		throw new Error(e instanceof Error ? e.message : "Gagal membuat akun.");
	}
	return {
		ok: true,
		username: data.username,
		role: data.role
	};
});
var deleteStaffAccount_createServerFn_handler = createServerRpc({
	id: "94e9bc053a9cfd6b3ce1832e1a07b8e8120e253e6b45e9d7729685b6e457231c",
	name: "deleteStaffAccount",
	filename: "src/lib/tickets/server.ts"
}, (opts) => deleteStaffAccount.__executeServer(opts));
var deleteStaffAccount = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const username = String(data.username ?? "").trim().toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Akun tidak ditemukan.");
	return {
		username,
		token: String(data.token ?? "")
	};
}).handler(deleteStaffAccount_createServerFn_handler, async ({ data }) => {
	try {
		const { ADMIN_USERNAME, requireAdmin } = await import("./admin.server-ZpDtM_jc.mjs");
		const session = requireAdmin(data.token);
		if (data.username === ADMIN_USERNAME) throw new Error("Akun admin utama tidak bisa dihapus.");
		if (data.username === session.username) throw new Error("Tidak bisa menghapus akun yang sedang dipakai.");
		const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
		const { hashPassword } = await import("./admin.server-ZpDtM_jc.mjs");
		const sql = await getSql();
		await ensureStaffSeed(sql, hashPassword);
		const rows = await sql`
        select username, role from staff where username = ${data.username} limit 1
      `;
		if (!rows[0]) throw new Error("Akun tidak ditemukan.");
		if (rows[0].role === "admin") {
			const admins = await sql`
          select count(*)::int as n from staff where role = 'admin'
        `;
			if (Number(admins[0]?.n ?? 0) <= 1) throw new Error("Tidak bisa menghapus admin terakhir.");
		}
		if (!(await sql`
        delete from staff where username = ${data.username} returning username
      `)[0]) throw new Error("Akun tidak ditemukan.");
		return {
			ok: true,
			username: data.username
		};
	} catch (e) {
		if (e instanceof Error && /tidak bisa|tidak ditemukan|Unauthorized|Hanya admin/i.test(e.message)) throw e;
		throw new Error(e instanceof Error ? e.message : "Gagal menghapus akun.");
	}
});
var listAdminOrders_createServerFn_handler = createServerRpc({
	id: "b39aba01facd58be6addba2807fd92f91011ab93793c06b5f1d1bc0a851c1c48",
	name: "listAdminOrders",
	filename: "src/lib/tickets/server.ts"
}, (opts) => listAdminOrders.__executeServer(opts));
var listAdminOrders = createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(listAdminOrders_createServerFn_handler, async ({ data }) => {
	const { requireStaff } = await import("./admin.server-ZpDtM_jc.mjs");
	requireStaff(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	const rows = await sql`
    select * from orders
    where status in ('submitted', 'paid')
    order by created_at desc
    limit 80
  `;
	return Promise.all(rows.map((row) => mapOrderFull(sql, row)));
});
var getAdminProof_createServerFn_handler = createServerRpc({
	id: "4c95de8ae4a382806fd36b481ba5aaa3f0a6ffb265047f71a78e5a95fe273938",
	name: "getAdminProof",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getAdminProof.__executeServer(opts));
var getAdminProof = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		token: String(data.token ?? "")
	};
}).handler(getAdminProof_createServerFn_handler, async ({ data }) => {
	const { requireCrew } = await import("./admin.server-ZpDtM_jc.mjs");
	requireCrew(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const proof = (await (await getSql())`
      select file_name, mime, data from payment_proofs where order_id = ${data.orderId} limit 1
    `)[0];
	if (!proof) throw new Error("Bukti transfer belum diunggah.");
	return {
		fileName: proof.file_name,
		mime: proof.mime,
		data: proof.data
	};
});
var adminConfirmOrder_createServerFn_handler = createServerRpc({
	id: "61a638f7597edfe8ccb4895fbba59479fec5eb410dcfffadcebce309ee7579b1",
	name: "adminConfirmOrder",
	filename: "src/lib/tickets/server.ts"
}, (opts) => adminConfirmOrder.__executeServer(opts));
var adminConfirmOrder = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		token: String(data.token ?? "")
	};
}).handler(adminConfirmOrder_createServerFn_handler, async ({ data }) => {
	const { requireCrew } = await import("./admin.server-ZpDtM_jc.mjs");
	requireCrew(data.token);
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const sql = await getSql();
	const paid = await fulfillPaidOrder(sql, data.orderId, "qris");
	if (!paid) throw new Error("Pesanan tidak bisa dikonfirmasi.");
	return { order: await mapOrderFull(sql, paid) };
});
var getTicketByCode_createServerFn_handler = createServerRpc({
	id: "af6f58d6df5a5107d84d62ffb1b0102a90008afa8b8d473e36895e0ed4df324d",
	name: "getTicketByCode",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getTicketByCode.__executeServer(opts));
var getTicketByCode = createServerFn({ method: "GET" }).validator((input) => {
	const code = String(input.code ?? "").trim().toUpperCase();
	if (!code) throw new Error("Tiket tidak ditemukan.");
	return { code };
}).handler(getTicketByCode_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-CRz4B43v.mjs").then((n) => n.t);
	const ticket = (await (await getSql())`
      select * from tickets where code = ${data.code} limit 1
    `)[0];
	if (!ticket) throw new Error("Tiket tidak ditemukan.");
	return mapTicket(ticket);
});
//#endregion
export { adminConfirmOrder_createServerFn_handler, adminLogin_createServerFn_handler, adminLogout_createServerFn_handler, confirmDemoPayment_createServerFn_handler, confirmMidtransPayment_createServerFn_handler, createOrder_createServerFn_handler, createStaffAccount_createServerFn_handler, deleteStaffAccount_createServerFn_handler, getAdminDashboard_createServerFn_handler, getAdminProof_createServerFn_handler, getAdminSession_createServerFn_handler, getCatalog_createServerFn_handler, getCheckoutState_createServerFn_handler, getMyTickets_createServerFn_handler, getOrder_createServerFn_handler, getTicketByCode_createServerFn_handler, listAdminOrders_createServerFn_handler, updateTicketStages_createServerFn_handler, uploadPaymentProof_createServerFn_handler };
