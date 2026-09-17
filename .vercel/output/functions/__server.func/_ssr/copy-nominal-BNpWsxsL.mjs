import { o as __toESM } from "../_runtime.mjs";
import { i as formatIdr } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Copy, p as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/copy-nominal-BNpWsxsL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function copyNominal(amount) {
	const value = String(amount);
	try {
		await navigator.clipboard.writeText(value);
	} catch {
		const el = document.createElement("textarea");
		el.value = value;
		el.setAttribute("readonly", "");
		el.style.position = "fixed";
		el.style.left = "-9999px";
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		el.remove();
	}
}
function CopyNominalButton({ amount, className, variant = "outline", label = "Salin nominal" }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant,
		className,
		disabled: amount <= 0,
		onClick: () => {
			copyNominal(amount).then(() => {
				setCopied(true);
				toast.success(`Nominal ${formatIdr(amount)} disalin`);
				window.setTimeout(() => setCopied(false), 1600);
			}).catch(() => toast.error("Gagal menyalin nominal."));
		},
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Tersalin" : label]
	});
}
function CopyNominalIcon({ amount, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground", className),
		disabled: amount <= 0,
		"aria-label": "Salin nominal",
		onClick: () => {
			copyNominal(amount).then(() => {
				setCopied(true);
				toast.success(`Nominal ${formatIdr(amount)} disalin`);
				window.setTimeout(() => setCopied(false), 1600);
			}).catch(() => toast.error("Gagal menyalin nominal."));
		},
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Tersalin" : "Salin"]
	});
}
//#endregion
export { CopyNominalIcon as n, CopyNominalButton as t };
