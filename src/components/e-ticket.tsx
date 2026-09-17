import { EVENT, TICKET_COPY } from "@/lib/event";
import { displayWhatsapp, formatEventDate, formatEventTime } from "@/lib/format";
import { QrCode } from "@/components/qr-code";
import type { TicketRecord } from "@/lib/tickets/server";

export function ETicket({ ticket }: { ticket: TicketRecord }) {
  const copy = TICKET_COPY[ticket.ticketTypeId];
  return (
    <article className="print-ticket overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <img
                src={EVENT.logos.main.src}
                alt={EVENT.logos.main.alt}
                className="h-10 w-auto object-contain"
              />
              <h2 className="mt-3 font-display text-3xl italic tracking-tight">{EVENT.name}</h2>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider">
              {copy.name}
            </span>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Waktu</dt>
              <dd className="mt-1">{formatEventDate(EVENT.startsAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pintu buka</dt>
              <dd className="mt-1">{formatEventTime(EVENT.doorsAt)} WIB</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Venue</dt>
              <dd className="mt-1">
                {EVENT.venue}
                <br />
                {EVENT.city}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Nama</dt>
              <dd className="mt-1">{ticket.holderName || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Alamat</dt>
              <dd className="mt-1">{ticket.holderAddress || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 break-all">{ticket.holderEmail}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="mt-1">{displayWhatsapp(ticket.holderWhatsapp)}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 border-t border-border bg-muted p-6 md:border-l md:border-t-0">
          <QrCode value={ticket.code} label={`QR tiket ${ticket.code}`} />
          <p className="font-mono text-xs tracking-wider text-muted-foreground">{ticket.code}</p>
        </div>
      </div>
    </article>
  );
}
