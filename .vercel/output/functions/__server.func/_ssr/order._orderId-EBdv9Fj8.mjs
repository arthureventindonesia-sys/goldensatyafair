import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatIdr } from "./format-Cm5WkSbp.mjs";
import { getOrder } from "./server-jrCKn4KW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useCurrentUserState, o as Button, r as Route$3 } from "./router-BqsiFgbR.mjs";
import { n as Skeleton } from "./skeleton-Dq9plklq.mjs";
import { t as ETicket } from "./e-ticket-C_liII2Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._orderId-EBdv9Fj8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { orderId } = Route$3.useParams();
	const { user, isPending } = useCurrentUserState();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getOrder({ data: { orderId } }).then((data) => {
			setOrder(data.order);
			setTickets(data.tickets);
		}).catch((e) => {
			setMissing(true);
			toast.error(e instanceof Error ? e.message : "Pesanan tidak ditemukan.");
		});
	}, [user, orderId]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: `/order/${orderId}` }
	});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: ["Pesanan ", order.id]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: paid ? "Tiket sudah terbit" : "Menunggu pembayaran"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					order.quantity,
					" × ",
					order.ticketName,
					" · ",
					formatIdr(order.grossAmount)
				]
			}),
			!paid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Selesaikan pembayaran Midtrans. Jika sudah transfer, e-ticket akan muncul di halaman ini setelah Midtrans mengonfirmasi."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							search: { type: order.ticketTypeId },
							children: "Coba bayar lagi"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tiket",
							children: "Tiket saya"
						})
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6",
				children: [tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicket, { ticket }, ticket.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-print flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tiket",
							children: "Semua tiket"
						})
					}), tickets[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://wa.me/${tickets[0].holderWhatsapp}?text=${encodeURIComponent(`E-ticket Golden Satya Fair\n${tickets.map((t) => t.code).join("\n")}`)}`,
							target: "_blank",
							rel: "noreferrer",
							children: "Kirim ke WhatsApp"
						})
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { OrderPage as component };
