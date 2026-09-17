import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useStaff, t as AdminOnly } from "./admin-staff-euhgdqBh.mjs";
import { a as STAGE_COPY } from "./event-IC9aXe9Q.mjs";
import { updateTicketStages } from "./server-N4SKNTPJ.mjs";
import { t as Input } from "./input-BZzC0GLh.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiket-DAfcd_Uv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toInput(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return new Date(d.getTime() + 252e5).toISOString().slice(0, 16);
}
function fromInput(value) {
	if (!value) return null;
	const d = /* @__PURE__ */ new Date(`${value}+07:00`);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function AdminTiketPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTiket, {}) });
}
function AdminTiket() {
	const { token, dash, reload } = useStaff();
	const [stages, setStages] = (0, import_react.useState)(dash?.stages ?? []);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (dash?.stages) setStages(dash.stages.map((s) => ({
			...s,
			offers: s.offers.map((o) => ({ ...o }))
		})));
	}, [dash]);
	if (!dash) return null;
	function patchStage(id, patch) {
		setStages((prev) => prev.map((s) => s.id === id ? {
			...s,
			...patch
		} : s));
	}
	async function save() {
		setBusy(true);
		try {
			await updateTicketStages({ data: {
				token,
				stages: stages.map((s) => ({
					id: s.id,
					enabled: s.enabled,
					startsAt: s.startsAt,
					endsAt: s.endsAt,
					offers: s.offers.map((o) => ({
						ticketTypeId: o.ticketTypeId,
						priceIdr: o.priceIdr,
						quota: o.quota
					}))
				}))
			} });
			toast.success("Pengaturan tiket disimpan.");
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal menyimpan tiket.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl italic",
				children: "Tiket"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: ["Aktifkan satu tahap penjualan, atur jadwal, harga, dan kuota. Early Bird tidak menjual VVIP.", dash.activeStageId ? ` Tahap aktif: ${STAGE_COPY[dash.activeStageId].name}.` : " Tidak ada tahap aktif sekarang."]
			})] }),
			stages.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl italic",
							children: stage.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-4 accent-foreground",
								checked: stage.enabled,
								onChange: (e) => patchStage(stage.id, { enabled: e.target.checked })
							}), stage.enabled ? "Aktif" : "Nonaktif"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `start-${stage.id}`,
								children: "Mulai"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: `start-${stage.id}`,
								type: "datetime-local",
								value: toInput(stage.startsAt),
								onChange: (e) => patchStage(stage.id, { startsAt: fromInput(e.target.value) })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `end-${stage.id}`,
								children: "Selesai"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: `end-${stage.id}`,
								type: "datetime-local",
								value: toInput(stage.endsAt),
								onChange: (e) => patchStage(stage.id, { endsAt: fromInput(e.target.value) })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-4",
						children: stage.offers.map((offer, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium sm:col-span-3",
									children: offer.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: `price-${stage.id}-${offer.ticketTypeId}`,
										children: "Harga (Rp)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: `price-${stage.id}-${offer.ticketTypeId}`,
										type: "number",
										min: 1,
										value: offer.priceIdr,
										onChange: (e) => {
											const offers = stage.offers.map((row, idx) => idx === i ? {
												...row,
												priceIdr: Number(e.target.value)
											} : row);
											patchStage(stage.id, { offers });
										}
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: `quota-${stage.id}-${offer.ticketTypeId}`,
										children: "Kuota"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: `quota-${stage.id}-${offer.ticketTypeId}`,
										type: "number",
										min: offer.sold,
										value: offer.quota,
										onChange: (e) => {
											const offers = stage.offers.map((row, idx) => idx === i ? {
												...row,
												quota: Number(e.target.value)
											} : row);
											patchStage(stage.id, { offers });
										}
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: cn("self-end text-sm text-muted-foreground"),
									children: ["Terjual ", offer.sold]
								})
							]
						}, offer.ticketTypeId))
					})
				]
			}, stage.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				className: "w-fit",
				disabled: busy,
				onClick: () => void save(),
				children: busy ? "Menyimpan…" : "Simpan tiket"
			})
		]
	});
}
//#endregion
export { AdminTiketPage as component };
