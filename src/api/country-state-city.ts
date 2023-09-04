import type { RequestHandler } from "express";
import path from "node:path";
import _ from "lodash";

import type { iCity, iCountry, iState } from "../types";
import {
	makeJsonResponse,
	makeMapCountryData,
	getJson,
	makeMapStateData,
	mapCityData,
} from "../utils";

const supportedLangs = ["kr", "pt", "nl", "hr", "fa", "de", "es", "fr", "ja", "it", "cn", "tr"];

const CountryStateCityHandler: RequestHandler = async function (req, res) {
	const JsonRes = makeJsonResponse(res);

	try {
		const lang = req.query.lang;
		const withStates = typeof req.query.states === "string";
		const withCities = typeof req.query.cities === "string";

		// Check for lang errors
		if (lang) {
			if (typeof lang !== "string") {
				return JsonRes("Non supported lang format was given", 422);
			} else if (!supportedLangs.includes(lang)) {
				const langs = supportedLangs.join(", ");

				return JsonRes(`Unsupported translation, supported ones are: ${langs}`, 422);
			}
		}

		const mapCountryData = makeMapCountryData(lang, withStates, withCities);
		const mapStateData = makeMapStateData(withCities);
		const countriesPath = path.join(__dirname, "../../data/countries");
		const countryParam = req.params.country?.toLowerCase();
		const countries: Array<iCountry> = await getJson(path.join(countriesPath, "index"));

		// All countries
		if (!countryParam) return JsonRes(countries.map(mapCountryData));

		const country = countries.find(({ name, iso2, translations }) => {
			const matchable = [iso2, name, _.startCase(name), ...Object.values(translations)];

			return matchable.map((v) => v.toLowerCase()).includes(countryParam);
		});

		// Country does not exist
		if (!country) return JsonRes("No country with the given data was found", 404);

		const countryPath = path.join(countriesPath, _.kebabCase(country.name));
		const statesPath = path.join(countryPath, "states");
		const stateParam = req.params.state?.toLowerCase();

		// Specific country
		if (!stateParam) {
			const countryData: iCountry = await getJson(path.join(countryPath, "index"));

			return JsonRes(mapCountryData(countryData));
		}

		const states: iState[] = await getJson(path.join(statesPath, "index"));
		const state = states.find(({ name, state_code }) => {
			const matchable = [state_code, name, _.startCase(name)];

			return matchable.map((v) => v.toLowerCase()).includes(stateParam);
		});

		// State does not exist
		if (!state) {
			const { name } = mapCountryData(country);

			return JsonRes(`No state with the given data was found within "${name}"`, 404);
		}

		const statePath = path.join(statesPath, _.kebabCase(state.name));
		const withCountry = typeof req.query.country === "string";
		const citiesPath = path.join(statePath, "cities");
		const cityParam = req.params.city?.toLowerCase();

		// Specific state
		if (!cityParam) {
			const stateData: iState = await getJson(path.join(statePath, "index"));
			const mappedState = mapStateData(stateData);

			if (withCountry) mappedState.country = mapCountryData(country);

			return JsonRes(mappedState);
		}

		const cities: iCity[] = await getJson(path.join(citiesPath, "index"));
		const city = cities.find(({ name }) => {
			const matchable = [name, _.startCase(name)];

			return matchable.map((v) => v.toLowerCase()).includes(cityParam);
		});

		// City does not exist
		if (!city) {
			return JsonRes(`No city with the given data was found within "${state.name}"`, 404);
		}

		const cityPath = path.join(citiesPath, _.kebabCase(city.name));
		const withState = typeof req.query.state === "string";
		const cityData: iCity = await getJson(cityPath);
		const mappedCity = mapCityData(cityData);

		if (withState) mappedCity.state = mapStateData(state);
		if (withCountry) mappedCity.country = mapCountryData(country);

		// Specific city
		return JsonRes(mappedCity);
	} catch (error) {
		// handle unexpected errors
		if (process.env.DEBUG) console.error(error);

		return JsonRes("Something went wrong", 500);
	}
};

export default CountryStateCityHandler;
