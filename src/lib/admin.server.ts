import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type StaffRole = "admin" | "crew" | "agent";
export type StaffSession = { username: string; role: StaffRole };

const COOKIE = "gsf-admin";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;
export const ADMIN_USERNAME = "iang";
export const ADMIN_PASSWORD = "$golden";

function secret() {
  return process.env.BETTER_AUTH_SECRET ?? "gsf-preview-admin-secret";
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
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

export function issueStaffToken(username: string, role: StaffRole) {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const body = `${username}.${role}.${exp}`;
  const sig = createHmac("sha256", secret()).update(body).digest("hex");
  return `${body}.${sig}`;
}

export function parseStaffToken(raw: string): StaffSession | null {
  const parts = String(raw ?? "").split(".");
  if (parts.length !== 4) return null;
  const [username, role, exp, sig] = parts;
  if (role !== "admin" && role !== "crew" && role !== "agent") return null;
  const body = `${username}.${role}.${exp}`;
  const expect = createHmac("sha256", secret()).update(body).digest("hex");
  if (!safeEqual(sig, expect)) return null;
  if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return null;
  if (!/^[a-z0-9_]{3,24}$/.test(username)) return null;
  return { username, role };
}

export function setStaffCookie(username: string, role: StaffRole) {
  try {
    setCookie(COOKIE, issueStaffToken(username, role), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_AGE_SEC,
    });
  } catch {
    // Preview iframe may reject cookies; the client token is the source of truth.
  }
}

export function clearStaffCookie() {
  try {
    setCookie(COOKIE, "", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });
  } catch {
    /* ignore */
  }
}

export function readStaffSession(token?: string): StaffSession | null {
  const fromToken = parseStaffToken(token ?? "");
  if (fromToken) return fromToken;
  try {
    return parseStaffToken(getCookie(COOKIE) ?? "");
  } catch {
    return null;
  }
}

export function requireStaff(token?: string): StaffSession {
  const session = readStaffSession(token);
  if (!session) throw new Error("Unauthorized");
  return session;
}

export function assertNotStaffBuyer(token?: string) {
  if (readStaffSession(token)) {
    throw new Error("Akun admin, crew, atau agent tidak bisa membeli tiket.");
  }
}

export function requireAdmin(token?: string): StaffSession {
  const session = requireStaff(token);
  if (session.role !== "admin") throw new Error("Hanya admin yang bisa melakukan ini.");
  return session;
}

export function requireCrew(token?: string): StaffSession {
  const session = requireStaff(token);
  if (session.role !== "admin" && session.role !== "crew") {
    throw new Error("Hanya crew atau admin yang bisa melakukan ini.");
  }
  return session;
}

export function asStaffRole(value: string): StaffRole | null {
  if (value === "admin" || value === "crew" || value === "agent") return value;
  return null;
}
