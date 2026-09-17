import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { c as normalizeWhatsapp, o as isValidEmail, s as isValidWhatsapp, t as authMiddleware } from "./format-Cm5WkSbp.mjs";
import { r as TICKET_COPY, t as EVENT } from "./event-BBlN7ENr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DYq_Ezbt.js
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
function isTicketTypeId(value) {
	return value === "vip" || value === "festival";
}
async function expireStale(sql) {
	await sql`
    update orders
    set status = 'expired'
    where status = 'pending'
      and created_at < now() - interval '15 minutes'
  `;
}
async function remainingFor(sql, typeId) {
	const type = (await sql`
    select id, name, price_idr, quota, per_user_limit from ticket_types where id = ${typeId}
  `)[0];
	if (!type) return null;
	const held = await sql`
    select coalesce(sum(quantity), 0)::int as total
    from orders
    where ticket_type_id = ${typeId}
      and status in ('pending', 'paid')
  `;
	return {
		type,
		remaining: Math.max(0, asInt(type.quota) - asInt(held[0]?.total))
	};
}
async function userHeld(sql, userId, typeId) {
	return asInt((await sql`
    select coalesce(sum(quantity), 0)::int as total
    from orders
    where user_id = ${userId}
      and ticket_type_id = ${typeId}
      and status in ('pending', 'paid')
  `)[0]?.total);
}
async function loadCatalog(sql) {
	const types = await sql`
    select id, name, price_idr, quota, per_user_limit from ticket_types order by sort_order
  `;
	const tickets = [];
	for (const type of types) {
		if (!isTicketTypeId(type.id)) continue;
		const stock = await remainingFor(sql, type.id);
		tickets.push({
			id: type.id,
			name: type.name,
			priceIdr: asInt(type.price_idr),
			quota: asInt(type.quota),
			remaining: stock?.remaining ?? 0,
			perUserLimit: asInt(type.per_user_limit) || 5
		});
	}
	return {
		event: {
			id: EVENT.id,
			name: EVENT.name,
			venue: EVENT.venue,
			city: EVENT.city,
			startsAt: EVENT.startsAt
		},
		tickets
	};
}
function mapOrder(row) {
	const ticketTypeId = isTicketTypeId(row.ticket_type_id) ? row.ticket_type_id : "festival";
	return {
		id: row.id,
		ticketTypeId,
		ticketName: TICKET_COPY[ticketTypeId].name,
		quantity: asInt(row.quantity),
		grossAmount: asInt(row.gross_amount),
		email: row.email,
		whatsapp: row.whatsapp,
		status: row.status,
		paymentType: row.payment_type,
		createdAt: String(row.created_at),
		paidAt: row.paid_at ? String(row.paid_at) : null
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
		createdAt: String(row.created_at)
	};
}
function randomHex(bytes) {
	const buf = new Uint8Array(bytes);
	crypto.getRandomValues(buf);
	return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
async function issueTickets(sql, order) {
	const prefix = order.ticket_type_id === "vip" ? "VIP" : "FST";
	for (let i = 0; i < asInt(order.quantity); i += 1) {
		const code = `GSF-${prefix}-${randomHex(4)}`;
		await sql`
      insert into tickets (id, order_id, user_id, ticket_type_id, code, holder_email, holder_whatsapp)
      values (
        ${crypto.randomUUID()},
        ${order.id},
        ${order.user_id},
        ${order.ticket_type_id},
        ${code},
        ${order.email},
        ${order.whatsapp}
      )
    `;
	}
}
async function fulfillPaidOrder(sql, orderId, paymentType) {
	const order = (await sql`select * from orders where id = ${orderId} limit 1`)[0];
	if (!order) return null;
	if (order.status === "paid") return order;
	if (order.status !== "pending") return null;
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
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	return loadCatalog(sql);
});
var getCheckoutState_createServerFn_handler = createServerRpc({
	id: "3ee8d25cb77ae25a33de5df486cfcb89f76b0c782da3ddcfccebfaedae596f31",
	name: "getCheckoutState",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getCheckoutState.__executeServer(opts));
var getCheckoutState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getCheckoutState_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const catalog = await loadCatalog(sql);
	const held = {
		vip: await userHeld(sql, context.userId, "vip"),
		festival: await userHeld(sql, context.userId, "festival")
	};
	return {
		...catalog,
		held
	};
});
var createOrder_createServerFn_handler = createServerRpc({
	id: "683ccb44b33bed7a2d1ce13be2ac4f5cf1d9840f5fcbf247ffb2679c4abacbc0",
	name: "createOrder",
	filename: "src/lib/tickets/server.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const data = input;
	const ticketTypeId = data.ticketTypeId;
	const quantity = Number(data.quantity);
	const email = String(data.email ?? "").trim().toLowerCase();
	const whatsapp = String(data.whatsapp ?? "").trim();
	if (!ticketTypeId || !isTicketTypeId(ticketTypeId)) throw new Error("Pilih jenis tiket.");
	if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) throw new Error(`Jumlah tiket 1–5.`);
	if (!isValidEmail(email)) throw new Error("Email tidak valid.");
	if (!isValidWhatsapp(whatsapp)) throw new Error("Nomor WhatsApp Indonesia tidak valid.");
	return {
		ticketTypeId,
		quantity,
		email,
		whatsapp: normalizeWhatsapp(whatsapp)
	};
}).handler(createOrder_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const { createSnapTransaction, snapScriptUrl } = await import("./midtrans.server-CvoH5iHh.mjs");
	const sql = await getSql();
	await expireStale(sql);
	await sql`
      update orders
      set status = 'cancelled'
      where user_id = ${context.userId} and status = 'pending'
    `;
	const stock = await remainingFor(sql, data.ticketTypeId);
	if (!stock) throw new Error("Jenis tiket tidak ditemukan.");
	if (stock.remaining < data.quantity) throw new Error(stock.remaining === 0 ? "Tiket ini sudah habis." : `Sisa tiket ${stock.remaining}. Kurangi jumlah pembelian.`);
	const held = await userHeld(sql, context.userId, data.ticketTypeId);
	const limit = asInt(stock.type.per_user_limit) || 5;
	if (held + data.quantity > limit) {
		const left = Math.max(0, limit - held);
		throw new Error(left === 0 ? `Batas ${limit} tiket ${stock.type.name} per akun sudah terpenuhi.` : `Kamu masih bisa membeli ${left} tiket ${stock.type.name}.`);
	}
	const price = asInt(stock.type.price_idr);
	const grossAmount = price * data.quantity;
	const orderId = newOrderId();
	const snap = await createSnapTransaction({
		orderId,
		grossAmount,
		item: {
			id: data.ticketTypeId,
			name: `${EVENT.name} — ${stock.type.name}`,
			price,
			quantity: data.quantity
		},
		email: data.email,
		phone: data.whatsapp
	});
	await sql`
      insert into orders (
        id, user_id, ticket_type_id, quantity, gross_amount, email, whatsapp, status, midtrans_token
      ) values (
        ${orderId},
        ${context.userId},
        ${data.ticketTypeId},
        ${data.quantity},
        ${grossAmount},
        ${data.email},
        ${data.whatsapp},
        'pending',
        ${snap.token}
      )
    `;
	return {
		orderId,
		snapToken: snap.token,
		clientKey: snap.clientKey,
		snapScriptUrl: snap.snapScriptUrl || snapScriptUrl(),
		isDemo: snap.isDemo,
		grossAmount,
		ticketName: stock.type.name,
		quantity: data.quantity
	};
});
var confirmDemoPayment_createServerFn_handler = createServerRpc({
	id: "7bfbcb1d3ceadc1945d34f6e2cc91cf63a8e2edcfa56e5cde910b9309d5eef32",
	name: "confirmDemoPayment",
	filename: "src/lib/tickets/server.ts"
}, (opts) => confirmDemoPayment.__executeServer(opts));
var confirmDemoPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		paymentType: String(data.paymentType ?? "sandbox").slice(0, 40)
	};
}).handler(confirmDemoPayment_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const { isMidtransConfigured } = await import("./midtrans.server-CvoH5iHh.mjs");
	if (isMidtransConfigured()) throw new Error("Pembayaran sandbox tidak tersedia. Gunakan Midtrans.");
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.orderId} and user_id = ${context.userId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	if (order.status === "paid") {
		const tickets = await sql`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
		return {
			order: mapOrder(order),
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
		order: mapOrder(paid),
		tickets: tickets.map(mapTicket)
	};
});
var confirmMidtransPayment_createServerFn_handler = createServerRpc({
	id: "1a9a6a9b2a79adfd5ebf80d48622b5cb7d27ab68f2423322faf82887f4120026",
	name: "confirmMidtransPayment",
	filename: "src/lib/tickets/server.ts"
}, (opts) => confirmMidtransPayment.__executeServer(opts));
var confirmMidtransPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(confirmMidtransPayment_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const { fetchMidtransStatus, isPaidStatus, isMidtransConfigured } = await import("./midtrans.server-CvoH5iHh.mjs");
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.orderId} and user_id = ${context.userId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	if (order.status === "paid") {
		const tickets = await sql`
        select * from tickets where order_id = ${order.id} order by created_at
      `;
		return {
			order: mapOrder(order),
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
		order: mapOrder(paid),
		tickets: tickets.map(mapTicket)
	};
});
var getMyTickets_createServerFn_handler = createServerRpc({
	id: "36d15d2ad4673680eb9dd908bcf3606494e3b967078abae683e244e6a0bf1dad",
	name: "getMyTickets",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getMyTickets.__executeServer(opts));
var getMyTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyTickets_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const tickets = await sql`
      select * from tickets where user_id = ${context.userId} order by created_at desc
    `;
	const pending = await sql`
      select * from orders
      where user_id = ${context.userId} and status = 'pending'
      order by created_at desc
    `;
	return {
		tickets: tickets.map(mapTicket),
		pending: pending.map(mapOrder)
	};
});
var getOrder_createServerFn_handler = createServerRpc({
	id: "8bb61fe423bfe400b9834c9ccce13804035ef691ed3cf6b3a4628c0247c785c2",
	name: "getOrder",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(getOrder_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	await expireStale(sql);
	const order = (await sql`
      select * from orders where id = ${data.orderId} and user_id = ${context.userId} limit 1
    `)[0];
	if (!order) throw new Error("Pesanan tidak ditemukan.");
	const tickets = await sql`
      select * from tickets where order_id = ${order.id} and user_id = ${context.userId} order by created_at
    `;
	return {
		order: mapOrder(order),
		tickets: tickets.map(mapTicket)
	};
});
var getTicketByCode_createServerFn_handler = createServerRpc({
	id: "af6f58d6df5a5107d84d62ffb1b0102a90008afa8b8d473e36895e0ed4df324d",
	name: "getTicketByCode",
	filename: "src/lib/tickets/server.ts"
}, (opts) => getTicketByCode.__executeServer(opts));
var getTicketByCode = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const code = String(input.code ?? "").trim().toUpperCase();
	if (!code) throw new Error("Tiket tidak ditemukan.");
	return { code };
}).handler(getTicketByCode_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-BpOJwEAd.mjs").then((n) => n.t).then((n) => n.t);
	const ticket = (await (await getSql())`
      select * from tickets where code = ${data.code} and user_id = ${context.userId} limit 1
    `)[0];
	if (!ticket) throw new Error("Tiket tidak ditemukan.");
	return mapTicket(ticket);
});
//#endregion
export { confirmDemoPayment_createServerFn_handler, confirmMidtransPayment_createServerFn_handler, createOrder_createServerFn_handler, getCatalog_createServerFn_handler, getCheckoutState_createServerFn_handler, getMyTickets_createServerFn_handler, getOrder_createServerFn_handler, getTicketByCode_createServerFn_handler };
