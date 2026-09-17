import { createFileRoute } from "@tanstack/react-router";
import { RoleOnly, useStaff } from "@/components/admin-staff";
import { formatIdr } from "@/lib/format";

export const Route = createFileRoute("/admin/transaksi")({ component: AdminTransaksiPage });

function AdminTransaksiPage() {
  return (
    <RoleOnly roles={["admin", "crew"]}>
      <AdminTransaksi />
    </RoleOnly>
  );
}

function AdminTransaksi() {
  const { dash } = useStaff();
  if (!dash) return null;

  return (
    <section>
      <h2 className="font-display text-2xl italic">Data transaksi</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Semua pesanan yang sudah mengunggah bukti atau sudah dikonfirmasi.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        {dash.orders.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Belum ada transaksi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Tiket</th>
                  <th className="px-4 py-3 font-medium">Nominal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  {dash.role === "admin" ? <th className="px-4 py-3 font-medium">Referal</th> : null}
                </tr>
              </thead>
              <tbody>
                {dash.orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-4 py-3">{order.holderName}</td>
                    <td className="px-4 py-3 tabular-nums">{order.whatsapp}</td>
                    <td className="px-4 py-3">{order.ticketName}</td>
                    <td className="px-4 py-3 tabular-nums">{formatIdr(order.payableAmount)}</td>
                    <td className="px-4 py-3">
                      {order.status === "paid" ? "Terkonfirmasi" : "Menunggu"}
                    </td>
                    {dash.role === "admin" ? (
                      <td className="px-4 py-3 text-muted-foreground">{order.referralCode || "—"}</td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
