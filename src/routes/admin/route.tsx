import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StaffProvider } from "@/components/admin-staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminLogin,
  adminLogout,
  getAdminDashboard,
  getAdminSession,
  type AdminDashboard,
} from "@/lib/tickets/server";
import { readStaffToken, writeStaffToken } from "@/lib/staff-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV = [
  { to: "/admin" as const, label: "Dashboard", exact: true, roles: ["admin", "crew", "agent"] },
  { to: "/admin/pembayaran" as const, label: "Pembayaran", exact: false, roles: ["admin", "crew"] },
  { to: "/admin/transaksi" as const, label: "Transaksi", exact: false, roles: ["admin", "crew"] },
  { to: "/admin/agent" as const, label: "Agent", exact: false, roles: ["admin", "agent"] },
  { to: "/admin/tiket" as const, label: "Tiket", exact: false, roles: ["admin"] },
  { to: "/admin/pengguna" as const, label: "Pengguna", exact: false, roles: ["admin"] },
];

function AdminLayout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [dash, setDash] = useState<AdminDashboard | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function reload(nextToken = token) {
    const data = await getAdminDashboard({ data: { token: nextToken } });
    setDash(data);
  }

  useEffect(() => {
    const stored = readStaffToken();
    setToken(stored);
    void getAdminSession({ data: { token: stored } })
      .then(async (s) => {
        if (!s.ok) return;
        await reload(stored);
      })
      .catch(() => undefined)
      .finally(() => setChecking(false));
  }, []);

  async function login() {
    setBusy(true);
    try {
      const result = await adminLogin({ data: { username, password } });
      writeStaffToken(result.token);
      setToken(result.token);
      await reload(result.token);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal masuk.");
      setDash(null);
    } finally {
      setBusy(false);
    }
  }

  const links = NAV.filter((item) => (dash ? item.roles.includes(dash.role) : false));

  return (
    <StaffProvider value={{ token, dash, checking, reload: () => reload() }}>
      <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        {checking ? (
          <p className="text-sm text-muted-foreground">Memeriksa sesi…</p>
        ) : !dash ? (
          <>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Admin</p>
            <h1 className="mt-3 font-display text-4xl italic tracking-tight">Masuk</h1>
            <p className="mt-2 text-sm text-muted-foreground">Masuk dengan akun admin, crew, atau agent.</p>
            <form
              className="mt-8 grid max-w-sm gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void login();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="admin-user">User</Label>
                <Input
                  id="admin-user"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-pass">Password</Label>
                <Input
                  id="admin-pass"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy || !username || !password}>
                {busy ? "Masuk…" : "Masuk"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {dash.role === "admin" ? "Admin" : dash.role === "crew" ? "Crew" : "Agent"}
                </p>
                <h1 className="mt-3 font-display text-4xl italic tracking-tight">Panel</h1>
                <p className="mt-2 text-sm text-muted-foreground">Masuk sebagai {dash.username}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  writeStaffToken("");
                  setToken("");
                  void adminLogout().then(() => setDash(null));
                }}
              >
                Keluar
              </Button>
            </div>

            <nav className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
              {links.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8">
              <Outlet />
            </div>
          </>
        )}
      </main>
    </StaffProvider>
  );
}
