import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyNominalIcon } from "@/components/copy-nominal";
import { PaymentDialog } from "@/components/payment-dialog";
import { QtyStepper } from "@/components/qty-stepper";
import { EVENT, PER_USER_LIMIT, TICKET_COPY, TICKET_IDS, isTicketTypeId, type TicketTypeId } from "@/lib/event";
import { formatIdr, isValidAddress, isValidEmail, isValidName, isValidWhatsapp, uniqueCodeFromPhone } from "@/lib/format";
import { readGuestCheckout, writeGuestCheckout } from "@/lib/guest";
import { normalizeReferral } from "@/lib/referral";
import { isStaffSession, readStaffToken } from "@/lib/staff-session";
import {
  createOrder,
  getCheckoutState,
  type CatalogStage,
  type CatalogTicket,
  type PaymentSession,
} from "@/lib/tickets/server";
import { cn } from "@/lib/utils";

const emptyQty = (): Record<TicketTypeId, number> => ({ vvip: 0, vip: 0, festival: 0 });

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): { type?: TicketTypeId; ref?: string } => {
    const type = isTicketTypeId(String(s.type ?? "")) ? (s.type as TicketTypeId) : undefined;
    const ref = normalizeReferral(String(s.ref ?? ""));
    return { ...(type ? { type } : {}), ...(ref ? { ref } : {}) };
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { type, ref } = Route.useSearch();
  const navigate = Route.useNavigate();
  const lockedRef = ref || "";
  const [qty, setQty] = useState<Record<TicketTypeId, number>>({
    ...emptyQty(),
    ...(type ? { [type]: 1 } : {}),
  });
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agree, setAgree] = useState(false);
  const [referral, setReferral] = useState(lockedRef);
  const [catalog, setCatalog] = useState<CatalogTicket[] | null>(null);
  const [stage, setStage] = useState<CatalogStage | null>(null);
  const [held, setHeld] = useState<Record<TicketTypeId, number>>(emptyQty());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [staffBuyer, setStaffBuyer] = useState(false);

  useEffect(() => {
    setStaffBuyer(isStaffSession());
    const saved = readGuestCheckout();
    if (!saved) return;
    if (saved.name) setFullName(saved.name);
    if (saved.address) setAddress(saved.address);
    if (saved.email) setEmail(saved.email);
    if (saved.whatsapp) setWhatsapp(saved.whatsapp);
  }, []);

  useEffect(() => {
    if (lockedRef) setReferral(lockedRef);
  }, [lockedRef]);

  useEffect(() => {
    void getCheckoutState({ data: { token: readStaffToken(), whatsapp: "" } })
      .then((data) => {
        setCatalog(data.tickets);
        setStage(data.stage);
        setHeld({ ...emptyQty(), ...data.held });
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isValidWhatsapp(whatsapp)) return;
    const timer = window.setTimeout(() => {
      void getCheckoutState({ data: { token: readStaffToken(), whatsapp } })
        .then((data) => {
          setHeld({ ...emptyQty(), ...data.held });
        })
        .catch(() => {
          /* keep last held */
        });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [whatsapp]);

  const visibleIds = (catalog ?? []).map((t) => t.id);
  const maxQty: Record<TicketTypeId, number> = {
    vvip: capFor("vvip", catalog, held),
    vip: capFor("vip", catalog, held),
    festival: capFor("festival", catalog, held),
  };

  useEffect(() => {
    if (loading) return;
    setQty((prev) => {
      const next = emptyQty();
      for (const id of TICKET_IDS) next[id] = visibleIds.includes(id) ? Math.min(prev[id], maxQty[id]) : 0;
      if (type && visibleIds.includes(type) && next[type] === 0 && maxQty[type] > 0) next[type] = 1;
      if (TICKET_IDS.every((id) => next[id] === prev[id])) return prev;
      return next;
    });
  }, [loading, type, maxQty.vvip, maxQty.vip, maxQty.festival, visibleIds.join(",")]);

  const total = useMemo(() => {
    if (!catalog) return 0;
    return TICKET_IDS.reduce((sum, id) => {
      const price = catalog.find((t) => t.id === id)?.priceIdr ?? 0;
      return sum + price * qty[id];
    }, 0);
  }, [catalog, qty]);
  const uniqueCode = uniqueCodeFromPhone(whatsapp);
  const payable = total + uniqueCode;
  const totalQty = qty.vvip + qty.vip + qty.festival;

  if (staffBuyer) {
    return (
      <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Checkout</p>
        <h1 className="mt-3 font-display text-4xl italic tracking-tight">Tidak bisa membeli</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Akun admin, crew, dan agent hanya untuk mengelola penjualan. Buka situs tanpa login staf untuk beli tiket.
        </p>
        <Link to="/admin" className="mt-6 inline-flex text-sm underline-offset-4 hover:underline">
          Ke panel staf
        </Link>
      </main>
    );
  }

  async function pay() {
    if (!agree) {
      toast.error("Setujui syarat pembelian terlebih dahulu.");
      return;
    }
    if (!isValidName(fullName)) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (!isValidAddress(address)) {
      toast.error("Alamat wajib diisi (minimal 8 karakter).");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Email tidak valid.");
      return;
    }
    if (!isValidWhatsapp(whatsapp)) {
      toast.error("Nomor WhatsApp Indonesia tidak valid.");
      return;
    }
    if (totalQty <= 0) {
      toast.error("Pilih minimal satu tiket.");
      return;
    }
    setSubmitting(true);
    try {
      const next = await createOrder({
        data: {
          items: TICKET_IDS.map((id) => ({ ticketTypeId: id, quantity: qty[id] })),
          name: fullName,
          address,
          email,
          whatsapp,
          referral,
          token: readStaffToken(),
        },
      });
      writeGuestCheckout({ name: fullName, address, email, whatsapp });
      setSession(next);
      setPayOpen(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Gagal membuat pesanan.";
      if (message === "Unauthorized") {
        toast.error("Sesi staf tidak bisa membeli tiket.");
        return;
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function confirmPay() {
    if (!session) return;
    setPayOpen(false);
    void navigate({
      to: "/order/$orderId/konfirmasi",
      params: { orderId: session.orderId },
    });
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Checkout</p>
        <h1 className="mt-3 font-display text-4xl italic tracking-tight">Beli tiket</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {EVENT.name} · {EVENT.venue}
          {stage ? ` · ${stage.name}` : ""}
        </p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Tidak perlu membuat akun. Isi data di bawah, bayar QRIS, lalu cek e-ticket di Tiket saya dengan email dan
          WhatsApp yang sama.
        </p>
        {!loading && !stage ? (
          <p className="mt-6 text-sm text-muted-foreground">Penjualan tiket sedang ditutup.</p>
        ) : null}

        <div className="mt-8 grid gap-3">
          {(catalog ?? []).map((item) => {
            const id = item.id;
            const copy = TICKET_COPY[id];
            const cap = maxQty[id];
            return (
              <div
                key={id}
                className={cn(
                  "flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
                  qty[id] > 0 ? "border-foreground bg-secondary" : "border-border",
                )}
              >
                <button
                  type="button"
                  className="text-left"
                  onClick={() => {
                    if (qty[id] === 0 && cap > 0) setQty((prev) => ({ ...prev, [id]: 1 }));
                  }}
                >
                  <p className="text-sm font-medium">{copy.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item ? formatIdr(item.priceIdr) : "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cap <= 0 ? "Tidak bisa dibeli saat ini." : `Maks. ${PER_USER_LIMIT} / nomor WA · bisa beli ${cap}`}
                  </p>
                </button>
                <QtyStepper
                  value={qty[id]}
                  min={0}
                  max={Math.max(qty[id], cap)}
                  onChange={(next) =>
                    setQty((prev) => ({
                      ...prev,
                      [id]: Math.max(0, Math.min(next, cap > 0 ? cap : 0)),
                    }))
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="nama">
              Nama lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nama"
              name="name"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama sesuai identitas"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alamat">
              Alamat <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="alamat"
              name="address"
              required
              rows={3}
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota"
              className="flex min-h-24 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Dipakai pada e-ticket dan pintu masuk.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">
              Email e-ticket <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wa">
              Nomor WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="wa"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="0812 3456 7890"
            />
            <p className="text-xs text-muted-foreground">
              Format Indonesia, diawali 08 atau +62. Tiga digit terakhir jadi kode unik nominal.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="referral">Kode referal agent</Label>
            <Input
              id="referral"
              autoComplete="off"
              placeholder="opsional"
              value={referral}
              readOnly={Boolean(lockedRef)}
              disabled={Boolean(lockedRef)}
              onChange={(e) => {
                if (lockedRef) return;
                setReferral(e.target.value);
              }}
              className={lockedRef ? "opacity-80" : undefined}
            />
            <p className="text-xs text-muted-foreground">
              {lockedRef
                ? "Terisi otomatis dari tautan agent dan tidak bisa diubah."
                : "Isi jika beli lewat agent. Kosongkan jika tidak ada."}
            </p>
          </div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-foreground"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            Saya memahami tiket lunas tidak dapat di-refund, dan data di atas dipakai untuk
            e-ticket serta pengingat masuk.
          </label>
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Ringkasan</p>
        <div className="mt-4 overflow-hidden rounded-lg">
          <img
            src={
              qty.vvip > 0 && qty.vip === 0 && qty.festival === 0
                ? TICKET_COPY.vvip.image
                : qty.vip > 0 && qty.vvip === 0 && qty.festival === 0
                  ? TICKET_COPY.vip.image
                  : qty.festival > 0 && qty.vvip === 0 && qty.vip === 0
                    ? TICKET_COPY.festival.image
                    : "/images/hero.jpg"
            }
            alt=""
            className="aspect-video w-full object-cover"
          />
        </div>
        <div className="mt-5 grid gap-2 text-sm">
          {TICKET_IDS.map((id) =>
            qty[id] > 0 ? (
              <div key={id} className="flex items-center justify-between">
                <span>
                  {qty[id]} × {TICKET_COPY[id].name}
                </span>
                <span className="tabular-nums">
                  {formatIdr((catalog?.find((t) => t.id === id)?.priceIdr ?? 0) * qty[id])}
                </span>
              </div>
            ) : null,
          )}
          {totalQty === 0 ? (
            <p className="text-muted-foreground">Belum ada tiket dipilih.</p>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Kode unik (3 digit HP)</span>
          <span className="tabular-nums">
            {whatsapp.replace(/\D/g, "").length >= 3 ? formatIdr(uniqueCode) : "—"}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm">Total bayar</span>
          <span className="flex items-center gap-2">
            <span className="font-display text-2xl tabular-nums">{formatIdr(payable)}</span>
            <CopyNominalIcon amount={payable} />
          </span>
        </div>
        <Button
          type="button"
          className="mt-6 w-full"
          disabled={submitting || loading || totalQty <= 0}
          onClick={() => void pay()}
        >
          {submitting ? "Menyiapkan QRIS…" : "CHECKOUT"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          VIP dan Festival dibayar dengan QRIS statis
        </p>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted-foreground underline-offset-4 hover:underline">
            Kembali
          </Link>
        </p>
      </aside>

      <PaymentDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        session={session}
        onConfirm={() => void confirmPay()}
        busy={submitting}
      />
    </main>
  );
}

function capFor(
  id: TicketTypeId,
  catalog: CatalogTicket[] | null,
  held: Record<TicketTypeId, number>,
) {
  const item = catalog?.find((t) => t.id === id);
  const remaining = item?.remaining ?? PER_USER_LIMIT;
  return Math.max(0, Math.min(PER_USER_LIMIT - (held[id] ?? 0), remaining));
}
