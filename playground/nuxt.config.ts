const production = process.env.NODE_ENV === "production";

/**
 * Preload stylesheet and once loaded call them
 * @param {string} href - Resource url
 * @returns {object} Link object
 */
function getStyleSheetPreload(href: string) {
	return {
		rel: "preload",
		as: "style" as const,
		onload: "this.onload=null;this.rel='stylesheet'",
		href,
	};
}

export default defineNuxtConfig({
	devtools: { enabled: !production },
	app: {
		keepalive: true,
		head: {
			title: "Nuxt module playground",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "robots", content: "index, follow" },
			],
			link: [
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com/",
					crossorigin: "anonymous",
				},
				{ rel: "dns-prefetch", href: "https://fonts.googleapis.com/" },
				{ rel: "preconnect", href: "https://unpkg.com/", crossorigin: "anonymous" },
				{ rel: "dns-prefetch", href: "https://unpkg.com/" },
				...[
					"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700;1,900&display=swap",
					"https://unpkg.com/@fortawesome/fontawesome-free@^6/css/all.min.css",
					"https://unpkg.com/sweetalert2@^11/dist/sweetalert2.min.css",
				].map(getStyleSheetPreload),
			],
		},
	},
	router: {
		options: {
			linkActiveClass: "is--route",
			linkExactActiveClass: "is--routeExact",
			scrollBehaviorType: "smooth",
		},
	},
	css: ["@open-xamu-co/ui-styles/dist/index.min.css"],
	modules: ["../src/module", "@open-xamu-co/ui-nuxt"],
	countries: { base: "/api/v1" },
	xamu: {
		swal: {
			overrides: {
				customClass: {
					confirmButton: ["bttn"],
					cancelButton: ["bttnToggle"],
					denyButton: ["link"],
				},
			},
			preventOverrides: {
				customClass: {
					confirmButton: ["bttn", "--tm-danger-light"],
					cancelButton: ["bttnToggle"],
					denyButton: ["link"],
				},
			},
		},
	},
});
