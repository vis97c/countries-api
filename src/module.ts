/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineNuxtModule, createResolver, addServerHandler } from "@nuxt/kit";
import path from "node:path";

import type { CountriesModuleOptions } from "./types.js";

export default defineNuxtModule<CountriesModuleOptions>({
	meta: {
		name: "@nuxtjs/countries",
		configKey: "countries",
		compatibility: { nuxt: "^3.0.0" },
	},
	defaults: { base: "/api/countries" },
	async setup(moduleOptions, nuxt) {
		const { base = "" } = moduleOptions;
		const { resolve } = createResolver(import.meta.url);
		const runtimePath = resolve("./runtime");
		const apiPath = resolve(runtimePath, "server/api");

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
			handler: resolve(apiPath, "countries/index.ts"),
		});
		// single country
		addServerHandler({
			route: path.join(base, ":country"),
			handler: resolve(apiPath, "countries/[country]/index.ts"),
		});
		// single state
		addServerHandler({
			route: path.join(base, ":country", ":state"),
			handler: resolve(apiPath, "countries/[country]/[state]/index.ts"),
		});
		// single city
		addServerHandler({
			route: path.join(base, ":country", ":state", ":city"),
			handler: resolve(apiPath, "countries/[country]/[state]/[city].ts"),
		});
	},
});
