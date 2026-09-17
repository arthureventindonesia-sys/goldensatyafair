import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MainLogo, PartnerLogos } from "@/components/brand-logos";
import { SocialLinks } from "@/components/social-links";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EVENT, LINEUP, TICKET_COPY, TICKET_IDS, type TicketTypeId } from "@/lib/event";
import { formatEventDate, formatEventTime, formatIdr } from "@/lib/format";
import { isStaffSession } from "@/lib/staff-session";
import { getCatalog, type CatalogStage, type CatalogTicket } from "@/lib/tickets/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [tickets, setTickets] = useState<CatalogTicket[] | null>(null);
  const [stage, setStage] = useState<CatalogStage | null>(null);

  useEffect(() => {
    void getCatalog()
      .then((data) => {
        setTickets(data.tickets);
        setStage(data.stage);
      })
      .catch(() => setTickets([]));
  }, []);

  return (
    <main>
      <Hero />
      <Marquee />
      <Tickets tickets={tickets} stage={stage} />
      <Lineup />
      <Venue />
      <Info />
      <Cta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt="Sal Priadi di Golden Satya Fair"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-end px-5 pb-28 pt-24 sm:px-8 sm:pb-24">
        <p className="enter-up text-xs uppercase tracking-[0.28em] text-accent">
          {EVENT.monthLabel} · {EVENT.city}
        </p>
        <h1 className="sr-only">
          {EVENT.name} {EVENT.year}
        </h1>
        <MainLogo to="" className="enter-up mt-5 h-20 w-auto sm:h-28" />
        <p className="enter-up mt-6 max-w-md text-base text-foreground/85 sm:text-lg">
          {EVENT.tagline} VIP dan Festival di Golden Star Lumina.
        </p>
        <div className="enter-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <a href="#tiket">Beli tiket</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#lineup">Lihat lineup</a>
          </Button>
        </div>
        <div className="enter-up mt-10">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Diselenggarakan bersama
          </p>
          <PartnerLogos className="mt-3" compact />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const names = ["Golden Satya Fair", ...LINEUP.map((a) => a.name), "November 2026"].join("  ·  ");
  return (
    <div className="overflow-hidden border-y border-border py-4">
      <div className="marquee-track flex w-max gap-0 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-muted-foreground">
        <span className="px-8">{names}</span>
        <span className="px-8">{names}</span>
      </div>
    </div>
  );
}

function Tickets({ tickets, stage }: { tickets: CatalogTicket[] | null; stage: CatalogStage | null }) {
  const ids = (tickets ?? []).map((t) => t.id);
  const show = ids.length > 0 ? ids : TICKET_IDS.filter((id) => id !== "vvip");
  return (
    <section id="tiket" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Tiket</p>
      <h2 className="mt-3 font-display text-4xl italic tracking-tight sm:text-5xl">Pilih malammu</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">
        {stage
          ? `${stage.name}. Maksimal 5 tiket per jenis per akun, bisa dibeli sekaligus dalam satu checkout.`
          : "Penjualan tiket sedang ditutup. Nantikan tahap berikutnya."}
      </p>
      <div className={cn("mt-12 grid gap-6", show.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
        {show.map((id) => (
          <TicketCard key={id} id={id} tickets={tickets} stageOpen={Boolean(stage)} />
        ))}
      </div>
    </section>
  );
}

function TicketCard({
  id,
  tickets,
  stageOpen,
}: {
  id: TicketTypeId;
  tickets: CatalogTicket[] | null;
  stageOpen: boolean;
}) {
  const copy = TICKET_COPY[id];
  const stock = tickets?.find((t) => t.id === id);
  const soldOut = stageOpen && stock?.remaining === 0;
  const unavailable = stageOpen && !stock;
  const [staff, setStaff] = useState(false);
  useEffect(() => {
    setStaff(isStaffSession());
  }, []);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-photo overflow-hidden">
        <img src={copy.image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge className="border-foreground/20 bg-background/70 text-foreground">{copy.name}</Badge>
          {soldOut ? <Badge className="border-destructive/40 text-destructive">Habis</Badge> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
        <div>
          <p className="font-display text-3xl tracking-tight">
            {stock ? formatIdr(stock.priceIdr) : "—"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{copy.blurb}</p>
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          {copy.perks.map((perk) => (
            <li key={perk} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
              {perk}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">Maks. 5 tiket / akun</p>
        {staff ? (
          <Link to="/admin" className={cn(buttonVariants(), "relative z-10 mt-auto w-full")}>
            Akun staf tidak bisa membeli
          </Link>
        ) : (
          <Link
            to="/checkout"
            search={{ type: id }}
            className={cn(buttonVariants(), "relative z-10 mt-auto w-full")}
          >
            {!stageOpen || unavailable ? `Lihat ${copy.name}` : soldOut ? `Lihat ${copy.name}` : `Beli ${copy.name}`}
          </Link>
        )}
      </div>
    </article>
  );
}

function Lineup() {
  return (
    <section id="lineup" className="border-y border-border bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Lineup</p>
        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {LINEUP.map((act) => (
            <div key={act.name} className="border-t border-border pt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{act.role}</p>
              <img
                src={act.logo}
                alt={act.name}
                className={
                  act.role === "Headliner"
                    ? "mt-6 h-12 w-auto max-w-full object-contain object-left sm:h-16"
                    : "mt-6 h-16 w-auto max-w-[16rem] object-contain object-left sm:h-20"
                }
              />
              <p
                className={
                  act.role === "Headliner"
                    ? "mt-4 font-display text-3xl italic leading-none tracking-tight sm:text-4xl"
                    : "mt-4 font-display text-2xl italic leading-none tracking-tight sm:text-3xl"
                }
              >
                {act.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Venue() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Venue</p>
      <h2 className="mt-3 max-w-3xl font-display text-4xl italic tracking-tight">{EVENT.venue}</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Golden Satya Fair di Perumahan Golden Star Lumina, Bumiayu. Pintu buka {formatEventTime(EVENT.doorsAt)} WIB, acara
        mulai {formatEventTime(EVENT.startsAt)} WIB.
      </p>
      <a
        href={EVENT.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex h-11 items-center text-sm underline-offset-4 hover:underline"
      >
        Buka peta
      </a>
    </section>
  );
}

function Info() {
  const items = [
    {
      icon: Clock,
      title: "Jadwal",
      body: `${formatEventDate(EVENT.startsAt)} · pintu ${formatEventTime(EVENT.doorsAt)} · acara ${formatEventTime(EVENT.startsAt)}–${formatEventTime(EVENT.endsAt)} WIB`,
    },
    {
      icon: MapPin,
      title: "Lokasi",
      body: EVENT.address,
    },
    {
      icon: Users,
      title: "Usia",
      body: `${EVENT.ageLimit}+. Bawa KTP atau paspor. Anak di bawah usia tidak diizinkan.`,
    },
    {
      icon: Shield,
      title: "Masuk",
      body: "Tunjukkan QR e-ticket. Tas diperiksa. Dilarang membawa makanan luar, drone, dan kamera profesional tanpa izin.",
    },
  ];
  return (
    <section id="info" className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-px bg-border px-0 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="bg-background px-5 py-10 sm:px-8">
            <item.icon className="size-5 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">More information</p>
          <p className="mt-2 text-sm text-muted-foreground">Ikuti update lineup, pintu, dan pengumuman resmi.</p>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <img src="/images/hero.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 sm:py-28">
        <h2 className="max-w-xl font-display text-4xl italic tracking-tight sm:text-5xl">
          Ambil tempatmu sebelum habis.
        </h2>
        <Button asChild size="lg">
          <a href="#tiket">Beli tiket</a>
        </Button>
      </div>
    </section>
  );
}
