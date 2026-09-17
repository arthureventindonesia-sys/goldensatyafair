import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as EVENT } from "./event-BBlN7ENr.mjs";
import { r as signIn } from "./client-CVqXY6bk.mjs";
import { t as GROK_PROVIDERS } from "./server-7YZ5dGFp.mjs";
import { i as Route$5, o as Button } from "./router-BqsiFgbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-ruAQNtMh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { redirect } = Route$5.useSearch();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-[calc(100dvh-4rem)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover object-center opacity-50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
						children: [
							EVENT.brand,
							" · ",
							EVENT.year
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl italic tracking-tight",
						children: "Masuk dengan Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Masuk hanya lewat Google. Batas 5 tiket per jenis dijaga per akun, e-ticket tersimpan aman."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-3",
						children: GROK_PROVIDERS.filter((p) => p.providerId === "grok-google").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "h-12 w-full justify-center",
							disabled: busy !== null,
							onClick: () => {
								setBusy(p.providerId);
								setError(null);
								signIn(p.providerId, {
									callbackURL: redirect,
									errorCallbackURL: "/login"
								}).catch((e) => {
									setError(e instanceof Error ? e.message : "Gagal masuk.");
									setBusy(null);
								});
							},
							children: busy === p.providerId ? "Menghubungkan…" : `Lanjut dengan ${p.label}`
						}, p.providerId))
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-destructive",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "underline-offset-4 hover:underline",
							children: "Kembali ke beranda"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Login as component };
