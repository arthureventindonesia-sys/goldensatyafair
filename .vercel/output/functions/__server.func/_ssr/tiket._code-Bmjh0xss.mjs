import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { getTicketByCode } from "./server-jrCKn4KW.mjs";
import { s as Printer } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useCurrentUserState, n as Route$2, o as Button } from "./router-BqsiFgbR.mjs";
import { n as Skeleton } from "./skeleton-Dq9plklq.mjs";
import { t as ETicket } from "./e-ticket-C_liII2Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiket._code-Bmjh0xss.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketDetailPage() {
	const { code } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getTicketByCode({ data: { code } }).then(setTicket).catch((e) => {
			setMissing(true);
			toast.error(e instanceof Error ? e.message : "Tiket tidak ditemukan.");
		});
	}, [user, code]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: `/tiket/${code}` }
	});
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl italic",
			children: "Tiket tidak ditemukan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tiket",
				children: "Tiket saya"
			})
		})]
	});
	if (!ticket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-5 py-12 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mb-6 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tiket",
				className: "text-sm text-muted-foreground underline-offset-4 hover:underline",
				children: "Tiket saya"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => window.print(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Cetak"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ETicket, { ticket })]
	});
}
//#endregion
export { TicketDetailPage as component };
