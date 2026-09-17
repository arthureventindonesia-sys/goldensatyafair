import { o as __toESM } from "../_runtime.mjs";
import { i as formatIdr } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-C44ntQMH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useStaff, n as RoleOnly } from "./admin-staff-euhgdqBh.mjs";
import { adminConfirmOrder, getAdminProof } from "./server-N4SKNTPJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pembayaran-CWd8aoX3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPembayaranPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOnly, {
		roles: ["admin", "crew"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPembayaran, {})
	});
}
function AdminPembayaran() {
	const { token, dash, reload, checking } = useStaff();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [proof, setProof] = (0, import_react.useState)(null);
	if (checking || !dash) return null;
	async function viewProof(orderId) {
		try {
			const data = await getAdminProof({ data: {
				orderId,
				token
			} });
			setProof({
				orderId,
				fileName: data.fileName,
				src: `data:${data.mime};base64,${data.data}`
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Bukti tidak ditemukan.");
		}
	}
	async function confirm(orderId) {
		setBusy(true);
		try {
			await adminConfirmOrder({ data: {
				orderId,
				token
			} });
			toast.success("Pembayaran dikonfirmasi. Tiket sudah terbit.");
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal konfirmasi.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl italic",
			children: "Konfirmasi pembayaran"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Tinjau bukti transfer. Setelah dikonfirmasi, tiket terbit dan nominal masuk ke uang diterima."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4",
			children: dash.orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Belum ada bukti masuk."
			}) : dash.orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted-foreground",
							children: order.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: order.ticketName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								order.holderName,
								" · ",
								order.whatsapp
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl tabular-nums",
							children: formatIdr(order.payableAmount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs uppercase tracking-wider text-muted-foreground",
							children: order.status === "paid" ? "Terkonfirmasi" : "Menunggu konfirmasi"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [order.hasProof ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => void viewProof(order.id),
							children: "Lihat bukti"
						}) : null, order.status === "submitted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							disabled: busy,
							onClick: () => void confirm(order.id),
							children: "Konfirmasi"
						}) : null]
					})]
				}), proof?.orderId === order.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: proof.src,
					alt: proof.fileName,
					className: "mt-4 max-h-96 w-full rounded-lg border border-border bg-muted object-contain"
				}) : null]
			}, order.id))
		})
	] });
}
//#endregion
export { AdminPembayaranPage as component };
