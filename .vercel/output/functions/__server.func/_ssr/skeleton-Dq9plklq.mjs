import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as cn } from "./router-BqsiFgbR.mjs";
import { t as encode } from "../_libs/uqr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-Dq9plklq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrCode({ value, className, label }) {
	const qr = (0, import_react.useMemo)(() => encode(value, {
		border: 2,
		ecc: "M"
	}), [value]);
	const path = qr.data.flatMap((row, y) => row.map((on, x) => on ? `M${x} ${y}h1v1h-1z` : "")).join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${qr.size} ${qr.size}`,
		className: cn("size-44 bg-foreground text-background", className),
		role: "img",
		"aria-label": label ?? `Kode QR ${value}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: qr.size,
			height: qr.size,
			className: "fill-foreground"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: path,
			className: "fill-background"
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-secondary", className),
		...props
	});
}
//#endregion
export { Skeleton as n, QrCode as t };
