//#region node_modules/.nitro/vite/services/ssr/assets/event-IC9aXe9Q.js
var QRIS = {
	image: "/images/qris-static.png",
	poster: "/images/qris-poster.jpg",
	merchant: "PENDEKAR PRINTING",
	nmid: "ID1026497312623",
	city: "BREBES",
	payload: "00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530003900060215ID10260039000690303UKE51440014ID.CO.QRIS.WWW0215ID10264973126230303UKE5204569953033605802ID5917PENDEKAR PRINTING6006BREBES61055227462410509S441254210117202609161730320900703A016304C4FA"
};
var PAYMENT_REVIEW_NOTICE = "Tunggu Konfirmasi pembayaran max 1x24 jam. Tiket akan keluar setelah pembayaran terkonfirmasi oleh Admin.";
var EVENT = {
	id: "golden-satya-fair-2026",
	brand: "GOLDEN SATYA",
	name: "Golden Satya Fair",
	year: "2026",
	monthLabel: "November 2026",
	tagline: "Malam emas di Bumiayu.",
	venue: "Perumahan Golden Star Lumina Bumiayu",
	city: "Bumiayu, Brebes",
	address: "Perumahan Golden Star Lumina, Bumiayu, Kabupaten Brebes, Jawa Tengah",
	startsAt: "2026-11-14T19:30:00+07:00",
	endsAt: "2026-11-14T22:30:00+07:00",
	doorsAt: "2026-11-14T18:00:00+07:00",
	ageLimit: 18,
	timezone: "Asia/Jakarta",
	mapsUrl: "https://www.google.com/maps/search/?api=1&query=Perumahan+Golden+Star+Lumina+Bumiayu",
	logos: {
		main: {
			src: "/images/logo-gsf.png",
			alt: "Golden Satya Fair"
		},
		partners: [
			{
				src: "/images/logo-bap.png",
				alt: "Banyu Anget Project",
				onLight: true
			},
			{
				src: "/images/logo-karang-taruna.jpg",
				alt: "Karang Taruna Bergerak"
			},
			{
				src: "/images/logo-grand-satya.jpg",
				alt: "Grand Satya"
			},
			{
				src: "/images/logo-golden-star-lumina.jpg",
				alt: "Golden Star Lumina",
				wide: true
			}
		]
	},
	socials: [{
		id: "instagram",
		label: "Instagram",
		handle: "@Goldensatyafair2026",
		href: "https://www.instagram.com/Goldensatyafair2026"
	}, {
		id: "tiktok",
		label: "TikTok",
		handle: "@golden.satya.fair",
		href: "https://www.tiktok.com/@golden.satya.fair"
	}]
};
var LINEUP = [{
	name: "Sal Priadi",
	role: "Headliner",
	logo: "/images/logo-sal-priadi.png"
}, {
	name: "Bilal Indrajaya",
	role: "Guest",
	logo: "/images/logo-bilal-indrajaya.png"
}];
var TICKET_IDS = [
	"vvip",
	"vip",
	"festival"
];
function isTicketTypeId(value) {
	return value === "vvip" || value === "vip" || value === "festival";
}
function isSalesStageId(value) {
	return value === "early_bird" || value === "presale_1" || value === "presale_2" || value === "on_the_spot";
}
var STAGE_COPY = {
	early_bird: {
		id: "early_bird",
		name: "Early Bird",
		types: ["vip", "festival"]
	},
	presale_1: {
		id: "presale_1",
		name: "Presale 1",
		types: [
			"vvip",
			"vip",
			"festival"
		]
	},
	presale_2: {
		id: "presale_2",
		name: "Presale 2",
		types: [
			"vvip",
			"vip",
			"festival"
		]
	},
	on_the_spot: {
		id: "on_the_spot",
		name: "On the spot",
		types: [
			"vvip",
			"vip",
			"festival"
		]
	}
};
var TICKET_COPY = {
	vvip: {
		id: "vvip",
		name: "VVIP",
		blurb: "Area paling depan, tamu kehormatan.",
		perks: [
			"Area panggung paling depan",
			"Kursi dan lounge VVIP",
			"Jalur masuk prioritas",
			"Merchandise eksklusif"
		],
		image: "/images/hero.jpg"
	},
	vip: {
		id: "vip",
		name: "VIP",
		blurb: "Dekat panggung, duduk, jalur masuk khusus.",
		perks: [
			"Area panggung depan dengan kursi",
			"Jalur masuk khusus",
			"Pemandangan panggung tanpa halangan",
			"Akses toilet lebih dekat"
		],
		image: "/images/hero.jpg"
	},
	festival: {
		id: "festival",
		name: "Festival",
		blurb: "Berdiri di lapangan, malam yang sama.",
		perks: [
			"Area standing Golden Star Lumina",
			"Akses food court dan bar",
			"Pemandangan panggung penuh"
		],
		image: "/images/festival.jpg"
	}
};
//#endregion
export { STAGE_COPY as a, isSalesStageId as c, QRIS as i, isTicketTypeId as l, LINEUP as n, TICKET_COPY as o, PAYMENT_REVIEW_NOTICE as r, TICKET_IDS as s, EVENT as t };
