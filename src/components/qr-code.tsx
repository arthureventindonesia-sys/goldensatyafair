import { encode } from "uqr";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function QrCode({
  value,
  className,
  label,
  tone = "invert",
}: {
  value: string;
  className?: string;
  label?: string;
  tone?: "invert" | "print";
}) {
  const qr = useMemo(() => encode(value, { border: 2, ecc: "M" }), [value]);
  const path = qr.data
    .flatMap((row, y) => row.map((on, x) => (on ? `M${x} ${y}h1v1h-1z` : "")))
    .join("");
  const print = tone === "print";

  return (
    <svg
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      className={cn(print ? "bg-white" : "bg-foreground text-background", className)}
      role="img"
      aria-label={label ?? `Kode QR ${value}`}
    >
      <rect width={qr.size} height={qr.size} className={print ? "fill-white" : "fill-foreground"} />
      <path d={path} className={print ? "fill-black" : "fill-background"} />
    </svg>
  );
}
