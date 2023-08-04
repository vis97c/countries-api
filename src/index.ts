import express from "express";
import path from "node:path";
import monitor from "express-status-monitor";
import _ from "lodash";

import type { iCity, iCountry, iState } from "./types";
import { makeJsonResponse, makeMapCountryData, getJson, mapStateData, mapCityData } from "./utils";

const app = express();
const port = process.env.PORT || 3000;
const supportedLangs = ["kr", "pt", "nl", "hr", "fa", "de", "es", "fr", "ja", "it", "cn", "tr"];

if (process.env.DEBUG) app.use(monitor());

/**
 * Root
 */
app.get("/", function (req, res) {
	res.status(200).sendFile(path.join(__dirname, "../public/index.html"));
});

/**
 * Countries endpoint
 * TODO: add property filters
 *
 * Data by country
 */
app.get("/api/v1/:country?/:state?/:city?", async function (req, res) {
	const JsonRes = makeJsonResponse(res);
	const lang = req.query.lang;
	const withStates = typeof req.query.states === "string";
	const withCities = typeof req.query.cities === "string";

	// Check for lang errors
	if (lang) {
		if (typeof lang !== "string") return JsonRes("Non supported lang format was given");
		else if (!supportedLangs.includes(lang)) {
			const langs = supportedLangs.join(", ");

			return JsonRes(`Given language is not supported, supported translations are: ${langs}`);
		}
	}

	const mapCountryData = makeMapCountryData(lang);
	const countryParam = req.params.country?.toLowerCase();
	const countries: Array<iCountry> = await getJson("countries/index");

	// All countries
	if (!countryParam) return JsonRes(countries.map((country) => mapCountryData(country)));

	const country = countries.find(({ name, iso2, translations }) => {
		const matchable = [iso2, name, _.startCase(name), ...Object.values(translations)];

		return matchable.map((v) => v.toLowerCase()).includes(countryParam);
	});

	// Country does not exist
	if (!country) return JsonRes("No country with the given code or name was found");

	const countryPath = path.join("countries", _.kebabCase(country.name));
	const statesPath = path.join(countryPath, "states");
	const stateParam = req.params.state?.toLowerCase();

	// Specific country
	if (!stateParam) {
		const countryData: iCountry = await getJson(path.join(countryPath, "index"));

		return JsonRes(mapCountryData(countryData, withStates, withCities));
	}

	const states: iState[] = await getJson(path.join(statesPath, "index"));
	const state = states.find(({ name, state_code }) => {
		const matchable = [state_code, name, _.startCase(name)];

		return matchable.map((v) => v.toLowerCase()).includes(stateParam);
	});

	// State does not exist
	if (!state) {
		const { name } = mapCountryData(country);

		return JsonRes(`No state with the given code or name was found within "${name}"`);
	}

	const statePath = path.join(statesPath, _.kebabCase(state.name));
	const citiesPath = path.join(statePath, "cities");
	const cityParam = req.params.city?.toLowerCase();

	// Specific state
	if (!cityParam) {
		const stateData: iState = await getJson(path.join(statePath, "index"));

		return JsonRes(mapStateData(stateData, withCities));
	}

	const cities: iCity[] = await getJson(path.join(citiesPath, "index"));
	const city = cities.find(({ name }) => {
		const matchable = [name, _.startCase(name)];

		return matchable.map((v) => v.toLowerCase()).includes(cityParam);
	});

	// City does not exist
	if (!city) {
		return JsonRes(`No city with the given code or name was found within "${state.name}"`);
	}

	// Specific city
	const cityPath = path.join(citiesPath, _.kebabCase(city.name));
	const cityData: iCity = await getJson(cityPath);

	return JsonRes(mapCityData(cityData));
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
