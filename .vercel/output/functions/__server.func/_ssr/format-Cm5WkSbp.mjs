import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-Cm5WkSbp.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CVqXY6bk.mjs").then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-B-CEr28b.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
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
//#endregion
export { formatIdr as a, normalizeWhatsapp as c, formatEventTime as i, displayWhatsapp as n, isValidEmail as o, formatEventDate as r, isValidWhatsapp as s, authMiddleware as t };
