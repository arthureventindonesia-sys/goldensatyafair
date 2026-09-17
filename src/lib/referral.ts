export function normalizeReferral(value: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);
}

export function agentSignupPath(code: string) {
  const ref = normalizeReferral(code);
  return `/checkout?ref=${encodeURIComponent(ref)}`;
}

export function inLivePreviewFrame() {
  if (typeof window === "undefined") return false;
  return window.parent !== window || window.location.hostname.endsWith(".grok-sandbox.com");
}

export function agentSignupUrl(code: string) {
  const path = agentSignupPath(code);
  if (typeof window === "undefined") return path;
  if (inLivePreviewFrame()) return path;
  return `${window.location.origin}${path}`;
}
