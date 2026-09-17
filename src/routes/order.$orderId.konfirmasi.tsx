import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CopyNominalButton } from "@/components/copy-nominal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PAYMENT_REVIEW_NOTICE } from "@/lib/event";
import { formatIdr, formatUniqueCode } from "@/lib/format";
import { getOrder, uploadPaymentProof, type OrderRecord } from "@/lib/tickets/server";

export const Route = createFileRoute("/order/$orderId/konfirmasi")({
  component: ConfirmPaymentPage,
});

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const comma = text.indexOf(",");
      resolve(comma >= 0 ? text.slice(comma + 1) : text);
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

function ConfirmPaymentPage() {
  const { orderId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [missing, setMissing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getOrder({ data: { orderId } })
      .then((data) => {
        setOrder(data.order);
        if (data.order.status === "submitted" || data.order.hasProof) setDone(true);
      })
      .catch(() => setMissing(true));
  }, [user, orderId]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: `/order/${orderId}/konfirmasi` }} />;
  }

  if (missing) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl italic">Pesanan tidak ditemukan</h1>
        <Button asChild className="mt-6">
          <Link to="/tiket">Tiket saya</Link>
        </Button>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (order.status === "paid") {
    return <Navigate to="/order/$orderId" params={{ orderId: order.id }} />;
  }

  async function submit() {
    if (!file) {
      toast.error("Unggah bukti transfer terlebih dahulu.");
      return;
    }
    setBusy(true);
    try {
      const data = await fileToBase64(file);
      const next = await uploadPaymentProof({
        data: {
          orderId,
          fileName: file.name,
          mime: file.type || "image/jpeg",
          data,
        },
      });
      setOrder(next.order);
      setDone(true);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal mengunggah bukti.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Pesanan {order.id}
      </p>
      <h1 className="mt-3 font-display text-4xl italic tracking-tight">Konfirmasi pembayaran</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {order.ticketName}
        <br />
        Transfer sesuai nominal{" "}
        <span className="font-medium text-foreground">{formatIdr(order.payableAmount)}</span>
        {" "}(tiket {formatIdr(order.grossAmount)} + kode unik {formatUniqueCode(order.uniqueCode)}).
      </p>

      {done ? (
        <div className="mt-8 rounded-xl border border-accent/40 bg-card p-6">
          <p className="font-display text-2xl italic tracking-tight">Bukti terkirim</p>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{PAYMENT_REVIEW_NOTICE}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/tiket">Tiket saya</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/order/$orderId" params={{ orderId: order.id }}>
                Lihat pesanan
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-5 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">Nominal yang harus dibayar</p>
            <span className="flex items-center gap-2">
              <span className="font-display text-2xl tabular-nums">{formatIdr(order.payableAmount)}</span>
              <CopyNominalButton amount={order.payableAmount} />
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bukti">
              Bukti transfer <span className="text-destructive">*</span>
            </Label>
            <input
              id="bukti"
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Foto struk atau screenshot transfer dengan nominal yang sama. JPG, PNG, atau WEBP.
            </p>
          </div>
          {preview ? (
            <img
              src={preview}
              alt="Pratinjau bukti transfer"
              className="max-h-72 w-full rounded-lg border border-border object-contain bg-muted"
            />
          ) : null}
          <Button type="submit" disabled={busy || !file}>
            {busy ? "Mengunggah…" : "Kirim bukti transfer"}
          </Button>
        </form>
      )}
    </main>
  );
}
