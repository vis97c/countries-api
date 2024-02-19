/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";

import type { CountriesModuleOptions } from "./types";

export default defineNuxtModule<CountriesModuleOptions>({
	meta: {
		name: "nuxt-countries-api",
		configKey: "countries",
		compatibility: { nuxt: "^3.0.0" },
	},
	defaults: { base: "/_countries" },
	async setup(moduleOptions, nuxt) {
		const { base = "" } = moduleOptions;
		const { resolve } = createResolver(import.meta.url);
		const runtimePath = resolve("./runtime");
		const apiPath = resolve(runtimePath, "server");

		// @ts-ignore
		nuxt.options.appConfig.countries = moduleOptions;

		nuxt.hook("nitro:config", async (nitroConfig) => {
			nitroConfig.serverAssets ||= [];
			nitroConfig.serverAssets.push({
				baseName: "countries",
				dir: resolve(runtimePath, "countries"),
			});
		});

		// all countries
		addServerHandler({
			route: base,
			handler: resolve(apiPath, "countries"),
		});
		// single country
		addServerHandler({
			route: `${base}/:country`,
			handler: resolve(apiPath, "country"),
		});
		// single state
		addServerHandler({
			route: `${base}/:country/:state`,
			handler: resolve(apiPath, "country-state"),
		});
		// single city
		addServerHandler({
			route: `${base}/:country/:state/:city`,
			handler: resolve(apiPath, "country-state-city"),
		});
	},
});
