import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatEventTime, n as displayWhatsapp, r as formatEventDate } from "./format-Cm5WkSbp.mjs";
import { r as TICKET_COPY, t as EVENT } from "./event-BBlN7ENr.mjs";
import { t as QrCode } from "./skeleton-Dq9plklq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/e-ticket-C_liII2Y.js
var import_jsx_runtime = require_jsx_runtime();
function ETicket({ ticket }) {
	const copy = TICKET_COPY[ticket.ticketTypeId];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "print-ticket overflow-hidden rounded-xl border border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6 p-6 sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
						children: [
							EVENT.brand,
							" · ",
							EVENT.year
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl italic tracking-tight",
						children: EVENT.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider",
						children: copy.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 text-sm sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Waktu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1",
							children: formatEventDate(EVENT.startsAt)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Pintu buka"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "mt-1",
							children: [formatEventTime(EVENT.doorsAt), " WIB"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Venue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1",
								children: [
									EVENT.venue,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									EVENT.city
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 break-all",
							children: ticket.holderEmail
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "WhatsApp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1",
							children: displayWhatsapp(ticket.holderWhatsapp)
						})] })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-3 border-t border-border bg-muted p-6 md:border-l md:border-t-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
					value: ticket.code,
					label: `QR tiket ${ticket.code}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-wider text-muted-foreground",
					children: ticket.code
				})]
			})]
		})
	});
}
//#endregion
export { ETicket as t };
