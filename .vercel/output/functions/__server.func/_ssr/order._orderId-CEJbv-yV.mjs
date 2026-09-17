import { o as __toESM } from "../_runtime.mjs";
import { a as formatUniqueCode, i as formatIdr } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-C44ntQMH.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PAYMENT_REVIEW_NOTICE } from "./event-IC9aXe9Q.mjs";
import { getOrder } from "./server-N4SKNTPJ.mjs";
import { i as Route$4 } from "./router-er0R-en-.mjs";
import { t as CopyNominalButton } from "./copy-nominal-BNpWsxsL.mjs";
import { t as Skeleton } from "./skeleton-BRxXReRu.mjs";
import { t as ETicket } from "./e-ticket-XRJjPDFk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._orderId-CEJbv-yV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { orderId } = Route$4.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let timer;
		const load = () => getOrder({ data: { orderId } }).then((data) => {
			if (cancelled) return;
			setOrder(data.order);
			setTickets(data.tickets);
			if (data.order.status === "paid" && timer !== void 0) {
				window.clearInterval(timer);
				timer = void 0;
			}
		}).catch((e) => {
			if (cancelled) return;
			setMissing(true);
			toast.error(e instanceof Error ? e.message : "Pesanan tidak ditemukan.");
		});
		load();
		timer = window.setInterval(() => {
			load();
		}, 4e3);
		return () => {
			cancelled = true;
			if (timer !== void 0) window.clearInterval(timer);
		};
	}, [orderId]);
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl italic",
			children: "Pesanan tidak ditemukan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tiket",
				children: "Tiket saya"
			})
		})]
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })
	});
	const paid = order.status === "paid";
	const submitted = order.status === "submitted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: ["Pesanan ", order.id]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: paid ? "Tiket sudah terbit" : submitted ? "Menunggu konfirmasi admin" : "Menunggu pembayaran"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					order.ticketName,
					" · tiket ",
					formatIdr(order.grossAmount),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Kode unik ",
					formatUniqueCode(order.uniqueCode),
					" · bayar",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: formatIdr(order.payableAmount)
					})
				]
			}),
			!paid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-xl border border-border bg-card p-6",
				children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: PAYMENT_REVIEW_NOTICE
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tiket",
							children: "Tiket saya"
						})
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Scan QRIS statis, masukkan nominal ",
						formatIdr(order.payableAmount),
						" (tiket + 3 digit terakhir HP), lalu unggah bukti transfer."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyNominalButton, { amount: order.payableAmount }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/order/$orderId/konfirmasi",
								params: { orderId: order.id },
								children: "Konfirmasi Pembayaran"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tiket",
								children: "Tiket saya"
							})
						})
					]
				})] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6",
				children: [tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicket, { ticket }, ticket.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-print flex flex-wrap gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tiket",
							children: "Semua tiket"
						})
					})
				})]
			})
		]
	});
}
//#endregion
export { OrderPage as component };
