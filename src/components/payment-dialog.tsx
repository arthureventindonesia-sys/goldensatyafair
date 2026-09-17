import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { CopyNominalIcon } from "@/components/copy-nominal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GpnMark, QrisWordmark } from "@/components/qris-brand";
import { QrCode } from "@/components/qr-code";
import { QRIS } from "@/lib/event";
import { formatIdr, formatUniqueCode } from "@/lib/format";
import type { PaymentSession } from "@/lib/tickets/server";

function formatRemain(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

async function downloadQris() {
  const res = await fetch(QRIS.poster);
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `QRIS-${QRIS.merchant.replace(/\s+/g, "-")}.jpg`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function QrisPoster({
  amount,
  uniqueCode,
  ticketName,
  quantity,
  orderId,
}: {
  amount: number;
  uniqueCode: number;
  ticketName: string;
  quantity: number;
  orderId?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-white px-5 pb-5 pt-6 text-[#111]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,#111 0 1px,transparent 1px 18px),repeating-linear-gradient(0deg,#111 0 1px,transparent 1px 18px)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-0 top-[38%] h-0 w-0 border-y-[42px] border-y-transparent border-l-[58px] border-l-[#E31C23]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-0 w-0 border-b-[72px] border-b-[#E31C23] border-l-[86px] border-l-transparent"
      />

      <div className="relative flex items-start justify-between gap-2 pr-6">
        <QrisWordmark className="h-12 w-auto max-w-[78%] bg-white object-contain object-left" />
        <GpnMark className="mt-0.5 h-11 w-14 shrink-0" />
      </div>

      <div className="relative mt-5 text-center">
        <p className="text-[15px] font-extrabold uppercase tracking-wide">{QRIS.merchant}</p>
        <p className="mt-1 text-[11px] tracking-wide text-[#666]">NMID: {QRIS.nmid}</p>
        <p className="mt-2 text-[11px] text-[#666]">
          {ticketName} + kode unik {formatUniqueCode(uniqueCode)}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-2xl font-extrabold tabular-nums tracking-tight">
            {formatIdr(amount)}
          </p>
          <CopyNominalIcon
            amount={amount}
            className="border border-[#ddd] bg-white text-[#111] hover:bg-[#f3f3f3] hover:text-[#111]"
          />
        </div>
        <p className="mt-1 text-[11px] font-medium text-[#E31C23]">
          Masukkan nominal ini saat bayar
        </p>
      </div>

      <div className="relative mx-auto mt-4 w-[240px] bg-white p-2">
        <QrCode
          value={QRIS.payload}
          tone="print"
          label={`QRIS statis ${QRIS.merchant}`}
          className="aspect-square w-full"
        />
      </div>

      <div className="relative mt-4 text-center">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em]">Satu QRIS untuk semua</p>
        <p className="mt-1 text-[10px] leading-relaxed text-[#555]">
          Cek aplikasi penyelenggara
          <br />
          di www.aspi-qris.id
        </p>
      </div>

      {orderId ? (
        <div className="relative mt-5 flex items-end justify-between gap-3 text-[10px] text-[#444]">
          <p>QRIS statis · Golden Satya Fair</p>
          <p className="font-mono tracking-wide">{orderId}</p>
        </div>
      ) : null}
    </div>
  );
}

export function PaymentDialog({
  open,
  onOpenChange,
  session,
  onConfirm,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: PaymentSession | null;
  onConfirm: () => void;
  busy: boolean;
}) {
  const [remain, setRemain] = useState(15 * 60);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !session) return;
    const end = Date.now() + 15 * 60 * 1000;
    setRemain(15 * 60);
    const timer = window.setInterval(() => {
      setRemain(Math.max(0, Math.round((end - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open, session?.orderId]);

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-[380px] gap-0 overflow-y-auto bg-[#f3f3f3] p-0 text-[#111] sm:rounded-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Bayar dengan QRIS</DialogTitle>
          <DialogDescription>
            {session.quantity} tiket {session.ticketName} · {formatIdr(session.payableAmount)}
          </DialogDescription>
        </DialogHeader>

        <QrisPoster
          amount={session.payableAmount}
          uniqueCode={session.uniqueCode}
          ticketName={session.ticketName}
          quantity={session.quantity}
          orderId={session.orderId}
        />

        <div className="grid gap-3 border-t border-[#ddd] bg-[#f3f3f3] px-4 py-4">
          <ol className="grid gap-1 text-[11px] text-[#444]">
            <li>1. Buka aplikasi bank atau e-wallet berlogo QRIS</li>
            <li>2. Scan kode, masukkan nominal {formatIdr(session.payableAmount)}</li>
            <li>3. Bayar, lalu unggah bukti transfer</li>
          </ol>
          <p className="text-center text-xs font-medium tabular-nums text-[#E31C23]">
            Berlaku {formatRemain(remain)}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#ccc] bg-white text-[#111] hover:bg-[#f7f7f7]"
            disabled={downloading}
            onClick={() => {
              setDownloading(true);
              void downloadQris()
                .catch(() => undefined)
                .finally(() => setDownloading(false));
            }}
          >
            <Download />
            {downloading ? "Menyiapkan unduhan…" : "Unduh QRIS"}
          </Button>
          <Button
            type="button"
            className="w-full bg-[#E31C23] text-white hover:bg-[#c4181e]"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Membuka…" : "Konfirmasi Pembayaran"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
