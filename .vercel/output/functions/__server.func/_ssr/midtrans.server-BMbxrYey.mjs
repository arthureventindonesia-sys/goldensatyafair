import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/midtrans.server-BMbxrYey.js
function readLocalKeys() {
	try {
		const raw = readFileSync(join(process.cwd(), ".grok/midtrans.json"), "utf8");
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function serverKey() {
	return process.env.MIDTRANS_SERVER_KEY?.trim() || readLocalKeys().serverKey?.trim() || "";
}
function isMidtransConfigured() {
	return Boolean(serverKey());
}
function midtransIsProduction() {
	const mode = (process.env.MIDTRANS_MODE || readLocalKeys().mode || "").trim().toLowerCase();
	if (mode === "production" || mode === "prod") return true;
	if (mode === "sandbox") return false;
	return false;
}
function apiBase() {
	return midtransIsProduction() ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
}
function authHeader() {
	return `Basic ${Buffer.from(`${serverKey()}:`).toString("base64")}`;
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
function isClosedStatus(status) {
	return status === "expire" || status === "cancel" || status === "deny" || status === "failure";
}
function verifyNotificationSignature(payload) {
	const key = serverKey();
	if (!key) return false;
	const expected = createHash("sha512").update(payload.order_id + payload.status_code + payload.gross_amount + key).digest("hex");
	const left = Buffer.from(expected, "utf8");
	const right = Buffer.from(payload.signature_key, "utf8");
	if (left.length !== right.length) return false;
	return timingSafeEqual(left, right);
}
async function verifyAndReadNotification(payload) {
	const orderId = String(payload.order_id ?? "").trim();
	const statusCode = String(payload.status_code ?? "").trim();
	const grossAmount = String(payload.gross_amount ?? "").trim();
	const signatureKey = String(payload.signature_key ?? "").trim();
	if (!orderId || !statusCode || !grossAmount || !signatureKey) return {
		ok: false,
		reason: "invalid"
	};
	if (!verifyNotificationSignature({
		order_id: orderId,
		status_code: statusCode,
		gross_amount: grossAmount,
		signature_key: signatureKey
	})) return {
		ok: false,
		reason: "forbidden"
	};
	const live = await fetchMidtransStatus(orderId);
	const transactionStatus = live?.transaction_status || payload.transaction_status;
	const paymentType = live?.payment_type || payload.payment_type || "qris";
	const fraud = (payload.fraud_status || "accept").toLowerCase();
	return {
		ok: true,
		orderId,
		transactionStatus,
		paymentType,
		paid: isPaidStatus(transactionStatus) && fraud !== "deny" && fraud !== "challenge",
		closed: isClosedStatus(transactionStatus)
	};
}
//#endregion
export { fetchMidtransStatus, isMidtransConfigured, isPaidStatus, verifyAndReadNotification };
