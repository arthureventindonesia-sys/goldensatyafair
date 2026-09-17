import { o as __toESM } from "../_runtime.mjs";
import { i as formatIdr, l as isValidWhatsapp, s as isValidEmail } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-C44ntQMH.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { getMyTickets } from "./server-N4SKNTPJ.mjs";
import { t as Input } from "./input-BZzC0GLh.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
import { t as readGuestCheckout } from "./guest-DryPtgI7.mjs";
import { t as ETicket } from "./e-ticket-XRJjPDFk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiket-DIJ1iM48.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MyTicketsPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tickets, setTickets] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)([]);
	const [lookedUp, setLookedUp] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = readGuestCheckout();
		if (!saved) return;
		if (saved.email) setEmail(saved.email);
		if (saved.whatsapp) setWhatsapp(saved.whatsapp);
		if (!isValidEmail(saved.email) || !isValidWhatsapp(saved.whatsapp)) return;
		setBusy(true);
		getMyTickets({ data: {
			email: saved.email,
			whatsapp: saved.whatsapp
		} }).then((data) => {
			setTickets(data.tickets);
			setPending(data.pending);
			setLookedUp(true);
		}).catch(() => {}).finally(() => setBusy(false));
	}, []);
	async function lookup() {
		if (!isValidEmail(email)) {
			toast.error("Email tidak valid.");
			return;
		}
		if (!isValidWhatsapp(whatsapp)) {
			toast.error("Nomor WhatsApp Indonesia tidak valid.");
			return;
		}
		setBusy(true);
		try {
			const data = await getMyTickets({ data: {
				email,
				whatsapp
			} });
			setTickets(data.tickets);
			setPending(data.pending);
			setLookedUp(true);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
			setTickets([]);
			setPending([]);
			setLookedUp(true);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Tiket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: "Tiket saya"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Cek tiket dengan email dan WhatsApp yang dipakai saat checkout. Tidak perlu membuat akun."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					lookup();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wa",
							children: "Nomor WhatsApp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "wa",
							type: "tel",
							required: true,
							value: whatsapp,
							onChange: (e) => setWhatsapp(e.target.value),
							placeholder: "08xxxxxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Mencari…" : "Lihat tiket"
						})
					})
				]
			}),
			pending.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Menunggu pembayaran / konfirmasi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3",
					children: pending.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							order.ticketName,
							" · ",
							formatIdr(order.payableAmount),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted-foreground",
								children: order.status === "submitted" ? "Menunggu konfirmasi admin" : "Belum unggah bukti"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: order.status === "submitted" ? "/order/$orderId" : "/order/$orderId/konfirmasi",
								params: { orderId: order.id },
								children: order.status === "submitted" ? "Lihat" : "Konfirmasi"
							})
						})]
					}, order.id))
				})]
			}) : null,
			tickets === null ? null : tickets.length === 0 && lookedUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: "Belum ada tiket lunas untuk data ini."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-6",
				children: tickets?.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicket, { ticket }, ticket.id))
			})
		]
	});
}
//#endregion
export { MyTicketsPage as component };
