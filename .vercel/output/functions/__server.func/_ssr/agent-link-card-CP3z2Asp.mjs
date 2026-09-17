import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as Button } from "./button-C44ntQMH.mjs";
import { n as agentSignupUrl, r as normalizeReferral, t as agentSignupPath } from "./referral-BDKQ5Mjn.mjs";
import { t as QrCode } from "./qr-code-DVFlQMnQ.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-link-card-CP3z2Asp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentLinkCard({ code, title = "QR checkout agent" }) {
	const ref = (0, import_react.useMemo)(() => normalizeReferral(code), [code]);
	const url = (0, import_react.useMemo)(() => agentSignupUrl(code), [code]);
	const qrValue = url.startsWith("http") ? url : agentSignupPath(code);
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-40 rounded-lg bg-white p-2 sm:mx-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
				value: qrValue,
				tone: "print",
				label: `QR checkout agent ${code}`,
				className: "h-full w-full"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-lg",
				children: code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 break-all text-sm text-muted-foreground",
				children: url
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Scan QR atau buka tautan untuk checkout. Kode referal terisi otomatis dan terkunci."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						search: { ref },
						children: "Buka checkout"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: async () => {
						try {
							await navigator.clipboard.writeText(url);
						} catch {}
						setCopied(true);
						toast.success("Link agent disalin.");
						window.setTimeout(() => setCopied(false), 1500);
					},
					children: copied ? "Tersalin" : "Salin link"
				})]
			})
		] })]
	});
}
//#endregion
export { AgentLinkCard as t };
