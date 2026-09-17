import { o as __toESM } from "../_runtime.mjs";
import { a as formatUniqueCode, i as formatIdr } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-C44ntQMH.mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PAYMENT_REVIEW_NOTICE } from "./event-IC9aXe9Q.mjs";
import { getOrder, uploadPaymentProof } from "./server-N4SKNTPJ.mjs";
import { n as Route } from "./router-er0R-en-.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
import { t as CopyNominalButton } from "./copy-nominal-BNpWsxsL.mjs";
import { t as Skeleton } from "./skeleton-BRxXReRu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._orderId.konfirmasi-U3bzhblo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const text = String(reader.result ?? "");
			const comma = text.indexOf(",");
			resolve(comma >= 0 ? text.slice(comma + 1) : text);
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Gagal membaca file."));
		reader.readAsDataURL(file);
	});
}
function ConfirmPaymentPage() {
	const { orderId } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getOrder({ data: { orderId } }).then((data) => {
			setOrder(data.order);
			if (data.order.status === "submitted" || data.order.hasProof) setDone(true);
		}).catch(() => setMissing(true));
	}, [orderId]);
	(0, import_react.useEffect)(() => {
		if (!file) {
			setPreview(null);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);
	if (!order && !missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
	});
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8",
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
		className: "mx-auto w-full max-w-xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
	});
	if (order.status === "paid") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/order/$orderId",
		params: { orderId: order.id }
	});
	async function submit() {
		if (!file) {
			toast.error("Unggah bukti transfer terlebih dahulu.");
			return;
		}
		setBusy(true);
		try {
			const data = await fileToBase64(file);
			const next = await uploadPaymentProof({ data: {
				orderId,
				fileName: file.name,
				mime: file.type || "image/jpeg",
				data
			} });
			setOrder(next.order);
			setDone(true);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal mengunggah bukti.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-xl px-5 py-12 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: ["Pesanan ", order.id]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: "Konfirmasi pembayaran"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					order.ticketName,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Transfer sesuai nominal",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: formatIdr(order.payableAmount)
					}),
					" ",
					"(tiket ",
					formatIdr(order.grossAmount),
					" + kode unik ",
					formatUniqueCode(order.uniqueCode),
					")."
				]
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-accent/40 bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl italic tracking-tight",
						children: "Bukti terkirim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-foreground",
						children: PAYMENT_REVIEW_NOTICE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tiket",
								children: "Tiket saya"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/order/$orderId",
								params: { orderId: order.id },
								children: "Lihat pesanan"
							})
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-5 rounded-xl border border-border bg-card p-6",
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "Nominal yang harus dibayar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl tabular-nums",
								children: formatIdr(order.payableAmount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyNominalButton, { amount: order.payableAmount })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "bukti",
								children: ["Bukti transfer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "bukti",
								type: "file",
								required: true,
								accept: "image/jpeg,image/png,image/webp",
								className: "block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-2 file:text-sm",
								onChange: (e) => setFile(e.target.files?.[0] ?? null)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Foto struk atau screenshot transfer dengan nominal yang sama. JPG, PNG, atau WEBP."
							})
						]
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preview,
						alt: "Pratinjau bukti transfer",
						className: "max-h-72 w-full rounded-lg border border-border object-contain bg-muted"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || !file,
						children: busy ? "Mengunggah…" : "Kirim bukti transfer"
					})
				]
			})
		]
	});
}
//#endregion
export { ConfirmPaymentPage as component };
