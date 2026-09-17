import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/format";
import { adminConfirmOrder, getAdminProof } from "@/lib/tickets/server";
import { RoleOnly, useStaff } from "@/components/admin-staff";

export const Route = createFileRoute("/admin/pembayaran")({ component: AdminPembayaranPage });

function AdminPembayaranPage() {
  return (
    <RoleOnly roles={["admin", "crew"]}>
      <AdminPembayaran />
    </RoleOnly>
  );
}

function AdminPembayaran() {
  const { token, dash, reload, checking } = useStaff();
  const [busy, setBusy] = useState(false);
  const [proof, setProof] = useState<{ orderId: string; src: string; fileName: string } | null>(null);
  if (checking || !dash) return null;

  async function viewProof(orderId: string) {
    try {
      const data = await getAdminProof({ data: { orderId, token } });
      setProof({
        orderId,
        fileName: data.fileName,
        src: `data:${data.mime};base64,${data.data}`,
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Bukti tidak ditemukan.");
    }
  }

  async function confirm(orderId: string) {
    setBusy(true);
    try {
      await adminConfirmOrder({ data: { orderId, token } });
      toast.success("Pembayaran dikonfirmasi. Tiket sudah terbit.");
      await reload();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal konfirmasi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="font-display text-2xl italic">Konfirmasi pembayaran</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tinjau bukti transfer. Setelah dikonfirmasi, tiket terbit dan nominal masuk ke uang diterima.
      </p>
      <div className="mt-6 grid gap-4">
        {dash.orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada bukti masuk.</p>
        ) : (
          dash.orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                  <p className="mt-1 text-sm">{order.ticketName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.holderName} · {order.whatsapp}
                  </p>
                  <p className="mt-2 font-display text-2xl tabular-nums">{formatIdr(order.payableAmount)}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {order.status === "paid" ? "Terkonfirmasi" : "Menunggu konfirmasi"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {order.hasProof ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => void viewProof(order.id)}>
                      Lihat bukti
                    </Button>
                  ) : null}
                  {order.status === "submitted" ? (
                    <Button type="button" size="sm" disabled={busy} onClick={() => void confirm(order.id)}>
                      Konfirmasi
                    </Button>
                  ) : null}
                </div>
              </div>
              {proof?.orderId === order.id ? (
                <img
                  src={proof.src}
                  alt={proof.fileName}
                  className="mt-4 max-h-96 w-full rounded-lg border border-border bg-muted object-contain"
                />
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
