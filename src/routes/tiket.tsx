import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ETicket } from "@/components/e-ticket";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatIdr } from "@/lib/format";
import { getMyTickets, type OrderRecord, type TicketRecord } from "@/lib/tickets/server";

export const Route = createFileRoute("/tiket")({ component: MyTicketsPage });

function MyTicketsPage() {
  const { user, isPending } = useCurrentUserState();
  const [tickets, setTickets] = useState<TicketRecord[] | null>(null);
  const [pending, setPending] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (!user) return;
    void getMyTickets()
      .then((data) => {
        setTickets(data.tickets);
        setPending(data.pending);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
        setTickets([]);
      });
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-56 w-full" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: "/tiket" }} />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Akun</p>
      <h1 className="mt-3 font-display text-4xl italic tracking-tight">Tiket saya</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        E-ticket lunas. Tunjukkan QR di pintu masuk.
      </p>

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

      {tickets === null ? (
        <Skeleton className="mt-8 h-56 w-full" />
      ) : tickets.length === 0 ? (
        <div className="mt-12 rounded-xl border border-border px-6 py-16 text-center">
          <p className="font-display text-2xl italic">Belum ada tiket</p>
          <p className="mt-2 text-sm text-muted-foreground">
            VIP dan Festival masih tersedia di halaman utama.
          </p>
          <Button asChild className="mt-6">
            <a href="/#tiket">
              Lihat tiket
            </a>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="grid gap-3">
              <ETicket ticket={ticket} />
              <div className="flex flex-wrap gap-3 no-print">
                <Button asChild variant="outline" size="sm">
                  <Link to="/tiket/$code" params={{ code: ticket.code }}>
                    Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
