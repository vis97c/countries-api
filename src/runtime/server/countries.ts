/* eslint-disable import/no-unresolved */
import { defineCachedEventHandler, getQuery, useStorage } from "#imports";

import type { iCountry, tSupportedLangs } from "../../types";
import { makeJsonResponse, makeMapCountryData, supportedLangs } from "./utils";

/** Request chache in seconds */
const maxAge = Number(process.env.REQUEST_CACHE) || 60 * 60 * 24;

/**
 * Get the edges from a given collection
 */
export default defineCachedEventHandler(
	async (event) => {
		const JsonResponse = makeJsonResponse(event);

		try {
			const query = getQuery(event);
			const lang = <tSupportedLangs | undefined>query.lang;
			const storage = useStorage("assets:countries");

			// Check for lang errors
			if (lang) {
				if (typeof lang !== "string") {
					return JsonResponse("Non supported lang format was given", 422);
				} else if (!supportedLangs.includes(lang)) {
					const langs = supportedLangs.join(", ");

					return JsonResponse(
						`Unsupported translation, supported ones are: ${langs}`,
						422
					);
				}
			}

			const mapCountryData = makeMapCountryData(lang);
			const countries: iCountry[] = await storage.getItem("index.json");

			// All countries
			return JsonResponse(countries.map(mapCountryData));
		} catch (error) {
			// handle unexpected errors
			if (process.env.DEBUG) console.error(error);

			return JsonResponse("Something went wrong", 500);
		}
	},
	{ maxAge }
);
