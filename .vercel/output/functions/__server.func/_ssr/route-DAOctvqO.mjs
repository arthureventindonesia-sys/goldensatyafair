import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as StaffProvider } from "./admin-staff-euhgdqBh.mjs";
import { adminLogin, adminLogout, getAdminDashboard, getAdminSession } from "./server-N4SKNTPJ.mjs";
import { t as Input } from "./input-BZzC0GLh.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
import { n as readStaffToken, r as writeStaffToken } from "./staff-session-BtLHB3gl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DAOctvqO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Dashboard",
		exact: true,
		roles: [
			"admin",
			"crew",
			"agent"
		]
	},
	{
		to: "/admin/pembayaran",
		label: "Pembayaran",
		exact: false,
		roles: ["admin", "crew"]
	},
	{
		to: "/admin/transaksi",
		label: "Transaksi",
		exact: false,
		roles: ["admin", "crew"]
	},
	{
		to: "/admin/agent",
		label: "Agent",
		exact: false,
		roles: ["admin", "agent"]
	},
	{
		to: "/admin/tiket",
		label: "Tiket",
		exact: false,
		roles: ["admin"]
	},
	{
		to: "/admin/pengguna",
		label: "Pengguna",
		exact: false,
		roles: ["admin"]
	}
];
function AdminLayout() {
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)("");
	const [dash, setDash] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	async function reload(nextToken = token) {
		const data = await getAdminDashboard({ data: { token: nextToken } });
		setDash(data);
	}
	(0, import_react.useEffect)(() => {
		const stored = readStaffToken();
		setToken(stored);
		getAdminSession({ data: { token: stored } }).then(async (s) => {
			if (!s.ok) return;
			await reload(stored);
		}).catch(() => void 0).finally(() => setChecking(false));
	}, []);
	async function login() {
		setBusy(true);
		try {
			const result = await adminLogin({ data: {
				username,
				password
			} });
			writeStaffToken(result.token);
			setToken(result.token);
			await reload(result.token);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal masuk.");
			setDash(null);
		} finally {
			setBusy(false);
		}
	}
	const links = NAV.filter((item) => dash ? item.roles.includes(dash.role) : false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffProvider, {
		value: {
			token,
			dash,
			checking,
			reload: () => reload()
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto w-full max-w-5xl px-5 py-12 sm:px-8",
			children: checking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Memeriksa sesi…"
			}) : !dash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl italic tracking-tight",
					children: "Masuk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Masuk dengan akun admin, crew, atau agent."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 grid max-w-sm gap-4",
					onSubmit: (e) => {
						e.preventDefault();
						login();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-user",
								children: "User"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-user",
								name: "username",
								autoComplete: "username",
								value: username,
								onChange: (e) => setUsername(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-pass",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-pass",
								name: "password",
								type: "password",
								autoComplete: "current-password",
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy || !username || !password,
							children: busy ? "Masuk…" : "Masuk"
						})
					]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
							children: dash.role === "admin" ? "Admin" : dash.role === "crew" ? "Crew" : "Agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl italic tracking-tight",
							children: "Panel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: ["Masuk sebagai ", dash.username]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => {
							writeStaffToken("");
							setToken("");
							adminLogout().then(() => setDash(null));
						},
						children: "Keluar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-8 flex flex-wrap gap-2 border-b border-border pb-4",
					children: links.map((item) => {
						const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"),
							children: item.label
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			] })
		})
	});
}
//#endregion
export { AdminLayout as component };
