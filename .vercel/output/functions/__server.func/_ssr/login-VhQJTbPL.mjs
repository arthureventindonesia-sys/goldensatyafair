import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$13 } from "./router-er0R-en-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-VhQJTbPL.js
var import_jsx_runtime = require_jsx_runtime();
function LoginRedirect() {
	const { ref } = Route$13.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/checkout",
		search: ref ? { ref } : {}
	});
}
//#endregion
export { LoginRedirect as component };
