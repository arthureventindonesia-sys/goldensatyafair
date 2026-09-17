import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { QrCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import { agentSignupPath, agentSignupUrl, normalizeReferral } from "@/lib/referral";

export function AgentLinkCard({
  code,
  title = "QR pendaftaran agent",
}: {
  code: string;
  title?: string;
}) {
  const ref = useMemo(() => normalizeReferral(code), [code]);
  const url = useMemo(() => agentSignupUrl(code), [code]);
  const qrValue = url.startsWith("http") ? url : agentSignupPath(code);
  const [copied, setCopied] = useState(false);

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="mx-auto w-40 rounded-lg bg-white p-2 sm:mx-0">
        <QrCode value={qrValue} tone="print" label={`QR daftar agent ${code}`} className="h-full w-full" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
        <p className="mt-2 font-mono text-lg">{code}</p>
        <p className="mt-2 break-all text-sm text-muted-foreground">{url}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Scan QR atau buka tautan untuk daftar akun. Kode referal terisi otomatis dan terkunci.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/login" search={{ redirect: "/checkout", ref }}>
              Buka form daftar
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                /* ignore */
              }
              setCopied(true);
              toast.success("Link agent disalin.");
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Tersalin" : "Salin link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
