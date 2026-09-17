import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ETicket } from "@/components/e-ticket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatIdr, isValidEmail, isValidWhatsapp } from "@/lib/format";
import { readGuestCheckout } from "@/lib/guest";
import { getMyTickets, type OrderRecord, type TicketRecord } from "@/lib/tickets/server";

export const Route = createFileRoute("/tiket")({ component: MyTicketsPage });

function MyTicketsPage() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [busy, setBusy] = useState(false);
  const [tickets, setTickets] = useState<TicketRecord[] | null>(null);
  const [pending, setPending] = useState<OrderRecord[]>([]);
  const [lookedUp, setLookedUp] = useState(false);

  useEffect(() => {
    const saved = readGuestCheckout();
    if (!saved) return;
    if (saved.email) setEmail(saved.email);
    if (saved.whatsapp) setWhatsapp(saved.whatsapp);
    if (!isValidEmail(saved.email) || !isValidWhatsapp(saved.whatsapp)) return;
    setBusy(true);
    void getMyTickets({ data: { email: saved.email, whatsapp: saved.whatsapp } })
      .then((data) => {
        setTickets(data.tickets);
        setPending(data.pending);
        setLookedUp(true);
      })
      .catch(() => {
        /* stay on the lookup form */
      })
      .finally(() => setBusy(false));
  }, []);

  async function lookup() {
    if (!isValidEmail(email)) {
      toast.error("Email tidak valid.");
      return;
    }
    if (!isValidWhatsapp(whatsapp)) {
      toast.error("Nomor WhatsApp Indonesia tidak valid.");
      return;
    }
    setBusy(true);
    try {
      const data = await getMyTickets({ data: { email, whatsapp } });
      setTickets(data.tickets);
      setPending(data.pending);
      setLookedUp(true);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
      setTickets([]);
      setPending([]);
      setLookedUp(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Tiket</p>
      <h1 className="mt-3 font-display text-4xl italic tracking-tight">Tiket saya</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cek tiket dengan email dan WhatsApp yang dipakai saat checkout. Tidak perlu membuat akun.
      </p>

      <form
        className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          void lookup();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="wa">Nomor WhatsApp</Label>
          <Input
            id="wa"
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Mencari…" : "Lihat tiket"}
          </Button>
        </div>
      </form>

      {pending.length > 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium">Menunggu pembayaran / konfirmasi</p>
          <ul className="mt-3 grid gap-3">
            {pending.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {order.ticketName} · {formatIdr(order.payableAmount)}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {order.status === "submitted"
                      ? "Menunggu konfirmasi admin"
                      : "Belum unggah bukti"}
                  </span>
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link
                    to={order.status === "submitted" ? "/order/$orderId" : "/order/$orderId/konfirmasi"}
                    params={{ orderId: order.id }}
                  >
                    {order.status === "submitted" ? "Lihat" : "Konfirmasi"}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tickets === null ? null : tickets.length === 0 && lookedUp ? (
        <p className="mt-8 text-sm text-muted-foreground">Belum ada tiket lunas untuk data ini.</p>
      ) : (
        <div className="mt-8 grid gap-6">
          {tickets?.map((ticket) => (
            <ETicket key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </main>
  );
}
