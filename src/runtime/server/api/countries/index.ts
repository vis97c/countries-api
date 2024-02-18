/* eslint-disable import/no-unresolved */
import { defineCachedEventHandler, getQuery, setResponseStatus, useStorage } from "#imports";

import type { iCountry, tSupportedLangs } from "../../../../types";
import { makeMapCountryData, supportedLangs } from "../../utils";

/** Request chache in seconds */
const maxAge = Number(process.env.REQUEST_CACHE) || 60 * 60 * 24;

/**
 * Get the edges from a given collection
 */
export default defineCachedEventHandler(
	async (event) => {
		try {
			const query = getQuery(event);
			const lang = <tSupportedLangs | undefined>query.lang;
			const withStates = typeof query.states === "string";
			const withCities = typeof query.cities === "string";
			const storage = useStorage("assets:countries");

			// Check for lang errors
			if (lang) {
				if (typeof lang !== "string") {
					setResponseStatus(event, 422);

					return { errors: "Non supported lang format was given", data: null };
				} else if (!supportedLangs.includes(lang)) {
					const langs = supportedLangs.join(", ");

					setResponseStatus(event, 422);

					return {
						errors: `Unsupported translation, supported ones are: ${langs}`,
						data: null,
					};
				}
			}

			const mapCountryData = makeMapCountryData(lang, withStates, withCities);
			const countries: iCountry[] = await storage.getItem("index.json");

			// All countries
			setResponseStatus(event, 200);

			return { errors: null, data: countries.map(mapCountryData) };
		} catch (error) {
			// handle unexpected errors
			if (process.env.DEBUG) console.error(error);

			setResponseStatus(event, 500);

			return { errors: "Something went wrong", data: null };
		}
	},
	{ maxAge }
);
