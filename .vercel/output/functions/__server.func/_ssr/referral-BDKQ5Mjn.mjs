//#region node_modules/.nitro/vite/services/ssr/assets/referral-BDKQ5Mjn.js
function normalizeReferral(value) {
	return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
}
function agentSignupPath(code) {
	const ref = normalizeReferral(code);
	return `/checkout?ref=${encodeURIComponent(ref)}`;
}
function inLivePreviewFrame() {
	if (typeof window === "undefined") return false;
	return window.parent !== window || window.location.hostname.endsWith(".grok-sandbox.com");
}
function agentSignupUrl(code) {
	const path = agentSignupPath(code);
	if (typeof window === "undefined") return path;
	if (inLivePreviewFrame()) return path;
	return `${window.location.origin}${path}`;
}
//#endregion
export { agentSignupUrl as n, normalizeReferral as r, agentSignupPath as t };
