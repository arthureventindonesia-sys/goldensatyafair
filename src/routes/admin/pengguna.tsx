import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AgentLinkCard } from "@/components/agent-link-card";
import { AdminOnly, useStaff } from "@/components/admin-staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaffAccount, deleteStaffAccount } from "@/lib/tickets/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/pengguna")({ component: AdminPenggunaPage });

function AdminPenggunaPage() {
  return (
    <AdminOnly>
      <AdminPengguna />
    </AdminOnly>
  );
}

function AdminPengguna() {
  const { token, dash, reload } = useStaff();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "crew" | "agent">("crew");
  const [busy, setBusy] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<string | null>(null);
  const [openQr, setOpenQr] = useState<string | null>(null);
  if (!dash) return null;
  const currentUser = dash.username;

  async function addUser() {
    setBusy(true);
    try {
      const created = await createStaffAccount({ data: { token, username, password, role } });
      toast.success(`Akun ${created.username} (${created.role}) dibuat.`);
      if (created.role === "agent") setCreatedAgent(created.username);
      else setCreatedAgent(null);
      setUsername("");
      setPassword("");
      setRole("crew");
      await reload();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal membuat akun.");
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(name: string) {
    if (name === currentUser) {
      toast.error("Tidak bisa menghapus akun yang sedang dipakai.");
      return;
    }
    if (name === "iang") {
      toast.error("Akun admin utama tidak bisa dihapus.");
      return;
    }
    setBusy(true);
    try {
      await deleteStaffAccount({ data: { token, username: name } });
      toast.success(`Akun ${name} dihapus.`);
      await reload();
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : "";
      let message = "Gagal menghapus akun.";
      try {
        const parsed = JSON.parse(raw) as { message?: string };
        if (parsed?.message) message = parsed.message;
        else if (raw && !raw.startsWith("{")) message = raw;
      } catch {
        if (raw) message = raw;
      }
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl italic">Buat akun staf</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Akun yang dibuat admin: crew, agent, atau admin. Pembeli tidak perlu membuat akun.
        </p>
        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void addUser();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="new-user">Username</Label>
              <Input
                id="new-user"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nama_akun"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pass">Password</Label>
              <Input
                id="new-pass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="minimal 6 karakter"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-role">Peran</Label>
              <select
                id="new-role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value === "admin" ? "admin" : e.target.value === "agent" ? "agent" : "crew")
                }
                className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="crew">Crew</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-fit" disabled={busy || !username || !password}>
            {busy ? "Menyimpan…" : "Buat akun"}
          </Button>
        </form>
      </section>

      {createdAgent ? (
        <section>
          <h2 className="font-display text-2xl italic">QR agent {createdAgent}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan QR ini membuka checkout dengan kode referal terisi otomatis.
          </p>
          <div className="mt-4">
            <AgentLinkCard code={createdAgent} title={`QR checkout ${createdAgent}`} />
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-2xl italic">Akun staf</h2>
        <p className="mt-1 text-sm text-muted-foreground">Dibuat oleh admin.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {dash.users.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">Belum ada pengguna.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Peran</th>
                  <th className="px-4 py-3 font-medium">Kode referal</th>
                  <th className="px-4 py-3 font-medium">QR</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dash.users.map((user) => (
                  <tr key={user.username} className="border-t border-border">
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs uppercase tracking-wider",
                          user.role === "admin" ? "bg-secondary text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {user.role === "agent" ? user.referralCode || user.username : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "agent" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setOpenQr((prev) =>
                              prev === (user.referralCode || user.username) ? null : user.referralCode || user.username,
                            )
                          }
                        >
                          QR
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.username === "iang" || user.username === currentUser ? (
                        <span className="text-xs text-muted-foreground">Tetap</span>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => void removeUser(user.username)}
                        >
                          Hapus
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {openQr ? (
          <div className="mt-4">
            <AgentLinkCard code={openQr} title={`QR checkout ${openQr}`} />
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="font-display text-2xl italic">Pembeli</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Data dari checkout (tanpa akun). Kode referal diisi saat beli tiket.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {(dash.buyers ?? []).length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">Belum ada pembeli.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">Referal</th>
                    <th className="px-4 py-3 font-medium">Checkout</th>
                  </tr>
                </thead>
                <tbody>
                  {(dash.buyers ?? []).map((buyer) => (
                    <tr key={buyer.id} className="border-t border-border">
                      <td className="px-4 py-3">{buyer.email}</td>
                      <td className="px-4 py-3 tabular-nums">{buyer.whatsapp || "—"}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{buyer.referralCode || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(buyer.createdAt).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
