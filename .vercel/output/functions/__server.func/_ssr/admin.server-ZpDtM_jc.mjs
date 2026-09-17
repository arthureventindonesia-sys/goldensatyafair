import { a as getCookie, o as setCookie$1 } from "./ssr.mjs";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.server-ZpDtM_jc.js
var COOKIE = "gsf-admin";
var MAX_AGE_SEC = 604800;
var ADMIN_USERNAME = "iang";
var ADMIN_PASSWORD = "$golden";
function secret() {
	return process.env.BETTER_AUTH_SECRET ?? "gsf-preview-admin-secret";
}
function safeEqual(a, b) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	if (left.length !== right.length) return false;
	return timingSafeEqual(left, right);
}
function hashPassword(password) {
	const salt = randomBytes(16).toString("hex");
	return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
function verifyPassword(password, stored) {
	const [salt, hash] = String(stored).split(":");
	if (!salt || !hash) return false;
	try {
		const next = scryptSync(password, salt, 64);
		const prev = Buffer.from(hash, "hex");
		if (prev.length !== next.length) return false;
		return timingSafeEqual(prev, next);
	} catch {
		return false;
	}
}
function issueStaffToken(username, role) {
	const body = `${username}.${role}.${Date.now() + MAX_AGE_SEC * 1e3}`;
	return `${body}.${createHmac("sha256", secret()).update(body).digest("hex")}`;
}
function parseStaffToken(raw) {
	const parts = String(raw ?? "").split(".");
	if (parts.length !== 4) return null;
	const [username, role, exp, sig] = parts;
	if (role !== "admin" && role !== "crew" && role !== "agent") return null;
	const body = `${username}.${role}.${exp}`;
	if (!safeEqual(sig, createHmac("sha256", secret()).update(body).digest("hex"))) return null;
	if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return null;
	if (!/^[a-z0-9_]{3,24}$/.test(username)) return null;
	return {
		username,
		role
	};
}
function setStaffCookie(username, role) {
	try {
		setCookie$1(COOKIE, issueStaffToken(username, role), {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: MAX_AGE_SEC
		});
	} catch {}
}
function clearStaffCookie() {
	try {
		setCookie$1(COOKIE, "", {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 0
		});
	} catch {}
}
function readStaffSession(token) {
	const fromToken = parseStaffToken(token ?? "");
	if (fromToken) return fromToken;
	try {
		return parseStaffToken(getCookie(COOKIE) ?? "");
	} catch {
		return null;
	}
}
function requireStaff(token) {
	const session = readStaffSession(token);
	if (!session) throw new Error("Unauthorized");
	return session;
}
function assertNotStaffBuyer(token) {
	if (readStaffSession(token)) throw new Error("Akun admin, crew, atau agent tidak bisa membeli tiket.");
}
function requireAdmin(token) {
	const session = requireStaff(token);
	if (session.role !== "admin") throw new Error("Hanya admin yang bisa melakukan ini.");
	return session;
}
function requireCrew(token) {
	const session = requireStaff(token);
	if (session.role !== "admin" && session.role !== "crew") throw new Error("Hanya crew atau admin yang bisa melakukan ini.");
	return session;
}
function asStaffRole(value) {
	if (value === "admin" || value === "crew" || value === "agent") return value;
	return null;
}
//#endregion
export { ADMIN_PASSWORD, ADMIN_USERNAME, asStaffRole, assertNotStaffBuyer, clearStaffCookie, hashPassword, issueStaffToken, readStaffSession, requireAdmin, requireCrew, requireStaff, setStaffCookie, verifyPassword };
