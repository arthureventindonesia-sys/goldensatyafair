import { o as __toESM } from "../_runtime.mjs";
import { i as formatIdr, n as formatEventDate, r as formatEventTime } from "./format-LT3CbQE3.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as buttonVariants, r as cn, t as Button } from "./button-C44ntQMH.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LINEUP, o as TICKET_COPY, s as TICKET_IDS, t as EVENT } from "./event-IC9aXe9Q.mjs";
import { getCatalog } from "./server-N4SKNTPJ.mjs";
import { f as Clock, i as Shield, l as MapPin, n as Users } from "../_libs/lucide-react.mjs";
import { c as MainLogo, l as PartnerLogos, s as SocialLinks } from "./router-er0R-en-.mjs";
import { t as isStaffSession } from "./staff-session-BtLHB3gl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CVw64DNW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function Home() {
	const [tickets, setTickets] = (0, import_react.useState)(null);
	const [stage, setStage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCatalog().then((data) => {
			setTickets(data.tickets);
			setStage(data.stage);
		}).catch(() => setTickets([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tickets, {
			tickets,
			stage
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lineup, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Venue, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cta, {})
	] });
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[calc(100dvh-4rem)] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero.jpg",
				alt: "Sal Priadi di Golden Satya Fair",
				className: "absolute inset-0 size-full object-cover object-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-end px-5 pb-28 pt-24 sm:px-8 sm:pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "enter-up text-xs uppercase tracking-[0.28em] text-accent",
						children: [
							EVENT.monthLabel,
							" · ",
							EVENT.city
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "sr-only",
						children: [
							EVENT.name,
							" ",
							EVENT.year
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainLogo, {
						to: "",
						className: "enter-up mt-5 h-20 w-auto sm:h-28"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "enter-up mt-6 max-w-md text-base text-foreground/85 sm:text-lg",
						children: [EVENT.tagline, " VIP dan Festival di Golden Star Lumina."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "enter-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#tiket",
								children: "Beli tiket"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#lineup",
								children: "Lihat lineup"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "enter-up mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
							children: "Diselenggarakan bersama"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnerLogos, {
							className: "mt-3",
							compact: true
						})]
					})
				]
			})
		]
	});
}
function Marquee() {
	const names = [
		"Golden Satya Fair",
		...LINEUP.map((a) => a.name),
		"November 2026"
	].join("  ·  ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden border-y border-border py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "marquee-track flex w-max gap-0 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-8",
				children: names
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-8",
				children: names
			})]
		})
	});
}
function Tickets({ tickets, stage }) {
	const ids = (tickets ?? []).map((t) => t.id);
	const show = ids.length > 0 ? ids : TICKET_IDS.filter((id) => id !== "vvip");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "tiket",
		className: "mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Tiket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-4xl italic tracking-tight sm:text-5xl",
				children: "Pilih malammu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-muted-foreground",
				children: stage ? `${stage.name}. Tanpa daftar akun. Maksimal 5 tiket per jenis per nomor WhatsApp, bisa dibeli sekaligus dalam satu checkout.` : "Penjualan tiket sedang ditutup. Nantikan tahap berikutnya."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-12 grid gap-6", show.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"),
				children: show.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					id,
					tickets,
					stageOpen: Boolean(stage)
				}, id))
			})
		]
	});
}
function TicketCard({ id, tickets, stageOpen }) {
	const copy = TICKET_COPY[id];
	const stock = tickets?.find((t) => t.id === id);
	const soldOut = stageOpen && stock?.remaining === 0;
	const unavailable = stageOpen && !stock;
	const [staff, setStaff] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setStaff(isStaffSession());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-photo overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: copy.image,
					alt: "",
					className: "size-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-4 top-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "border-foreground/20 bg-background/70 text-foreground",
						children: copy.name
					}), soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "border-destructive/40 text-destructive",
						children: "Habis"
					}) : null]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-6 p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tracking-tight",
					children: stock ? formatIdr(stock.priceIdr) : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: copy.blurb
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 text-sm text-muted-foreground",
					children: copy.perks.map((perk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-accent" }), perk]
					}, perk))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Maks. 5 tiket / jenis per nomor WhatsApp"
				}),
				staff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: cn(buttonVariants(), "relative z-10 mt-auto w-full"),
					children: "Akun staf tidak bisa membeli"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/checkout",
					search: { type: id },
					className: cn(buttonVariants(), "relative z-10 mt-auto w-full"),
					children: !stageOpen || unavailable ? `Lihat ${copy.name}` : soldOut ? `Lihat ${copy.name}` : `Beli ${copy.name}`
				})
			]
		})]
	});
}
function Lineup() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "lineup",
		className: "border-y border-border bg-muted/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Lineup"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-10 sm:grid-cols-2",
				children: LINEUP.map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: act.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: act.logo,
							alt: act.name,
							className: act.role === "Headliner" ? "mt-6 h-12 w-auto max-w-full object-contain object-left sm:h-16" : "mt-6 h-16 w-auto max-w-[16rem] object-contain object-left sm:h-20"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: act.role === "Headliner" ? "mt-4 font-display text-3xl italic leading-none tracking-tight sm:text-4xl" : "mt-4 font-display text-2xl italic leading-none tracking-tight sm:text-3xl",
							children: act.name
						})
					]
				}, act.name))
			})]
		})
	});
}
function Venue() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-6xl px-5 py-20 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Venue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 max-w-3xl font-display text-4xl italic tracking-tight",
				children: EVENT.venue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-xl text-muted-foreground",
				children: [
					"Golden Satya Fair di Perumahan Golden Star Lumina, Bumiayu. Pintu buka ",
					formatEventTime(EVENT.doorsAt),
					" WIB, acara mulai ",
					formatEventTime(EVENT.startsAt),
					" WIB."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: EVENT.mapsUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "mt-6 inline-flex h-11 items-center text-sm underline-offset-4 hover:underline",
				children: "Buka peta"
			})
		]
	});
}
function Info() {
	const items = [
		{
			icon: Clock,
			title: "Jadwal",
			body: `${formatEventDate(EVENT.startsAt)} · pintu ${formatEventTime(EVENT.doorsAt)} · acara ${formatEventTime(EVENT.startsAt)}–${formatEventTime(EVENT.endsAt)} WIB`
		},
		{
			icon: MapPin,
			title: "Lokasi",
			body: EVENT.address
		},
		{
			icon: Users,
			title: "Usia",
			body: `${EVENT.ageLimit}+. Bawa KTP atau paspor. Anak di bawah usia tidak diizinkan.`
		},
		{
			icon: Shield,
			title: "Masuk",
			body: "Tunjukkan QR e-ticket. Tas diperiksa. Dilarang membawa makanan luar, drone, dan kamera profesional tanpa izin."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "info",
		className: "border-t border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid w-full max-w-6xl gap-px bg-border px-0 sm:grid-cols-2 lg:grid-cols-4",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-background px-5 py-10 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-xl tracking-tight",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: item.body
					})
				]
			}, item.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "More information"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Ikuti update lineup, pintu, dan pengumuman resmi."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, {})]
		})]
	});
}
function Cta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden border-t border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover opacity-30"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 sm:py-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "max-w-xl font-display text-4xl italic tracking-tight sm:text-5xl",
					children: "Ambil tempatmu sebelum habis."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#tiket",
						children: "Beli tiket"
					})
				})]
			})
		]
	});
}
//#endregion
export { Home as component };
