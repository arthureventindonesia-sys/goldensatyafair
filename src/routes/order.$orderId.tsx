import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CopyNominalButton } from "@/components/copy-nominal";
import { ETicket } from "@/components/e-ticket";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PAYMENT_REVIEW_NOTICE } from "@/lib/event";
import { formatIdr, formatUniqueCode } from "@/lib/format";
import {
  getOrder,
  type OrderRecord,
  type TicketRecord,
} from "@/lib/tickets/server";

export const Route = createFileRoute("/order/$orderId")({ component: OrderPage });

function OrderPage() {
  const { orderId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let timer: number | undefined;
    const load = () =>
      getOrder({ data: { orderId } })
        .then((data) => {
          if (cancelled) return;
          setOrder(data.order);
          setTickets(data.tickets);
          if (data.order.status === "paid" && timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
          }
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setMissing(true);
          toast.error(e instanceof Error ? e.message : "Pesanan tidak ditemukan.");
        });
    void load();
    timer = window.setInterval(() => {
      void load();
    }, 4000);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [user, orderId]);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: `/order/${orderId}` }} />;
  }

  if (missing) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl italic">Pesanan tidak ditemukan</h1>
        <Button asChild className="mt-6">
          <Link to="/tiket">Tiket saya</Link>
        </Button>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  const paid = order.status === "paid";
  const submitted = order.status === "submitted";

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Pesanan {order.id}
      </p>
      <h1 className="mt-3 font-display text-4xl italic tracking-tight">
        {paid ? "Tiket sudah terbit" : submitted ? "Menunggu konfirmasi admin" : "Menunggu pembayaran"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {order.ticketName} · tiket {formatIdr(order.grossAmount)}
        <br />
        Kode unik {formatUniqueCode(order.uniqueCode)} · bayar{" "}
        <span className="font-medium text-foreground">{formatIdr(order.payableAmount)}</span>
      </p>

      {!paid ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          {submitted ? (
            <>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {PAYMENT_REVIEW_NOTICE}
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/tiket">Tiket saya</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Scan QRIS statis, masukkan nominal {formatIdr(order.payableAmount)} (tiket + 3 digit
                terakhir HP), lalu unggah bukti transfer.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CopyNominalButton amount={order.payableAmount} />
                <Button asChild>
                  <Link to="/order/$orderId/konfirmasi" params={{ orderId: order.id }}>
                    Konfirmasi Pembayaran
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/tiket">Tiket saya</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {tickets.map((ticket) => (
            <ETicket key={ticket.id} ticket={ticket} />
          ))}
          <div className="no-print flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/tiket">Semua tiket</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
