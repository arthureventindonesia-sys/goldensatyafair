import { createFileRoute } from "@tanstack/react-router";
import { AgentLinkCard } from "@/components/agent-link-card";
import { RoleOnly, useStaff } from "@/components/admin-staff";
import { formatIdr } from "@/lib/format";

export const Route = createFileRoute("/admin/agent")({ component: AdminAgentPage });

function AdminAgentPage() {
  return (
    <RoleOnly roles={["admin", "agent"]}>
      <AdminAgent />
    </RoleOnly>
  );
}

function AdminAgent() {
  const { dash } = useStaff();
  if (!dash) return null;
  const isAgent = dash.role === "agent";
  const rows = isAgent ? dash.orders : dash.orders.filter((order) => Boolean(order.referralCode));
  const confirmed = rows.filter((order) => order.status === "paid").length;
  const pending = rows.filter((order) => order.status !== "paid").length;

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="font-display text-2xl italic">Agent</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAgent
            ? `Pembeli yang mengisi kode referal ${dash.referralCode || dash.username} saat daftar.`
            : "Pembeli yang transaksi memakai kode referal agent."}
        </p>
        {isAgent ? (
          <div className="mt-5">
            <AgentLinkCard code={dash.referralCode || dash.username} />
          </div>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Pembeli" value={String(rows.length)} />
          <Stat label="Terkonfirmasi" value={String(confirmed)} />
          <Stat label="Belum terkonfirmasi" value={String(pending)} />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border">
        {rows.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Belum ada pembeli dari agent.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Tiket</th>
                  <th className="px-4 py-3 font-medium">Nominal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  {!isAgent ? <th className="px-4 py-3 font-medium">Agent</th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-4 py-3">{order.holderName || "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{order.whatsapp}</td>
                    <td className="px-4 py-3">{order.email}</td>
                    <td className="px-4 py-3">{order.ticketName}</td>
                    <td className="px-4 py-3 tabular-nums">{formatIdr(order.payableAmount)}</td>
                    <td className="px-4 py-3">
                      {order.status === "paid" ? "Terkonfirmasi" : "Belum terkonfirmasi"}
                    </td>
                    {!isAgent ? (
                      <td className="px-4 py-3 text-muted-foreground">{order.referralCode || "—"}</td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl italic tabular-nums">{value}</p>
    </div>
  );
}
