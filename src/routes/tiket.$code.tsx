import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ETicket } from "@/components/e-ticket";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getTicketByCode, type TicketRecord } from "@/lib/tickets/server";

export const Route = createFileRoute("/tiket/$code")({ component: TicketDetailPage });

function TicketDetailPage() {
  const { code } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [ticket, setTicket] = useState<TicketRecord | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getTicketByCode({ data: { code } })
      .then(setTicket)
      .catch((e: unknown) => {
        setMissing(true);
        toast.error(e instanceof Error ? e.message : "Tiket tidak ditemukan.");
      });
  }, [user, code]);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: `/tiket/${code}` }} />;
  }

  if (missing) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl italic">Tiket tidak ditemukan</h1>
        <Button asChild className="mt-6">
          <Link to="/tiket">Tiket saya</Link>
        </Button>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <Link to="/tiket" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Tiket saya
        </Link>
        <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
          <Printer />
          Cetak
        </Button>
      </div>
      <ETicket ticket={ticket} />
    </main>
  );
}
