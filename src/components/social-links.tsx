import { EVENT } from "@/lib/event";
import { cn } from "@/lib/utils";

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.15" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
    </svg>
  );
}

function TikTokMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M14.1 3c.35 2.42 1.72 4.08 4.15 4.28v2.38c-1.42.07-2.7-.4-3.95-1.22v6.56c0 3.3-2.5 5.9-5.85 5.9A5.86 5.86 0 0 1 2.6 15c0-3.24 2.62-5.87 5.85-5.87.24 0 .48.02.72.05v2.5A3.38 3.38 0 0 0 8.45 11.6 3.37 3.37 0 0 0 5.1 15a3.37 3.37 0 0 0 5.55 2.57c.5-.48.8-1.15.8-1.9V3h2.65Z"
      />
    </svg>
  );
}

const marks = {
  instagram: InstagramMark,
  tiktok: TikTokMark,
};

export function SocialLinks({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {EVENT.socials.map((item) => {
        const Mark = marks[item.id];
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 text-foreground transition-colors duration-150 hover:border-accent hover:text-accent",
              compact ? "h-10 px-3" : "h-11 px-4",
            )}
          >
            <Mark className="size-4 shrink-0" />
            <span className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </span>
              <span className={cn("mt-0.5 font-medium", compact ? "text-xs" : "text-sm")}>
                {item.handle}
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}
