import { useEffect, useState } from "react";

function parts(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const sec = Math.floor(diff / 1000);
  return {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
    done: diff === 0,
  };
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso);
  const [now, setNow] = useState<ReturnType<typeof parts> | null>(null);

  useEffect(() => {
    setNow(parts(target));
    const id = window.setInterval(() => setNow(parts(target)), 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  if (!now) {
    return <div className="grid h-20 grid-cols-4 gap-2 sm:gap-3" aria-hidden="true" />;
  }

  const cells = [
    { label: "Hari", value: now.days },
    { label: "Jam", value: now.hours },
    { label: "Menit", value: now.minutes },
    { label: "Detik", value: now.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-lg border border-border bg-background/40 px-2 py-3 text-center"
        >
          <div className="font-display text-2xl tabular-nums sm:text-3xl">
            {String(cell.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
