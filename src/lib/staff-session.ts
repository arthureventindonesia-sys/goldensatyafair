const STAFF_KEY = "gsf-staff-token";

export function readStaffToken() {
  try {
    return localStorage.getItem(STAFF_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeStaffToken(token: string) {
  try {
    if (token) localStorage.setItem(STAFF_KEY, token);
    else localStorage.removeItem(STAFF_KEY);
  } catch {
    /* ignore */
  }
}

export function isStaffSession(token = typeof window === "undefined" ? "" : readStaffToken()) {
  const role = token.split(".")[1];
  return role === "admin" || role === "crew" || role === "agent";
}