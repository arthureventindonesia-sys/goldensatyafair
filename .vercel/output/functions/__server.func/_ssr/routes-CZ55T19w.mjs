import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatIdr, i as formatEventTime, r as formatEventDate } from "./format-Cm5WkSbp.mjs";
import { n as LINEUP, r as TICKET_COPY, t as EVENT } from "./event-BBlN7ENr.mjs";
import { getCatalog } from "./server-jrCKn4KW.mjs";
import { a as Shield, d as MapPin, n as Users, p as Clock } from "../_libs/lucide-react.mjs";
import { o as Button, s as cn } from "./router-BqsiFgbR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CZ55T19w.js
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
	(0, import_react.useEffect)(() => {
		getCatalog().then((data) => setTickets(data.tickets)).catch(() => setTickets([]));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tickets, { tickets }),
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
				alt: "Golden Satya Fair 2026 di Lapangan Asri Bumiayu",
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
						className: "enter-up mt-4 max-w-3xl font-display text-5xl italic leading-[0.9] tracking-tight sm:text-7xl",
						children: [EVENT.brand, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-4xl not-italic tracking-tight sm:text-6xl",
							children: ["Fair ", EVENT.year]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "enter-up mt-6 max-w-md text-base text-foreground/85 sm:text-lg",
						children: [EVENT.tagline, " VIP dan Festival di Lapangan Asri."]
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
		"Oktober 2026"
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
function Tickets({ tickets }) {
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
				children: "Maksimal 5 tiket per jenis per akun. Isi jumlah, WhatsApp, dan email saat checkout. Pembayaran melalui Midtrans."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					id: "vip",
					tickets
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					id: "festival",
					tickets
				})]
			})
		]
	});
}
function TicketCard({ id, tickets }) {
	const copy = TICKET_COPY[id];
	const stock = tickets?.find((t) => t.id === id);
	const remaining = stock?.remaining;
	const soldOut = remaining === 0;
	const low = remaining !== void 0 && remaining > 0 && remaining <= 20;
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
					}) : low ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Tersisa ", remaining] }) : null]
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
					children: remaining !== void 0 && !soldOut ? `${remaining} dari ${stock?.quota} tersisa · maks. ${stock?.perUserLimit} / akun` : `Maks. ${stock?.perUserLimit ?? 5} tiket / akun`
				}),
				soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-auto w-full",
					disabled: true,
					children: "Habis"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-auto w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/checkout",
						search: { type: id },
						children: ["Beli ", copy.name]
					})
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
						children: act.role
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: act.role === "Headliner" ? "mt-3 font-display text-5xl italic leading-none tracking-tight sm:text-7xl" : "mt-3 font-display text-4xl italic leading-none tracking-tight sm:text-5xl",
						children: act.name
					})]
				}, act.name))
			})]
		})
	});
}
function Venue() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/venue.jpg",
				alt: "Lapangan Asri Bumiayu",
				className: "aspect-video size-full object-cover"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: "Venue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-4xl italic tracking-tight",
				children: EVENT.venue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-muted-foreground",
				children: [
					"Golden Satya Fair di jantung Bumiayu. Pintu buka ",
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
		] })]
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "info",
		className: "border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
		})
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
