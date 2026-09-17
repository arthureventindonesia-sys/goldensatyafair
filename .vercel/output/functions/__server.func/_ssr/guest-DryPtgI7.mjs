//#region node_modules/.nitro/vite/services/ssr/assets/guest-DryPtgI7.js
var KEY = "gsf-guest";
function readGuestCheckout() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		return {
			name: String(data.name ?? ""),
			address: String(data.address ?? ""),
			email: String(data.email ?? ""),
			whatsapp: String(data.whatsapp ?? "")
		};
	} catch {
		return null;
	}
}
function writeGuestCheckout(data) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {}
}
//#endregion
export { writeGuestCheckout as n, readGuestCheckout as t };
