import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type ChargeItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type QrisChargeResult = {
  isDemo: boolean;
  qrString: string | null;
  qrImageUrl: string | null;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  clientKey: string | null;
  snapScriptUrl: string;
};

type LocalKeys = {
  serverKey?: string;
  clientKey?: string;
  mode?: string;
};

function readLocalKeys(): LocalKeys {
  try {
    const raw = readFileSync(join(process.cwd(), ".grok/midtrans.json"), "utf8");
    const parsed = JSON.parse(raw) as LocalKeys;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function serverKey() {
  return (
    process.env.MIDTRANS_SERVER_KEY?.trim() ||
    readLocalKeys().serverKey?.trim() ||
    ""
  );
}

function clientKey() {
  return (
    process.env.MIDTRANS_CLIENT_KEY?.trim() ||
    process.env.VITE_MIDTRANS_CLIENT_KEY?.trim() ||
    readLocalKeys().clientKey?.trim() ||
    ""
  );
}

export function isMidtransConfigured() {
  return Boolean(serverKey());
}

export function midtransIsProduction() {
  const mode = (process.env.MIDTRANS_MODE || readLocalKeys().mode || "").trim().toLowerCase();
  if (mode === "production" || mode === "prod") return true;
  if (mode === "sandbox") return false;
  return false;
}

function apiBase() {
  return midtransIsProduction()
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

function snapBase() {
  return midtransIsProduction()
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

function authHeader() {
  return `Basic ${Buffer.from(`${serverKey()}:`).toString("base64")}`;
}

export function snapScriptUrl() {
  return `${snapBase()}/snap/snap.js`;
}

async function createSnapQris(input: {
  orderId: string;
  grossAmount: number;
  item: ChargeItem;
  email: string;
  phone: string;
}): Promise<QrisChargeResult> {
  const res = await fetch(`${snapBase()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      item_details: [
        {
          id: input.item.id,
          name: input.item.name,
          price: input.item.price,
          quantity: input.item.quantity,
        },
      ],
      customer_details: {
        email: input.email,
        phone: input.phone,
      },
      enabled_payments: ["other_qris"],
      expiry: {
        unit: "minutes",
        duration: 15,
      },
    }),
  });
  const body = (await res.json()) as {
    token?: string;
    redirect_url?: string;
    error_messages?: string[];
  };
  if (!res.ok || !body.token) {
    throw new Error(
      body.error_messages?.join(", ") || "Gagal membuat sesi QRIS Midtrans.",
    );
  }
  const redirect =
    body.redirect_url || `${snapBase()}/snap/v4/redirection/${body.token}`;
  return {
    isDemo: false,
    qrString: null,
    qrImageUrl: null,
    snapToken: body.token,
    snapRedirectUrl: redirect,
    clientKey: clientKey() || null,
    snapScriptUrl: snapScriptUrl(),
  };
}

export async function createQrisCharge(input: {
  orderId: string;
  grossAmount: number;
  item: ChargeItem;
  email: string;
  phone: string;
}): Promise<QrisChargeResult> {
  const key = serverKey();
  if (!key) {
    return {
      isDemo: true,
      qrString: null,
      qrImageUrl: null,
      snapToken: null,
      snapRedirectUrl: null,
      clientKey: null,
      snapScriptUrl: snapScriptUrl(),
    };
  }

  const res = await fetch(`${apiBase()}/v2/charge`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      payment_type: "qris",
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      item_details: [
        {
          id: input.item.id,
          name: input.item.name,
          price: input.item.price,
          quantity: input.item.quantity,
        },
      ],
      customer_details: {
        email: input.email,
        phone: input.phone,
      },
      qris: { acquirer: "gopay" },
      custom_expiry: {
        expiry_duration: 15,
        unit: "minute",
      },
    }),
  });

  const body = (await res.json()) as {
    status_code?: string;
    status_message?: string;
    qr_string?: string;
    actions?: { name?: string; url?: string }[];
    error_messages?: string[];
  };

  if (body.qr_string) {
    const qrImageUrl =
      body.actions?.find((a) => a.name === "generate-qr-code" && a.url)?.url ||
      body.actions?.find((a) => a.url)?.url ||
      null;
    return {
      isDemo: false,
      qrString: body.qr_string,
      qrImageUrl,
      snapToken: null,
      snapRedirectUrl: null,
      clientKey: clientKey() || null,
      snapScriptUrl: snapScriptUrl(),
    };
  }

  const blocked = body.status_code === "402" || /not activated/i.test(body.status_message || "");
  if (blocked) {
    return createSnapQris(input);
  }

  throw new Error(
    body.error_messages?.join(", ") ||
      body.status_message ||
      "Gagal membuat pembayaran QRIS Midtrans.",
  );
}

export async function fetchMidtransStatus(orderId: string) {
  if (!serverKey()) return null;
  const res = await fetch(`${apiBase()}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    order_id?: string;
    transaction_status?: string;
    status_code?: string;
    gross_amount?: string;
    payment_type?: string;
    signature_key?: string;
  };
}

export function isPaidStatus(status?: string) {
  return status === "settlement" || status === "capture";
}

export function isClosedStatus(status?: string) {
  return status === "expire" || status === "cancel" || status === "deny" || status === "failure";
}

export function verifyNotificationSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}) {
  const key = serverKey();
  if (!key) return false;
  const expected = createHash("sha512")
    .update(payload.order_id + payload.status_code + payload.gross_amount + key)
    .digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(payload.signature_key, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  payment_type?: string;
  fraud_status?: string;
};

export async function verifyAndReadNotification(payload: MidtransNotification) {
  const orderId = String(payload.order_id ?? "").trim();
  const statusCode = String(payload.status_code ?? "").trim();
  const grossAmount = String(payload.gross_amount ?? "").trim();
  const signatureKey = String(payload.signature_key ?? "").trim();
  if (!orderId || !statusCode || !grossAmount || !signatureKey) {
    return { ok: false as const, reason: "invalid" as const };
  }
  const signed = verifyNotificationSignature({
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
  });
  if (!signed) {
    return { ok: false as const, reason: "forbidden" as const };
  }

  const live = await fetchMidtransStatus(orderId);
  const transactionStatus = live?.transaction_status || payload.transaction_status;
  const paymentType = live?.payment_type || payload.payment_type || "qris";
  const fraud = (payload.fraud_status || "accept").toLowerCase();
  const paid = isPaidStatus(transactionStatus) && fraud !== "deny" && fraud !== "challenge";
  const closed = isClosedStatus(transactionStatus);

  return {
    ok: true as const,
    orderId,
    transactionStatus,
    paymentType,
    paid,
    closed,
  };
}
