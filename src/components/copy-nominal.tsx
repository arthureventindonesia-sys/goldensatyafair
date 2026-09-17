import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function copyNominal(amount: number) {
  const value = String(amount);
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const el = document.createElement("textarea");
    el.value = value;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}

export function CopyNominalButton({
  amount,
  className,
  variant = "outline",
  label = "Salin nominal",
}: {
  amount: number;
  className?: string;
  variant?: "outline" | "ghost";
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={amount <= 0}
      onClick={() => {
        void copyNominal(amount)
          .then(() => {
            setCopied(true);
            toast.success(`Nominal ${formatIdr(amount)} disalin`);
            window.setTimeout(() => setCopied(false), 1600);
          })
          .catch(() => toast.error("Gagal menyalin nominal."));
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Tersalin" : label}
    </Button>
  );
}

export function CopyNominalIcon({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        className,
      )}
      disabled={amount <= 0}
      aria-label="Salin nominal"
      onClick={() => {
        void copyNominal(amount)
          .then(() => {
            setCopied(true);
            toast.success(`Nominal ${formatIdr(amount)} disalin`);
            window.setTimeout(() => setCopied(false), 1600);
          })
          .catch(() => toast.error("Gagal menyalin nominal."));
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}
