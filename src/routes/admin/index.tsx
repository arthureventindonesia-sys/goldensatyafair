import { createFileRoute, Link } from "@tanstack/react-router";
import { AgentLinkCard } from "@/components/agent-link-card";
import { formatIdr } from "@/lib/format";
import { useStaff } from "@/components/admin-staff";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const { dash, checking } = useStaff();
  if (checking || !dash) return null;
  const isAdmin = dash.role === "admin";
  const isCrew = dash.role === "crew";
  const isAgent = dash.role === "agent";

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="font-display text-2xl italic">Ringkasan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAgent
            ? "Transaksi dari pembeli yang mengisi kode referal Anda saat daftar."
            : "Tiket terjual dan status pembayaran."}
        </p>
        {isAgent ? (
          <div className="mt-5">
            <AgentLinkCard code={dash.referralCode || dash.username} />
          </div>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label={isAgent ? "Tiket dari referal" : "Tiket terjual"} value={String(dash.ticketsSold)} />
          {dash.types.map((t) => (
            <Stat key={t.id} label={`${t.name} terjual`} value={String(t.sold)} />
          ))}
          {isAdmin ? (
            <Stat label="Uang masuk (terkonfirmasi)" value={formatIdr(dash.revenue)} wide />
          ) : null}
          {isAgent ? <Stat label="Nominal referal terkonfirmasi" value={formatIdr(dash.revenue)} wide /> : null}
          {!isAgent ? <Stat label="Menunggu konfirmasi" value={String(dash.submittedCount)} /> : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {isAdmin || isCrew ? (
          <PageCard
            to="/admin/pembayaran"
            title="Pembayaran"
            body={`${dash.submittedCount} pesanan menunggu konfirmasi.`}
          />
        ) : null}
        {isAdmin || isCrew ? (
          <PageCard
            to="/admin/transaksi"
            title="Transaksi"
            body={`${dash.orders.length} data transaksi.`}
          />
        ) : null}
        {isAdmin || isAgent ? (
          <PageCard
            to="/admin/agent"
            title="Agent"
            body={
              isAgent
                ? `${dash.orders.length} pembeli dari referal Anda.`
                : "Data pembeli yang memakai kode referal agent."
            }
          />
        ) : null}
        {isAdmin ? (
          <>
            <PageCard to="/admin/tiket" title="Tiket" body="Tahap penjualan, jadwal, harga, dan kuota." />
            <PageCard
              to="/admin/pengguna"
              title="Pengguna"
              body={`${dash.users.length} staf · ${dash.buyers?.length ?? 0} pembeli.`}
            />
          </>
        ) : null}
      </section>
    </div>
  );
}

function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${wide ? "sm:col-span-3" : ""}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl italic tabular-nums">{value}</p>
    </div>
  );
}

function PageCard({
  to,
  title,
  body,
}: {
  to: "/admin/pembayaran" | "/admin/tiket" | "/admin/pengguna" | "/admin/transaksi" | "/admin/agent";
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground"
    >
      <p className="font-display text-xl italic">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}
