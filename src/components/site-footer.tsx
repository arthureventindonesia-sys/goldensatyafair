import { Link } from "@tanstack/react-router";
import { EVENT } from "@/lib/event";
import { MainLogo, PartnerLogos } from "@/components/brand-logos";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <MainLogo className="h-14 sm:h-16" />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {EVENT.name} {EVENT.year}. {EVENT.venue}, {EVENT.city}.
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              More information
            </p>
            <SocialLinks className="mt-3" compact />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Diselenggarakan bersama
            </p>
            <PartnerLogos className="mt-3" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>VIP dan Festival: QRIS statis.</p>
          <p className="mt-1">Usia {EVENT.ageLimit}+. Identitas wajib di pintu.</p>
          <p className="mt-3 text-[11px]">
            <Link to="/admin" className="text-muted-foreground/70 underline-offset-4 hover:underline">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
