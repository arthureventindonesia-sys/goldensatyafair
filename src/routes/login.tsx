import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { EVENT } from "@/lib/event";
import { isValidEmail, isValidWhatsapp } from "@/lib/format";
import { normalizeReferral } from "@/lib/referral";
import { completeBuyerProfile } from "@/lib/tickets/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect: string; ref?: string } => {
    const redirect =
      typeof s.redirect === "string" &&
      s.redirect.startsWith("/") &&
      !s.redirect.startsWith("//") &&
      !s.redirect.includes("?")
        ? s.redirect
        : "/";
    const ref = normalizeReferral(String(s.ref ?? ""));
    return { redirect, ...(ref ? { ref } : {}) };
  },
  component: Login,
});

function Login() {
  const { redirect, ref } = Route.useSearch();
  const navigate = useNavigate();
  const lockedRef = ref || "";
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState(lockedRef);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!authEnabled) {
      setError("Pendaftaran sedang tidak aktif.");
      return;
    }
    const mail = email.trim().toLowerCase();
    if (!isValidEmail(mail)) {
      setError("Email tidak valid.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (mode === "signup" && !isValidWhatsapp(whatsapp)) {
      setError("Nomor WhatsApp Indonesia tidak valid.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email: mail,
          password,
          name: mail.split("@")[0] || "Pembeli",
        });
        if (res.error) throw new Error(friendlyAuthError(res.error.message));
        try {
          await authClient.getSession();
        } catch {
          /* session recovers on next request */
        }
        await completeBuyerProfile({
          data: { whatsapp, referral: normalizeReferral(lockedRef || referral) },
        });
      } else {
        const res = await authClient.signIn.email({ email: mail, password });
        if (res.error) throw new Error(friendlyAuthError(res.error.message));
      }
      try {
        await authClient.getSession();
      } catch {
        /* session recovers on next load */
      }
      const destPath = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect.split("?")[0] : "/";
      if (destPath === "/checkout" || lockedRef) {
        await navigate({ to: "/checkout" });
      } else {
        await navigate({ to: destPath || "/" });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memproses akun.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100dvh-4rem)]">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover object-center opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-5 py-16">
        <img
          src={EVENT.logos.main.src}
          alt={EVENT.logos.main.alt}
          className="h-14 w-auto object-contain"
        />
        <h1 className="mt-5 font-display text-4xl italic tracking-tight">
          {mode === "signup" ? "Buat akun" : "Masuk"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Daftar dengan email, WhatsApp, dan password. Semua kolom wajib, kecuali kode referal."
            : "Masuk dengan email dan password akunmu."}
        </p>

        <form
          className="mt-8 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {mode === "signup" ? (
            <div className="grid gap-2">
              <Label htmlFor="wa">Nomor WhatsApp</Label>
              <Input
                id="wa"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              placeholder="minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {mode === "signup" ? (
            <div className="grid gap-2">
              <Label htmlFor="referral">Kode referal agent</Label>
              <Input
                id="referral"
                autoComplete="off"
                placeholder="opsional"
                value={referral}
                readOnly={Boolean(lockedRef)}
                disabled={Boolean(lockedRef)}
                onChange={(e) => {
                  if (lockedRef) return;
                  setReferral(e.target.value);
                }}
                className={lockedRef ? "opacity-80" : undefined}
              />
              <p className="text-xs text-muted-foreground">
                {lockedRef
                  ? "Terisi otomatis dari tautan agent dan tidak bisa diubah."
                  : "Isi jika daftar lewat agent. Tidak bisa diubah nanti."}
              </p>
            </div>
          ) : null}
          <Button type="submit" className="h-12 w-full" disabled={busy}>
            {busy ? "Memproses…" : mode === "signup" ? "Daftar" : "Masuk"}
          </Button>
        </form>
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signup" ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            type="button"
            className="underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
            }}
          >
            {mode === "signup" ? "Masuk" : "Daftar"}
          </button>
        </p>
        <p className="mt-8 text-sm text-muted-foreground">
          <Link to="/" className="underline-offset-4 hover:underline">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}

function friendlyAuthError(message?: string) {
  const raw = String(message || "");
  if (/already exists|unique|registered/i.test(raw)) return "Email sudah terdaftar. Silakan masuk.";
  if (/invalid email or password|invalid password|unauthorized/i.test(raw)) {
    return "Email atau password salah.";
  }
  if (/too short|minPassword|at least/i.test(raw)) return "Password terlalu pendek.";
  return raw || "Gagal memproses akun.";
}
