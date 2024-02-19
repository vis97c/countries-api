/* eslint-disable import/no-unresolved */
import _ from "lodash";

import { defineCachedEventHandler, getQuery, getRouterParam, useStorage } from "#imports";

import type { iCountry, tSupportedLangs } from "../../types";
import {
	getMatches,
	makeJsonResponse,
	makeMapCountryData,
	makeMapStateData,
	supportedLangs,
} from "./utils";

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
			const withStates = typeof query.states === "string";
			const withCities = typeof query.cities === "string";
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

			const mapCountryData = makeMapCountryData(lang, withStates, withCities);
			const mapStateData = makeMapStateData(withCities);
			const countryParam = getRouterParam(event, "country")?.toLowerCase();
			const countries: iCountry[] = await storage.getItem("index.json");
			const country = countries.find(({ name, iso2, iso3, translations }) => {
				const matchable = [...getMatches(name), iso2, iso3, ...Object.values(translations)];

				return matchable.map((v) => v && v.toLowerCase()).includes(countryParam);
			});

			// Country does not exist
			if (!countryParam || !country) {
				return JsonResponse("No country with the given data was found", 404);
			}

			const countryPath = `${_.kebabCase(country.name)}.json`;
			const countryData: iCountry = await storage.getItem(countryPath);
			const mappedCountry = mapCountryData(countryData);
			const stateParam = getRouterParam(event, "state")?.toLowerCase();
			const stateData = countryData.states?.find(({ name, state_code }) => {
				const matchable = [...getMatches(name), state_code];

				return matchable.map((v) => v.toLowerCase()).includes(stateParam);
			});

			// State does not exist
			if (!stateData) {
				return JsonResponse(
					`No state with the given data was found within "${mappedCountry.name}"`,
					404
				);
			}

			const withCountry = typeof query.country === "string";
			const mappedState = mapStateData(stateData);

			if (withCountry) mappedState.country = mappedCountry;

			// Specific state
			return JsonResponse(mappedState);
		} catch (error) {
			// handle unexpected errors
			if (process.env.DEBUG) console.error(error);

			return JsonResponse("Something went wrong", 500);
		}
	},
	{ maxAge }
);
