//#region node_modules/.nitro/vite/services/ssr/assets/staff-session-BtLHB3gl.js
var STAFF_KEY = "gsf-staff-token";
function readStaffToken() {
	try {
		return localStorage.getItem(STAFF_KEY) ?? "";
	} catch {
		return "";
	}
}
function writeStaffToken(token) {
	try {
		if (token) localStorage.setItem(STAFF_KEY, token);
		else localStorage.removeItem(STAFF_KEY);
	} catch {}
}
function isStaffSession(token = typeof window === "undefined" ? "" : readStaffToken()) {
	const role = token.split(".")[1];
	return role === "admin" || role === "crew" || role === "agent";
}
//#endregion
export { readStaffToken as n, writeStaffToken as r, isStaffSession as t };
