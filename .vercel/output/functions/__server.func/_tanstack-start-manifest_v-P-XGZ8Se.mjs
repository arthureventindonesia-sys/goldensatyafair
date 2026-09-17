//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-P-XGZ8Se.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/checkout",
			"/login",
			"/tiket",
			"/order/$orderId",
			"/api/auth/$",
			"/api/midtrans/notification"
		],
		preloads: [
			"/assets/index-B9OPEgAV.js",
			"/assets/react-SIfiwpqq.js",
			"/assets/use-current-user-oCpuFS0e.js",
			"/assets/createClientRpc-CZNSX2QW.js",
			"/assets/preload-helper-JlbcKNSx.js",
			"/assets/lazyRouteComponent-BZG3QJlM.js",
			"/assets/createLucideIcon-BMzGw82M.js",
			"/assets/client-DRhaju3Z.js",
			"/assets/login-C0_IVUWc.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-B9OPEgAV.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: ["/assets/routes-B0lMaKnZ.js", "/assets/server-D7odO3uY.js"]
	},
	"/checkout": {
		filePath: "/workspace/src/routes/checkout.tsx",
		children: void 0,
		preloads: [
			"/assets/checkout-D6s54WVV.js",
			"/assets/server-D7odO3uY.js",
			"/assets/useNavigate-vlvM08k5.js",
			"/assets/skeleton-C-SIYM8w.js"
		]
	},
	"/login": {
		filePath: "/workspace/src/routes/login.tsx",
		children: void 0,
		preloads: ["/assets/login-CUiR89VX.js"]
	},
	"/tiket": {
		filePath: "/workspace/src/routes/tiket.tsx",
		children: ["/tiket/$code"],
		preloads: [
			"/assets/tiket-DTw0BLsF.js",
			"/assets/server-D7odO3uY.js",
			"/assets/useNavigate-vlvM08k5.js",
			"/assets/skeleton-C-SIYM8w.js",
			"/assets/e-ticket-Dk7QlTkp.js"
		]
	},
	"/order/$orderId": {
		filePath: "/workspace/src/routes/order.$orderId.tsx",
		children: void 0,
		preloads: [
			"/assets/order._orderId-DmM3XUVc.js",
			"/assets/server-D7odO3uY.js",
			"/assets/useNavigate-vlvM08k5.js",
			"/assets/skeleton-C-SIYM8w.js",
			"/assets/e-ticket-Dk7QlTkp.js"
		]
	},
	"/tiket/$code": {
		filePath: "/workspace/src/routes/tiket.$code.tsx",
		children: void 0,
		preloads: ["/assets/tiket._code-DI4y1B6N.js"]
	}
} });
//#endregion
export { tsrStartManifest };
