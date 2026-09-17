import { Link } from "@tanstack/react-router";
import { EVENT } from "@/lib/event";
import { cn } from "@/lib/utils";

export function MainLogo({
  className,
  to = "/",
}: {
  className?: string;
  to?: string;
}) {
  const img = (
    <img
      src={EVENT.logos.main.src}
      alt={EVENT.logos.main.alt}
      className={cn("h-10 w-auto object-contain sm:h-11", className)}
    />
  );
  if (!to) return img;
  return (
    <Link to={to} className="flex items-center" aria-label={EVENT.logos.main.alt}>
      {img}
    </Link>
  );
}

export function PartnerLogos({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 sm:gap-5", className)}>
      {EVENT.logos.partners.map((logo) => (
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          className={cn(
            "w-auto object-contain object-left",
            "onLight" in logo && logo.onLight && "bg-white p-1.5",
            "wide" in logo && logo.wide
              ? compact
                ? "h-8 max-w-[10.5rem] sm:h-9 sm:max-w-[13rem]"
                : "h-10 max-w-[13rem] sm:h-12 sm:max-w-[16rem]"
              : compact
                ? "h-9 sm:h-11"
                : "h-11 sm:h-14",
          )}
        />
      ))}
    </div>
  );
}
