const JAKARTA = "Asia/Jakarta";

export function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: JAKARTA,
  }).format(new Date(iso));
}

export function formatEventTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: JAKARTA,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: JAKARTA,
  }).format(new Date(iso));
}

export function uniqueCodeFromPhone(input: string): number {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 3) return 0;
  return Number(digits.slice(-3));
}

export function formatUniqueCode(code: number) {
  return code.toString().padStart(3, "0");
}

export function normalizeWhatsapp(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return `62${digits}`;
}

export function isValidWhatsapp(input: string): boolean {
  return /^628[1-9][0-9]{7,11}$/.test(normalizeWhatsapp(input));
}

export function displayWhatsapp(stored: string): string {
  const n = stored.replace(/^62/, "");
  if (n.length >= 10) {
    return `+62 ${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}`;
  }
  return `+62 ${n}`;
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export function isValidName(input: string): boolean {
  const name = input.trim().replace(/\s+/g, " ");
  return name.length >= 2 && name.length <= 80;
}

export function isValidAddress(input: string): boolean {
  const address = input.trim().replace(/\s+/g, " ");
  return address.length >= 8 && address.length <= 200;
}
