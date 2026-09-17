import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/midtrans/notification")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          service: "midtrans-webhook",
          mode: "production",
          payments: "qris",
        }),
      POST: async ({ request }) => {
        let payload: Record<string, unknown> = {};
        const contentType = request.headers.get("content-type") || "";
        try {
          if (contentType.includes("application/x-www-form-urlencoded")) {
            const form = await request.formData();
            form.forEach((value, key) => {
              payload[key] = String(value);
            });
          } else {
            payload = (await request.json()) as Record<string, unknown>;
          }
        } catch {
          return new Response("invalid", { status: 400 });
        }

        const { verifyAndReadNotification } = await import("@/lib/midtrans.server");
        const { getSql } = await import("@/lib/db");
        const { applyMidtransNotification } = await import("@/lib/tickets/server");

        const verified = await verifyAndReadNotification({
          order_id: String(payload.order_id ?? ""),
          status_code: String(payload.status_code ?? ""),
          gross_amount: String(payload.gross_amount ?? ""),
          signature_key: String(payload.signature_key ?? ""),
          transaction_status: String(payload.transaction_status ?? ""),
          payment_type: String(payload.payment_type ?? ""),
          fraud_status: String(payload.fraud_status ?? ""),
        });

        if (!verified.ok) {
          return new Response(verified.reason, {
            status: verified.reason === "forbidden" ? 403 : 400,
          });
        }

        const sql = await getSql();
        await applyMidtransNotification(sql, verified.orderId, {
          paid: verified.paid,
          closed: verified.closed,
          paymentType: verified.paymentType,
        });

        return new Response("OK", { status: 200 });
      },
    },
  },
});
