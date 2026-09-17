import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { c as normalizeWhatsapp, o as isValidEmail, s as isValidWhatsapp, t as authMiddleware } from "./format-Cm5WkSbp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-jrCKn4KW.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("7af4c2fe32b4e9a3f8d823c7c3844104d0c8ab2f4d8e58465f9bdbfb21b12acc"));
var getCheckoutState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3ee8d25cb77ae25a33de5df486cfcb89f76b0c782da3ddcfccebfaedae596f31"));
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
}).handler(createSsrRpc("683ccb44b33bed7a2d1ce13be2ac4f5cf1d9840f5fcbf247ffb2679c4abacbc0"));
var confirmDemoPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		paymentType: String(data.paymentType ?? "sandbox").slice(0, 40)
	};
}).handler(createSsrRpc("7bfbcb1d3ceadc1945d34f6e2cc91cf63a8e2edcfa56e5cde910b9309d5eef32"));
var confirmMidtransPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(createSsrRpc("1a9a6a9b2a79adfd5ebf80d48622b5cb7d27ab68f2423322faf82887f4120026"));
var getMyTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36d15d2ad4673680eb9dd908bcf3606494e3b967078abae683e244e6a0bf1dad"));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(createSsrRpc("8bb61fe423bfe400b9834c9ccce13804035ef691ed3cf6b3a4628c0247c785c2"));
var getTicketByCode = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const code = String(input.code ?? "").trim().toUpperCase();
	if (!code) throw new Error("Tiket tidak ditemukan.");
	return { code };
}).handler(createSsrRpc("af6f58d6df5a5107d84d62ffb1b0102a90008afa8b8d473e36895e0ed4df324d"));
//#endregion
export { confirmDemoPayment, confirmMidtransPayment, createOrder, fulfillPaidOrder, getCatalog, getCheckoutState, getMyTickets, getOrder, getTicketByCode };
