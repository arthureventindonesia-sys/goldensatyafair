import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AgentLinkCard } from "./agent-link-card-CP3z2Asp.mjs";
import { i as useStaff, t as AdminOnly } from "./admin-staff-euhgdqBh.mjs";
import { createStaffAccount, deleteStaffAccount } from "./server-N4SKNTPJ.mjs";
import { t as Input } from "./input-BZzC0GLh.mjs";
import { t as Label } from "./label-D4Cl4ogv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pengguna-FLF-sVrK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPenggunaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPengguna, {}) });
}
function AdminPengguna() {
	const { token, dash, reload } = useStaff();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("crew");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [createdAgent, setCreatedAgent] = (0, import_react.useState)(null);
	const [openQr, setOpenQr] = (0, import_react.useState)(null);
	if (!dash) return null;
	const currentUser = dash.username;
	async function addUser() {
		setBusy(true);
		try {
			const created = await createStaffAccount({ data: {
				token,
				username,
				password,
				role
			} });
			toast.success(`Akun ${created.username} (${created.role}) dibuat.`);
			if (created.role === "agent") setCreatedAgent(created.username);
			else setCreatedAgent(null);
			setUsername("");
			setPassword("");
			setRole("crew");
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gagal membuat akun.");
		} finally {
			setBusy(false);
		}
	}
	async function removeUser(name) {
		if (name === currentUser) {
			toast.error("Tidak bisa menghapus akun yang sedang dipakai.");
			return;
		}
		if (name === "iang") {
			toast.error("Akun admin utama tidak bisa dihapus.");
			return;
		}
		setBusy(true);
		try {
			await deleteStaffAccount({ data: {
				token,
				username: name
			} });
			toast.success(`Akun ${name} dihapus.`);
			await reload();
		} catch (e) {
			const raw = e instanceof Error ? e.message : "";
			let message = "Gagal menghapus akun.";
			try {
				const parsed = JSON.parse(raw);
				if (parsed?.message) message = parsed.message;
				else if (raw && !raw.startsWith("{")) message = raw;
			} catch {
				if (raw) message = raw;
			}
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl italic",
						children: "Buat akun staf"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Akun yang dibuat admin: crew, agent, atau admin. Pembeli tidak perlu membuat akun."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 grid gap-4",
						onSubmit: (e) => {
							e.preventDefault();
							addUser();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "new-user",
										children: "Username"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "new-user",
										autoComplete: "off",
										value: username,
										onChange: (e) => setUsername(e.target.value),
										placeholder: "nama_akun"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "new-pass",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "new-pass",
										type: "password",
										autoComplete: "new-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "minimal 6 karakter"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "new-role",
										children: "Peran"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "new-role",
										value: role,
										onChange: (e) => setRole(e.target.value === "admin" ? "admin" : e.target.value === "agent" ? "agent" : "crew"),
										className: "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "crew",
												children: "Crew"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "agent",
												children: "Agent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "admin",
												children: "Admin"
											})
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-fit",
							disabled: busy || !username || !password,
							children: busy ? "Menyimpan…" : "Buat akun"
						})]
					})
				]
			}),
			createdAgent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl italic",
					children: ["QR agent ", createdAgent]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Scan QR ini membuka checkout dengan kode referal terisi otomatis."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentLinkCard, {
						code: createdAgent,
						title: `QR checkout ${createdAgent}`
					})
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl italic",
					children: "Akun staf"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Dibuat oleh admin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-hidden rounded-xl border border-border",
					children: dash.users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-5 text-sm text-muted-foreground",
						children: "Belum ada pengguna."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Username"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Peran"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Kode referal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "QR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Aksi"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: dash.users.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: user.username
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-full px-2 py-0.5 text-xs uppercase tracking-wider", user.role === "admin" ? "bg-secondary text-foreground" : "text-muted-foreground"),
										children: user.role
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-muted-foreground",
									children: user.role === "agent" ? user.referralCode || user.username : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: user.role === "agent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => setOpenQr((prev) => prev === (user.referralCode || user.username) ? null : user.referralCode || user.username),
										children: "QR"
									}) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: user.username === "iang" || user.username === currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Tetap"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										disabled: busy,
										onClick: () => void removeUser(user.username),
										children: "Hapus"
									})
								})
							]
						}, user.username)) })]
					})
				}),
				openQr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentLinkCard, {
						code: openQr,
						title: `QR checkout ${openQr}`
					})
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl italic",
					children: "Pembeli"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Data dari checkout (tanpa akun). Kode referal diisi saat beli tiket."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-hidden rounded-xl border border-border",
					children: (dash.buyers ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-5 text-sm text-muted-foreground",
						children: "Belum ada pembeli."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "WhatsApp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Referal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 font-medium",
										children: "Checkout"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (dash.buyers ?? []).map((buyer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: buyer.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 tabular-nums",
										children: buyer.whatsapp || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-muted-foreground",
										children: buyer.referralCode || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: new Date(buyer.createdAt).toLocaleString("id-ID")
									})
								]
							}, buyer.id)) })]
						})
					})
				})
			] })
		]
	});
}
//#endregion
export { AdminPenggunaPage as component };
