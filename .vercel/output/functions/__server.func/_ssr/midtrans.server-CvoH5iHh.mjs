import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/midtrans.server-CvoH5iHh.js
function serverKey() {
	return process.env.MIDTRANS_SERVER_KEY?.trim() || "";
}
function clientKey() {
	return process.env.MIDTRANS_CLIENT_KEY?.trim() || process.env.VITE_MIDTRANS_CLIENT_KEY?.trim() || "";
}
function isMidtransConfigured() {
	return Boolean(serverKey());
}
function midtransIsProduction() {
	const flag = process.env.MIDTRANS_IS_PRODUCTION?.trim();
	if (flag === "true") return true;
	if (flag === "false") return false;
	return serverKey().startsWith("Mid-server-");
}
function snapBase() {
	return midtransIsProduction() ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
}
function apiBase() {
	return midtransIsProduction() ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
}
function authHeader() {
	return `Basic ${Buffer.from(`${serverKey()}:`).toString("base64")}`;
}
function snapScriptUrl() {
	return `${snapBase()}/snap/snap.js`;
}
async function createSnapTransaction(input) {
	if (!serverKey()) return {
		token: null,
		clientKey: null,
		snapScriptUrl: snapScriptUrl(),
		isDemo: true
	};
	const res = await fetch(`${snapBase()}/snap/v1/transactions`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: authHeader()
		},
		body: JSON.stringify({
			transaction_details: {
				order_id: input.orderId,
				gross_amount: input.grossAmount
			},
			item_details: [{
				id: input.item.id,
				name: input.item.name,
				price: input.item.price,
				quantity: input.item.quantity
			}],
			customer_details: {
				email: input.email,
				phone: input.phone
			},
			credit_card: { secure: true }
		})
	});
	const body = await res.json();
	if (!res.ok || !body.token) throw new Error(body.error_messages?.join(", ") || "Gagal membuat sesi pembayaran Midtrans.");
	return {
		token: body.token,
		clientKey: clientKey() || null,
		snapScriptUrl: snapScriptUrl(),
		isDemo: false
	};
}
async function fetchMidtransStatus(orderId) {
	if (!serverKey()) return null;
	const res = await fetch(`${apiBase()}/v2/${encodeURIComponent(orderId)}/status`, { headers: {
		Accept: "application/json",
		Authorization: authHeader()
	} });
	if (!res.ok) return null;
	return await res.json();
}
function isPaidStatus(status) {
	return status === "settlement" || status === "capture";
}
function verifyNotificationSignature(payload) {
	const key = serverKey();
	if (!key) return false;
	return createHash("sha512").update(payload.order_id + payload.status_code + payload.gross_amount + key).digest("hex") === payload.signature_key;
}
//#endregion
export { createSnapTransaction, fetchMidtransStatus, isMidtransConfigured, isPaidStatus, snapScriptUrl, verifyNotificationSignature };
