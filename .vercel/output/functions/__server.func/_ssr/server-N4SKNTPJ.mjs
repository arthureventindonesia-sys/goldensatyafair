import { c as isValidName, l as isValidWhatsapp, o as isValidAddress, s as isValidEmail, u as normalizeWhatsapp } from "./format-LT3CbQE3.mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as STAGE_COPY, c as isSalesStageId, l as isTicketTypeId, o as TICKET_COPY } from "./event-IC9aXe9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-N4SKNTPJ.js
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
async function applyMidtransNotification(sql, orderId, opts) {
	if (opts.paid) return fulfillPaidOrder(sql, orderId, opts.paymentType ?? "qris");
	if (opts.closed) await sql`
      update orders
      set status = 'expired'
      where id = ${orderId} and status = 'pending'
    `;
	return (await sql`select * from orders where id = ${orderId} limit 1`)[0] ?? null;
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
var getCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("7af4c2fe32b4e9a3f8d823c7c3844104d0c8ab2f4d8e58465f9bdbfb21b12acc"));
var getCheckoutState = createServerFn({ method: "POST" }).validator((input) => ({
	token: String(input?.token ?? ""),
	whatsapp: String(input?.whatsapp ?? "")
})).handler(createSsrRpc("3ee8d25cb77ae25a33de5df486cfcb89f76b0c782da3ddcfccebfaedae596f31"));
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
}).handler(createSsrRpc("683ccb44b33bed7a2d1ce13be2ac4f5cf1d9840f5fcbf247ffb2679c4abacbc0"));
createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		paymentType: String(data.paymentType ?? "qris").slice(0, 40)
	};
}).handler(createSsrRpc("7bfbcb1d3ceadc1945d34f6e2cc91cf63a8e2edcfa56e5cde910b9309d5eef32"));
createServerFn({ method: "POST" }).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(createSsrRpc("1a9a6a9b2a79adfd5ebf80d48622b5cb7d27ab68f2423322faf82887f4120026"));
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
}).handler(createSsrRpc("36d15d2ad4673680eb9dd908bcf3606494e3b967078abae683e244e6a0bf1dad"));
var getOrder = createServerFn({ method: "GET" }).validator((input) => {
	const orderId = String(input.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return { orderId };
}).handler(createSsrRpc("8bb61fe423bfe400b9834c9ccce13804035ef691ed3cf6b3a4628c0247c785c2"));
var PROOF_MIME = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg"
]);
var PROOF_MAX_CHARS = 55e5;
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
}).handler(createSsrRpc("a1c23c4d440002885f69861e008c5eee143ad23b1b13ae3bd0ccef4533669d6a"));
var adminLogin = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		username: String(data.username ?? "").trim().toLowerCase(),
		password: String(data.password ?? "")
	};
}).handler(createSsrRpc("cd213d60f5a86f05013834f0ad442b9aa86ff059b6e06b1203387bf87d7318af"));
var adminLogout = createServerFn({ method: "POST" }).handler(createSsrRpc("12a63c16d23e19b1199357c1c37e8a4d15633f9f8c9d25bcd5e07eb6e447fdb7"));
var getAdminSession = createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(createSsrRpc("75430dedbb6cea6bc0cdca0ef899221c1957e3e8a2f1b0fbaa157fd4dd872f37"));
var getAdminDashboard = createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(createSsrRpc("9080277f88b6e5de22bbecfb5e9f79ed2ca0c5a913ded90150a7edffdfbaf963"));
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
}).handler(createSsrRpc("29e36bde2c110943c2b9ff8ebf0ab2c929c6bcc9b6ad3e3b50f38909cf127769"));
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
}).handler(createSsrRpc("b06e50fa0483dd27f89e920b87301bfa7694bde7cfe7a0f0ae985f7bf6ea5766"));
var deleteStaffAccount = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const username = String(data.username ?? "").trim().toLowerCase();
	if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Akun tidak ditemukan.");
	return {
		username,
		token: String(data.token ?? "")
	};
}).handler(createSsrRpc("94e9bc053a9cfd6b3ce1832e1a07b8e8120e253e6b45e9d7729685b6e457231c"));
createServerFn({ method: "POST" }).validator((input) => ({ token: String(input.token ?? "") })).handler(createSsrRpc("b39aba01facd58be6addba2807fd92f91011ab93793c06b5f1d1bc0a851c1c48"));
var getAdminProof = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		token: String(data.token ?? "")
	};
}).handler(createSsrRpc("4c95de8ae4a382806fd36b481ba5aaa3f0a6ffb265047f71a78e5a95fe273938"));
var adminConfirmOrder = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const orderId = String(data.orderId ?? "").trim();
	if (!orderId) throw new Error("Pesanan tidak ditemukan.");
	return {
		orderId,
		token: String(data.token ?? "")
	};
}).handler(createSsrRpc("61a638f7597edfe8ccb4895fbba59479fec5eb410dcfffadcebce309ee7579b1"));
var getTicketByCode = createServerFn({ method: "GET" }).validator((input) => {
	const code = String(input.code ?? "").trim().toUpperCase();
	if (!code) throw new Error("Tiket tidak ditemukan.");
	return { code };
}).handler(createSsrRpc("af6f58d6df5a5107d84d62ffb1b0102a90008afa8b8d473e36895e0ed4df324d"));
//#endregion
export { adminConfirmOrder, adminLogin, adminLogout, applyMidtransNotification, createOrder, createStaffAccount, deleteStaffAccount, getAdminDashboard, getAdminProof, getAdminSession, getCatalog, getCheckoutState, getMyTickets, getOrder, getTicketByCode, updateTicketStages, uploadPaymentProof };
