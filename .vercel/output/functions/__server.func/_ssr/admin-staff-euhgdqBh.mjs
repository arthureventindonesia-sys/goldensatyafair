import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-staff-euhgdqBh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var StaffContext = (0, import_react.createContext)(null);
function StaffProvider({ value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffContext.Provider, {
		value,
		children
	});
}
function useStaff() {
	const ctx = (0, import_react.useContext)(StaffContext);
	if (!ctx) return {
		token: "",
		dash: null,
		checking: true,
		reload: async () => void 0
	};
	return ctx;
}
function RoleOnly({ roles, children }) {
	const { dash, checking } = useStaff();
	if (checking || !dash) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Memeriksa sesi…"
	});
	if (!roles.includes(dash.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted-foreground",
		children: [
			"Anda tidak punya akses ke halaman ini.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "underline-offset-4 hover:underline",
				children: "Kembali ke dashboard"
			})
		]
	});
	return children;
}
function AdminOnly({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOnly, {
		roles: ["admin"],
		children
	});
}
//#endregion
export { useStaff as i, RoleOnly as n, StaffProvider as r, AdminOnly as t };
