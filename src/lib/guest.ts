export type GuestCheckout = {
  name: string;
  address: string;
  email: string;
  whatsapp: string;
};

const KEY = "gsf-guest";

export function readGuestCheckout(): GuestCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<GuestCheckout>;
    return {
      name: String(data.name ?? ""),
      address: String(data.address ?? ""),
      email: String(data.email ?? ""),
      whatsapp: String(data.whatsapp ?? ""),
    };
  } catch {
    return null;
  }
}

export function writeGuestCheckout(data: GuestCheckout) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
}
