import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

function friendlyMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  try {
    const parsed = JSON.parse(raw) as { error?: boolean; message?: string };
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.message === "string" && parsed.message) return parsed.message;
      if (parsed.error) return "Tidak terduga. Muat ulang halaman, lalu coba lagi.";
    }
  } catch {
    /* not json */
  }
  return raw || "Tidak terduga. Muat ulang halaman.";
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <span className="text-destructive" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl">Terjadi kesalahan</h1>
      <p className="max-w-md text-sm break-words text-muted-foreground">{friendlyMessage(error)}</p>
    </main>
  );
}
