//#region node_modules/.nitro/vite/services/ssr/assets/format-LT3CbQE3.js
var JAKARTA = "Asia/Jakarta";
function formatIdr(amount) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0
	}).format(amount);
}
function formatEventDate(iso) {
	return new Intl.DateTimeFormat("id-ID", {
		month: "long",
		year: "numeric",
		timeZone: JAKARTA
	}).format(new Date(iso));
}
function formatEventTime(iso) {
	return new Intl.DateTimeFormat("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: JAKARTA
	}).format(new Date(iso));
}
function uniqueCodeFromPhone(input) {
	const digits = input.replace(/\D/g, "");
	if (digits.length < 3) return 0;
	return Number(digits.slice(-3));
}
function formatUniqueCode(code) {
	return code.toString().padStart(3, "0");
}
function normalizeWhatsapp(input) {
	const digits = input.replace(/[^\d]/g, "");
	if (digits.startsWith("0")) return `62${digits.slice(1)}`;
	if (digits.startsWith("62")) return digits;
	return `62${digits}`;
}
function isValidWhatsapp(input) {
	return /^628[1-9][0-9]{7,11}$/.test(normalizeWhatsapp(input));
}
function displayWhatsapp(stored) {
	const n = stored.replace(/^62/, "");
	if (n.length >= 10) return `+62 ${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}`;
	return `+62 ${n}`;
}
function isValidEmail(input) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}
function isValidName(input) {
	const name = input.trim().replace(/\s+/g, " ");
	return name.length >= 2 && name.length <= 80;
}
function isValidAddress(input) {
	const address = input.trim().replace(/\s+/g, " ");
	return address.length >= 8 && address.length <= 200;
}
//#endregion
export { formatUniqueCode as a, isValidName as c, uniqueCodeFromPhone as d, formatIdr as i, isValidWhatsapp as l, formatEventDate as n, isValidAddress as o, formatEventTime as r, isValidEmail as s, displayWhatsapp as t, normalizeWhatsapp as u };
