import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminOnly, useStaff } from "@/components/admin-staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STAGE_COPY, type SalesStageId } from "@/lib/event";
import { updateTicketStages, type AdminStage } from "@/lib/tickets/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tiket")({ component: AdminTiketPage });

function toInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const shift = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  return shift.toISOString().slice(0, 16);
}

function fromInput(value: string) {
  if (!value) return null;
  const d = new Date(`${value}+07:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function AdminTiketPage() {
  return (
    <AdminOnly>
      <AdminTiket />
    </AdminOnly>
  );
}

function AdminTiket() {
  const { token, dash, reload } = useStaff();
  const [stages, setStages] = useState<AdminStage[]>(dash?.stages ?? []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (dash?.stages) setStages(dash.stages.map((s) => ({ ...s, offers: s.offers.map((o) => ({ ...o })) })));
  }, [dash]);

  if (!dash) return null;

  function patchStage(id: SalesStageId, patch: Partial<AdminStage>) {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save() {
    setBusy(true);
    try {
      await updateTicketStages({
        data: {
          token,
          stages: stages.map((s) => ({
            id: s.id,
            enabled: s.enabled,
            startsAt: s.startsAt,
            endsAt: s.endsAt,
            offers: s.offers.map((o) => ({
              ticketTypeId: o.ticketTypeId,
              priceIdr: o.priceIdr,
              quota: o.quota,
            })),
          })),
        },
      });
      toast.success("Pengaturan tiket disimpan.");
      await reload();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan tiket.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="font-display text-2xl italic">Tiket</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aktifkan satu tahap penjualan, atur jadwal, harga, dan kuota. Early Bird tidak menjual VVIP.
          {dash.activeStageId ? ` Tahap aktif: ${STAGE_COPY[dash.activeStageId].name}.` : " Tidak ada tahap aktif sekarang."}
        </p>
      </div>

      {stages.map((stage) => (
        <section key={stage.id} className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl italic">{stage.name}</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-foreground"
                checked={stage.enabled}
                onChange={(e) => patchStage(stage.id, { enabled: e.target.checked })}
              />
              {stage.enabled ? "Aktif" : "Nonaktif"}
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`start-${stage.id}`}>Mulai</Label>
              <Input
                id={`start-${stage.id}`}
                type="datetime-local"
                value={toInput(stage.startsAt)}
                onChange={(e) => patchStage(stage.id, { startsAt: fromInput(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`end-${stage.id}`}>Selesai</Label>
              <Input
                id={`end-${stage.id}`}
                type="datetime-local"
                value={toInput(stage.endsAt)}
                onChange={(e) => patchStage(stage.id, { endsAt: fromInput(e.target.value) })}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {stage.offers.map((offer, i) => (
              <div key={offer.ticketTypeId} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
                <p className="text-sm font-medium sm:col-span-3">{offer.name}</p>
                <div className="grid gap-2">
                  <Label htmlFor={`price-${stage.id}-${offer.ticketTypeId}`}>Harga (Rp)</Label>
                  <Input
                    id={`price-${stage.id}-${offer.ticketTypeId}`}
                    type="number"
                    min={1}
                    value={offer.priceIdr}
                    onChange={(e) => {
                      const offers = stage.offers.map((row, idx) =>
                        idx === i ? { ...row, priceIdr: Number(e.target.value) } : row,
                      );
                      patchStage(stage.id, { offers });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`quota-${stage.id}-${offer.ticketTypeId}`}>Kuota</Label>
                  <Input
                    id={`quota-${stage.id}-${offer.ticketTypeId}`}
                    type="number"
                    min={offer.sold}
                    value={offer.quota}
                    onChange={(e) => {
                      const offers = stage.offers.map((row, idx) =>
                        idx === i ? { ...row, quota: Number(e.target.value) } : row,
                      );
                      patchStage(stage.id, { offers });
                    }}
                  />
                </div>
                <p className={cn("self-end text-sm text-muted-foreground")}>Terjual {offer.sold}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Button type="button" className="w-fit" disabled={busy} onClick={() => void save()}>
        {busy ? "Menyimpan…" : "Simpan tiket"}
      </Button>
    </div>
  );
}
