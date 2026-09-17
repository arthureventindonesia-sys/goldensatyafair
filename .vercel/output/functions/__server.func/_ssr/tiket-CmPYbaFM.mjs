import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatIdr } from "./format-Cm5WkSbp.mjs";
import { getMyTickets } from "./server-jrCKn4KW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useCurrentUserState, o as Button } from "./router-BqsiFgbR.mjs";
import { n as Skeleton } from "./skeleton-Dq9plklq.mjs";
import { t as ETicket } from "./e-ticket-C_liII2Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiket-CmPYbaFM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyTicketsPage() {
	const { user, isPending } = useCurrentUserState();
	const [tickets, setTickets] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyTickets().then((data) => {
			setTickets(data.tickets);
			setPending(data.pending);
		}).catch((e) => {
			toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
			setTickets([]);
		});
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-56 w-full" })]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: "/tiket" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Akun"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: "Tiket saya"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "E-ticket lunas. Tunjukkan QR di pintu masuk."
			}),
			pending.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Menunggu pembayaran"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3",
					children: pending.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							order.quantity,
							" × ",
							order.ticketName,
							" · ",
							formatIdr(order.grossAmount)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/order/$orderId",
								params: { orderId: order.id },
								children: "Lanjutkan"
							})
						})]
					}, order.id))
				})]
			}) : null,
			tickets === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-56 w-full" }) : tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 rounded-xl border border-border px-6 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl italic",
						children: "Belum ada tiket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "VIP dan Festival masih tersedia di halaman utama."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#tiket",
							children: "Lihat tiket"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6",
				children: tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicket, { ticket }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 no-print",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tiket/$code",
								params: { code: ticket.code },
								children: "Detail"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://wa.me/${ticket.holderWhatsapp}?text=${encodeURIComponent(`E-ticket Golden Satya Fair\n${ticket.code}\n${ticket.ticketName}`)}`,
								target: "_blank",
								rel: "noreferrer",
								children: "Kirim ke WhatsApp"
							})
						})]
					})]
				}, ticket.id))
			})
		]
	});
}
//#endregion
export { MyTicketsPage as component };
