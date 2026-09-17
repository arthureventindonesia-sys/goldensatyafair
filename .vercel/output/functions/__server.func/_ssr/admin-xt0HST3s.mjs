import { i as formatIdr } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AgentLinkCard } from "./agent-link-card-CP3z2Asp.mjs";
import { i as useStaff } from "./admin-staff-euhgdqBh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-xt0HST3s.js
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const { dash, checking } = useStaff();
	if (checking || !dash) return null;
	const isAdmin = dash.role === "admin";
	const isCrew = dash.role === "crew";
	const isAgent = dash.role === "agent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl italic",
				children: "Ringkasan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: isAgent ? "Transaksi dari pembeli yang mengisi kode referal Anda saat checkout." : "Tiket terjual dan status pembayaran."
			}),
			isAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentLinkCard, { code: dash.referralCode || dash.username })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: isAgent ? "Tiket dari referal" : "Tiket terjual",
						value: String(dash.ticketsSold)
					}),
					dash.types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: `${t.name} terjual`,
						value: String(t.sold)
					}, t.id)),
					isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Uang masuk (terkonfirmasi)",
						value: formatIdr(dash.revenue),
						wide: true
					}) : null,
					isAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Nominal referal terkonfirmasi",
						value: formatIdr(dash.revenue),
						wide: true
					}) : null,
					!isAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Menunggu konfirmasi",
						value: String(dash.submittedCount)
					}) : null
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				isAdmin || isCrew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCard, {
					to: "/admin/pembayaran",
					title: "Pembayaran",
					body: `${dash.submittedCount} pesanan menunggu konfirmasi.`
				}) : null,
				isAdmin || isCrew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCard, {
					to: "/admin/transaksi",
					title: "Transaksi",
					body: `${dash.orders.length} data transaksi.`
				}) : null,
				isAdmin || isAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCard, {
					to: "/admin/agent",
					title: "Agent",
					body: isAgent ? `${dash.orders.length} pembeli dari referal Anda.` : "Data pembeli yang memakai kode referal agent."
				}) : null,
				isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCard, {
					to: "/admin/tiket",
					title: "Tiket",
					body: "Tahap penjualan, jadwal, harga, dan kuota."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCard, {
					to: "/admin/pengguna",
					title: "Pengguna",
					body: `${dash.users.length} staf · ${dash.buyers?.length ?? 0} pembeli.`
				})] }) : null
			]
		})]
	});
}
function Stat({ label, value, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border border-border bg-card p-5 ${wide ? "sm:col-span-3" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-3xl italic tabular-nums",
			children: value
		})]
	});
}
function PageCard({ to, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl italic",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { AdminHome as component };
