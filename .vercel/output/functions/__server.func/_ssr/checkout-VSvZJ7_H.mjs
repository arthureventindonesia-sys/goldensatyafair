import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as formatIdr, o as isValidEmail, s as isValidWhatsapp } from "./format-Cm5WkSbp.mjs";
import { r as TICKET_COPY, t as EVENT } from "./event-BBlN7ENr.mjs";
import { confirmDemoPayment, confirmMidtransPayment, createOrder, getCheckoutState } from "./server-jrCKn4KW.mjs";
import { c as Plus, f as CreditCard, i as Smartphone, l as Minus, m as Building2, o as QrCode, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$6, c as useCurrentUserState, o as Button, s as cn } from "./router-BqsiFgbR.mjs";
import { n as Skeleton, t as QrCode$1 } from "./skeleton-Dq9plklq.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-VSvZJ7_H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-sm font-medium text-foreground", className),
		...props
	});
}
var Dialog = Dialog$1;
function DialogPortal(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal$1, { ...props });
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-card p-6 shadow-soft outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-4 top-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Tutup"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
var METHODS = [
	{
		id: "qris",
		label: "QRIS",
		hint: "Scan dari aplikasi bank atau e-wallet",
		icon: QrCode
	},
	{
		id: "gopay",
		label: "GoPay",
		hint: "Bayar lewat aplikasi GoPay",
		icon: Smartphone
	},
	{
		id: "va",
		label: "Virtual Account",
		hint: "Transfer BCA, Mandiri, BNI, BRI",
		icon: Building2
	},
	{
		id: "card",
		label: "Kartu",
		hint: "Kredit atau debit Visa / Mastercard",
		icon: CreditCard
	}
];
function PaymentDialog({ open, onOpenChange, session, onConfirm, busy }) {
	const [method, setMethod] = (0, import_react.useState)("qris");
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Pembayaran" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					session.quantity,
					" tiket ",
					session.ticketName,
					" · ",
					formatIdr(session.grossAmount)
				] })] }),
				session.isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground",
					children: "Mode sandbox Midtrans. Tidak ada dana yang terpotong. Pilih metode, lalu konfirmasi untuk menerbitkan e-ticket."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: METHODS.map((item) => {
						const Icon = item.icon;
						const active = method === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMethod(item.id),
							className: cn("flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors duration-150", active ? "border-foreground bg-secondary" : "border-border hover:bg-secondary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: item.hint
							})] })]
						}, item.id);
					})
				}),
				method === "qris" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode$1, {
						value: `GSF-SANDBOX-${session.orderId}`,
						className: "size-36"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs tracking-wider text-muted-foreground",
						children: session.orderId
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					className: "w-full",
					disabled: busy,
					onClick: () => onConfirm(method),
					children: busy ? "Memproses…" : "Konfirmasi pembayaran"
				})
			]
		})
	});
}
function QtyStepper({ value, min = 1, max, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon",
				"aria-label": "Kurangi",
				disabled: value <= min,
				onClick: () => onChange(Math.max(min, value - 1)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 text-center font-medium tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "icon",
				"aria-label": "Tambah",
				disabled: value >= max,
				onClick: () => onChange(Math.min(max, value + 1)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
			})
		]
	});
}
function CheckoutPage() {
	const { type } = Route$6.useSearch();
	const navigate = Route$6.useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [ticketType, setTicketType] = (0, import_react.useState)(type);
	const [qty, setQty] = (0, import_react.useState)(1);
	const [email, setEmail] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [agree, setAgree] = (0, import_react.useState)(false);
	const [catalog, setCatalog] = (0, import_react.useState)(null);
	const [held, setHeld] = (0, import_react.useState)({
		vip: 0,
		festival: 0
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(null);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTicketType(type);
	}, [type]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		setEmail((prev) => prev || user.primaryEmail || "");
		getCheckoutState().then((data) => {
			setCatalog(data.tickets);
			setHeld(data.held);
		}).catch((e) => {
			toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
		}).finally(() => setLoading(false));
	}, [user]);
	const stock = catalog?.find((t) => t.id === ticketType);
	const already = held[ticketType] ?? 0;
	const maxQty = Math.max(0, Math.min(5 - already, stock?.remaining ?? 5));
	(0, import_react.useEffect)(() => {
		if (maxQty > 0 && qty > maxQty) setQty(maxQty);
	}, [maxQty, qty]);
	const total = (0, import_react.useMemo)(() => stock ? stock.priceIdr * qty : 0, [stock, qty]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-5 py-12 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-80 w-full" })]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: `/checkout?type=${ticketType}` }
	});
	async function pay() {
		if (!agree) {
			toast.error("Setujui syarat pembelian terlebih dahulu.");
			return;
		}
		if (!isValidEmail(email)) {
			toast.error("Email tidak valid.");
			return;
		}
		if (!isValidWhatsapp(whatsapp)) {
			toast.error("Nomor WhatsApp Indonesia tidak valid.");
			return;
		}
		if (maxQty <= 0) {
			toast.error("Batas tiket untuk jenis ini sudah terpenuhi.");
			return;
		}
		setSubmitting(true);
		try {
			const next = await createOrder({ data: {
				ticketTypeId: ticketType,
				quantity: qty,
				email,
				whatsapp
			} });
			setSession(next);
			if (next.isDemo || !next.snapToken) {
				setPayOpen(true);
				return;
			}
			await openSnap(next);
		} catch (e) {
			const message = e instanceof Error ? e.message : "Gagal membuat pesanan.";
			if (message === "Unauthorized") {
				toast.error("Sesi berakhir. Masuk kembali.");
				return;
			}
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	}
	async function openSnap(next) {
		if (!next.snapToken) return;
		await loadSnap(next.snapScriptUrl, next.clientKey);
		window.snap?.pay(next.snapToken, {
			onSuccess: () => {
				confirmMidtransPayment({ data: { orderId: next.orderId } }).then(() => navigate({
					to: "/order/$orderId",
					params: { orderId: next.orderId }
				})).catch((e) => toast.error(e instanceof Error ? e.message : "Pembayaran belum terverifikasi."));
			},
			onPending: () => {
				navigate({
					to: "/order/$orderId",
					params: { orderId: next.orderId }
				});
			},
			onError: () => toast.error("Pembayaran gagal.")
		});
	}
	async function confirmSandbox(method) {
		if (!session) return;
		setSubmitting(true);
		try {
			await confirmDemoPayment({ data: {
				orderId: session.orderId,
				paymentType: method
			} });
			setPayOpen(false);
			await navigate({
				to: "/order/$orderId",
				params: { orderId: session.orderId }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal konfirmasi.");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid w-full max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
					children: "Checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl italic tracking-tight",
					children: "Beli tiket"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						EVENT.name,
						" · ",
						EVENT.venue
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: Object.keys(TICKET_COPY).map((id) => {
						const copy = TICKET_COPY[id];
						const item = catalog?.find((t) => t.id === id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setTicketType(id);
								navigate({ search: { type: id } });
							},
							className: cn("rounded-lg border p-4 text-left transition-colors duration-150", ticketType === id ? "border-foreground bg-secondary" : "border-border hover:bg-secondary"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: copy.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: item ? formatIdr(item.priceIdr) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										"Dimiliki ",
										held[id],
										"/",
										item?.perUserLimit ?? 5
									]
								})
							]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Jumlah" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyStepper, {
									value: qty,
									min: 1,
									max: Math.max(1, maxQty),
									onChange: setQty
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: maxQty <= 0 ? "Kamu sudah mencapai batas untuk jenis ini." : `Maksimal ${maxQty} untuk pesanan ini.`
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email e-ticket"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "nama@email.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "wa",
									children: "Nomor WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "wa",
									type: "tel",
									inputMode: "tel",
									autoComplete: "tel",
									value: whatsapp,
									onChange: (e) => setWhatsapp(e.target.value),
									placeholder: "0812 3456 7890"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Format Indonesia, diawali 08 atau +62."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-4 accent-foreground",
								checked: agree,
								onChange: (e) => setAgree(e.target.checked)
							}), "Saya memahami tiket lunas tidak dapat di-refund, dan data di atas dipakai untuk e-ticket serta pengingat masuk."]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Ringkasan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-hidden rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: TICKET_COPY[ticketType].image,
							alt: "",
							className: "aspect-video w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							qty,
							" × ",
							TICKET_COPY[ticketType].name
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: stock ? formatIdr(stock.priceIdr * qty) : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl tabular-nums",
							children: formatIdr(total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "mt-6 w-full",
						disabled: submitting || loading || maxQty <= 0,
						onClick: () => void pay(),
						children: submitting ? "Menyiapkan pembayaran…" : "Bayar dengan Midtrans"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-xs text-muted-foreground",
						children: "QRIS, GoPay, virtual account, dan kartu."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-muted-foreground underline-offset-4 hover:underline",
							children: "Kembali"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				open: payOpen,
				onOpenChange: setPayOpen,
				session,
				onConfirm: (m) => void confirmSandbox(m),
				busy: submitting
			})
		]
	});
}
function loadSnap(scriptUrl, clientKey) {
	return new Promise((resolve, reject) => {
		if (window.snap) {
			resolve();
			return;
		}
		const existing = document.querySelector(`script[src="${scriptUrl}"]`);
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () => reject(/* @__PURE__ */ new Error("Gagal memuat Midtrans Snap.")));
			return;
		}
		const script = document.createElement("script");
		script.src = scriptUrl;
		if (clientKey) script.setAttribute("data-client-key", clientKey);
		script.onload = () => resolve();
		script.onerror = () => reject(/* @__PURE__ */ new Error("Gagal memuat Midtrans Snap."));
		document.body.appendChild(script);
	});
}
//#endregion
export { CheckoutPage as component };
