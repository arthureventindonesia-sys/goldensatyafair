import { o as __toESM } from "../_runtime.mjs";
import { a as formatUniqueCode, c as isValidName, d as uniqueCodeFromPhone, i as formatIdr, l as isValidWhatsapp, o as isValidAddress, s as isValidEmail } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { t as QrCode } from "./qr-code-DVFlQMnQ.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as QRIS, o as TICKET_COPY, s as TICKET_IDS, t as EVENT } from "./event-IC9aXe9Q.mjs";
import { createOrder, getCheckoutState } from "./server-N4SKNTPJ.mjs";
import { o as Plus, s as Minus, t as X, u as Download } from "../_libs/lucide-react.mjs";
import { o as Route$14 } from "./router-er0R-en-.mjs";
import { t as Input } from "./input-BZzC0GLh.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
import { n as readStaffToken, t as isStaffSession } from "./staff-session-BtLHB3gl.mjs";
import { n as CopyNominalIcon } from "./copy-nominal-BNpWsxsL.mjs";
import { n as writeGuestCheckout, t as readGuestCheckout } from "./guest-DryPtgI7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-Gv-Vm6bm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function QrisWordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/images/qris-logo.png",
		alt: "QRIS — QR Code Standar Pembayaran Nasional",
		className
	});
}
function GpnMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 72 44",
		className,
		"aria-label": "GPN",
		role: "img",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#E31C23",
			d: "M38 2c2.4 7.2.2 12.2-6.5 16.2 8.4.2 16.2 4.4 22.5 14.2-4.6-3.2-11-6.4-19.2-7.2 2.2 4.2-1.6 8.4-9.6 10.4 6.2-5.8 8.4-14.2 4.4-22.6 3.2 2.4 7.2 1.6 8.4-11z"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "36",
			y: "42",
			textAnchor: "middle",
			fill: "#E31C23",
			fontSize: "9",
			fontFamily: "Arial, Helvetica, sans-serif",
			fontWeight: "700",
			letterSpacing: "1.6",
			children: "GPN"
		})]
	});
}
function formatRemain(seconds) {
	return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
async function downloadQris() {
	const blob = await (await fetch(QRIS.poster)).blob();
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `QRIS-${QRIS.merchant.replace(/\s+/g, "-")}.jpg`;
	link.click();
	URL.revokeObjectURL(link.href);
}
function QrisPoster({ amount, uniqueCode, ticketName, quantity, orderId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden bg-white px-5 pb-5 pt-6 text-[#111]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 opacity-[0.06]",
				style: { backgroundImage: "repeating-linear-gradient(90deg,#111 0 1px,transparent 1px 18px),repeating-linear-gradient(0deg,#111 0 1px,transparent 1px 18px)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "absolute left-0 top-[38%] h-0 w-0 border-y-[42px] border-y-transparent border-l-[58px] border-l-[#E31C23]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "absolute bottom-0 right-0 h-0 w-0 border-b-[72px] border-b-[#E31C23] border-l-[86px] border-l-transparent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-start justify-between gap-2 pr-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrisWordmark, { className: "h-12 w-auto max-w-[78%] bg-white object-contain object-left" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GpnMark, { className: "mt-0.5 h-11 w-14 shrink-0" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[15px] font-extrabold uppercase tracking-wide",
						children: QRIS.merchant
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] tracking-wide text-[#666]",
						children: ["NMID: ", QRIS.nmid]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[11px] text-[#666]",
						children: [
							ticketName,
							" + kode unik ",
							formatUniqueCode(uniqueCode)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-extrabold tabular-nums tracking-tight",
							children: formatIdr(amount)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyNominalIcon, {
							amount,
							className: "border border-[#ddd] bg-white text-[#111] hover:bg-[#f3f3f3] hover:text-[#111]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] font-medium text-[#E31C23]",
						children: "Masukkan nominal ini saat bayar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto mt-4 w-[240px] bg-white p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
					value: QRIS.payload,
					tone: "print",
					label: `QRIS statis ${QRIS.merchant}`,
					className: "aspect-square w-full"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-extrabold uppercase tracking-[0.12em]",
					children: "Satu QRIS untuk semua"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[10px] leading-relaxed text-[#555]",
					children: [
						"Cek aplikasi penyelenggara",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"di www.aspi-qris.id"
					]
				})]
			}),
			orderId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5 flex items-end justify-between gap-3 text-[10px] text-[#444]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QRIS statis · Golden Satya Fair" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono tracking-wide",
					children: orderId
				})]
			}) : null
		]
	});
}
function PaymentDialog({ open, onOpenChange, session, onConfirm, busy }) {
	const [remain, setRemain] = (0, import_react.useState)(900);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open || !session) return;
		const end = Date.now() + 9e5;
		setRemain(900);
		const timer = window.setInterval(() => {
			setRemain(Math.max(0, Math.round((end - Date.now()) / 1e3)));
		}, 1e3);
		return () => window.clearInterval(timer);
	}, [open, session?.orderId]);
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92dvh] max-w-[380px] gap-0 overflow-y-auto bg-[#f3f3f3] p-0 text-[#111] sm:rounded-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "sr-only",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Bayar dengan QRIS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						session.quantity,
						" tiket ",
						session.ticketName,
						" · ",
						formatIdr(session.payableAmount)
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrisPoster, {
					amount: session.payableAmount,
					uniqueCode: session.uniqueCode,
					ticketName: session.ticketName,
					quantity: session.quantity,
					orderId: session.orderId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 border-t border-[#ddd] bg-[#f3f3f3] px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "grid gap-1 text-[11px] text-[#444]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Buka aplikasi bank atau e-wallet berlogo QRIS" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["2. Scan kode, masukkan nominal ", formatIdr(session.payableAmount)] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Bayar, lalu unggah bukti transfer" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs font-medium tabular-nums text-[#E31C23]",
							children: ["Berlaku ", formatRemain(remain)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full border-[#ccc] bg-white text-[#111] hover:bg-[#f7f7f7]",
							disabled: downloading,
							onClick: () => {
								setDownloading(true);
								downloadQris().catch(() => void 0).finally(() => setDownloading(false));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), downloading ? "Menyiapkan unduhan…" : "Unduh QRIS"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							className: "w-full bg-[#E31C23] text-white hover:bg-[#c4181e]",
							disabled: busy,
							onClick: onConfirm,
							children: busy ? "Membuka…" : "Konfirmasi Pembayaran"
						})
					]
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
var emptyQty = () => ({
	vvip: 0,
	vip: 0,
	festival: 0
});
function CheckoutPage() {
	const { type, ref } = Route$14.useSearch();
	const navigate = Route$14.useNavigate();
	const lockedRef = ref || "";
	const [qty, setQty] = (0, import_react.useState)({
		...emptyQty(),
		...type ? { [type]: 1 } : {}
	});
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [agree, setAgree] = (0, import_react.useState)(false);
	const [referral, setReferral] = (0, import_react.useState)(lockedRef);
	const [catalog, setCatalog] = (0, import_react.useState)(null);
	const [stage, setStage] = (0, import_react.useState)(null);
	const [held, setHeld] = (0, import_react.useState)(emptyQty());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [session, setSession] = (0, import_react.useState)(null);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [staffBuyer, setStaffBuyer] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setStaffBuyer(isStaffSession());
		const saved = readGuestCheckout();
		if (!saved) return;
		if (saved.name) setFullName(saved.name);
		if (saved.address) setAddress(saved.address);
		if (saved.email) setEmail(saved.email);
		if (saved.whatsapp) setWhatsapp(saved.whatsapp);
	}, []);
	(0, import_react.useEffect)(() => {
		if (lockedRef) setReferral(lockedRef);
	}, [lockedRef]);
	(0, import_react.useEffect)(() => {
		getCheckoutState({ data: {
			token: readStaffToken(),
			whatsapp: ""
		} }).then((data) => {
			setCatalog(data.tickets);
			setStage(data.stage);
			setHeld({
				...emptyQty(),
				...data.held
			});
		}).catch((e) => {
			toast.error(e instanceof Error ? e.message : "Gagal memuat tiket.");
		}).finally(() => setLoading(false));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isValidWhatsapp(whatsapp)) return;
		const timer = window.setTimeout(() => {
			getCheckoutState({ data: {
				token: readStaffToken(),
				whatsapp
			} }).then((data) => {
				setHeld({
					...emptyQty(),
					...data.held
				});
			}).catch(() => {});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [whatsapp]);
	const visibleIds = (catalog ?? []).map((t) => t.id);
	const maxQty = {
		vvip: capFor("vvip", catalog, held),
		vip: capFor("vip", catalog, held),
		festival: capFor("festival", catalog, held)
	};
	(0, import_react.useEffect)(() => {
		if (loading) return;
		setQty((prev) => {
			const next = emptyQty();
			for (const id of TICKET_IDS) next[id] = visibleIds.includes(id) ? Math.min(prev[id], maxQty[id]) : 0;
			if (type && visibleIds.includes(type) && next[type] === 0 && maxQty[type] > 0) next[type] = 1;
			if (TICKET_IDS.every((id) => next[id] === prev[id])) return prev;
			return next;
		});
	}, [
		loading,
		type,
		maxQty.vvip,
		maxQty.vip,
		maxQty.festival,
		visibleIds.join(",")
	]);
	const total = (0, import_react.useMemo)(() => {
		if (!catalog) return 0;
		return TICKET_IDS.reduce((sum, id) => {
			return sum + (catalog.find((t) => t.id === id)?.priceIdr ?? 0) * qty[id];
		}, 0);
	}, [catalog, qty]);
	const uniqueCode = uniqueCodeFromPhone(whatsapp);
	const payable = total + uniqueCode;
	const totalQty = qty.vvip + qty.vip + qty.festival;
	if (staffBuyer) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: "Tidak bisa membeli"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted-foreground",
				children: "Akun admin, crew, dan agent hanya untuk mengelola penjualan. Buka situs tanpa login staf untuk beli tiket."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "mt-6 inline-flex text-sm underline-offset-4 hover:underline",
				children: "Ke panel staf"
			})
		]
	});
	async function pay() {
		if (!agree) {
			toast.error("Setujui syarat pembelian terlebih dahulu.");
			return;
		}
		if (!isValidName(fullName)) {
			toast.error("Nama lengkap wajib diisi.");
			return;
		}
		if (!isValidAddress(address)) {
			toast.error("Alamat wajib diisi (minimal 8 karakter).");
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
		if (totalQty <= 0) {
			toast.error("Pilih minimal satu tiket.");
			return;
		}
		setSubmitting(true);
		try {
			const next = await createOrder({ data: {
				items: TICKET_IDS.map((id) => ({
					ticketTypeId: id,
					quantity: qty[id]
				})),
				name: fullName,
				address,
				email,
				whatsapp,
				referral,
				token: readStaffToken()
			} });
			writeGuestCheckout({
				name: fullName,
				address,
				email,
				whatsapp
			});
			setSession(next);
			setPayOpen(true);
		} catch (e) {
			const message = e instanceof Error ? e.message : "Gagal membuat pesanan.";
			if (message === "Unauthorized") {
				toast.error("Sesi staf tidak bisa membeli tiket.");
				return;
			}
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	}
	function confirmPay() {
		if (!session) return;
		setPayOpen(false);
		navigate({
			to: "/order/$orderId/konfirmasi",
			params: { orderId: session.orderId }
		});
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
						EVENT.venue,
						stage ? ` · ${stage.name}` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-sm text-muted-foreground",
					children: "Tidak perlu membuat akun. Isi data di bawah, bayar QRIS, lalu cek e-ticket di Tiket saya dengan email dan WhatsApp yang sama."
				}),
				!loading && !stage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: "Penjualan tiket sedang ditutup."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-3",
					children: (catalog ?? []).map((item) => {
						const id = item.id;
						const copy = TICKET_COPY[id];
						const cap = maxQty[id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between", qty[id] > 0 ? "border-foreground bg-secondary" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "text-left",
								onClick: () => {
									if (qty[id] === 0 && cap > 0) setQty((prev) => ({
										...prev,
										[id]: 1
									}));
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: copy.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: item ? formatIdr(item.priceIdr) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: cap <= 0 ? "Tidak bisa dibeli saat ini." : `Maks. 5 / nomor WA · bisa beli ${cap}`
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyStepper, {
								value: qty[id],
								min: 0,
								max: Math.max(qty[id], cap),
								onChange: (next) => setQty((prev) => ({
									...prev,
									[id]: Math.max(0, Math.min(next, cap > 0 ? cap : 0))
								}))
							})]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "nama",
								children: ["Nama lengkap ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nama",
								name: "name",
								autoComplete: "name",
								required: true,
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "Nama sesuai identitas"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "alamat",
									children: ["Alamat ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: "alamat",
									name: "address",
									required: true,
									rows: 3,
									autoComplete: "street-address",
									value: address,
									onChange: (e) => setAddress(e.target.value),
									placeholder: "Jalan, RT/RW, kelurahan, kecamatan, kota",
									className: "flex min-h-24 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Dipakai pada e-ticket dan pintu masuk."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "email",
								children: ["Email e-ticket ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "nama@email.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "wa",
									children: ["Nomor WhatsApp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "wa",
									type: "tel",
									inputMode: "tel",
									autoComplete: "tel",
									required: true,
									value: whatsapp,
									onChange: (e) => setWhatsapp(e.target.value),
									placeholder: "0812 3456 7890"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Format Indonesia, diawali 08 atau +62. Tiga digit terakhir jadi kode unik nominal."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "referral",
									children: "Kode referal agent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "referral",
									autoComplete: "off",
									placeholder: "opsional",
									value: referral,
									readOnly: Boolean(lockedRef),
									disabled: Boolean(lockedRef),
									onChange: (e) => {
										if (lockedRef) return;
										setReferral(e.target.value);
									},
									className: lockedRef ? "opacity-80" : void 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: lockedRef ? "Terisi otomatis dari tautan agent dan tidak bisa diubah." : "Isi jika beli lewat agent. Kosongkan jika tidak ada."
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
							src: qty.vvip > 0 && qty.vip === 0 && qty.festival === 0 ? TICKET_COPY.vvip.image : qty.vip > 0 && qty.vvip === 0 && qty.festival === 0 ? TICKET_COPY.vip.image : qty.festival > 0 && qty.vvip === 0 && qty.vip === 0 ? TICKET_COPY.festival.image : "/images/hero.jpg",
							alt: "",
							className: "aspect-video w-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2 text-sm",
						children: [TICKET_IDS.map((id) => qty[id] > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								qty[id],
								" × ",
								TICKET_COPY[id].name
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatIdr((catalog?.find((t) => t.id === id)?.priceIdr ?? 0) * qty[id])
							})]
						}, id) : null), totalQty === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Belum ada tiket dipilih."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kode unik (3 digit HP)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: whatsapp.replace(/\D/g, "").length >= 3 ? formatIdr(uniqueCode) : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Total bayar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl tabular-nums",
								children: formatIdr(payable)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyNominalIcon, { amount: payable })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "mt-6 w-full",
						disabled: submitting || loading || totalQty <= 0,
						onClick: () => void pay(),
						children: submitting ? "Menyiapkan QRIS…" : "CHECKOUT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-xs text-muted-foreground",
						children: "VIP dan Festival dibayar dengan QRIS statis"
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
				onConfirm: () => void confirmPay(),
				busy: submitting
			})
		]
	});
}
function capFor(id, catalog, held) {
	const remaining = (catalog?.find((t) => t.id === id))?.remaining ?? 5;
	return Math.max(0, Math.min(5 - (held[id] ?? 0), remaining));
}
//#endregion
export { CheckoutPage as component };
