import type { Response } from "express";
import path from "node:path";
import fs from "node:fs";
import _ from "lodash";

import type { iCity, iCountry, iState } from "./types";

export async function getJson(fileName: string) {
	return JSON.parse(
		await fs.promises.readFile(path.join(__dirname, "../data", `${fileName}.json`), {
			encoding: "utf8",
		})
	);
}

export function makeJsonResponse(response: Response) {
	/**
	 * Returns a JSON response object with the status
	 */
	return function JsonResponse(dataOrErrMsg: string | Record<string, any> | any[]) {
		const errorMsg = typeof dataOrErrMsg === "string" ? dataOrErrMsg : null;
		const data = errorMsg ? null : dataOrErrMsg;
		response.status(errorMsg ? 500 : 200).json({ error: errorMsg || null, data });
	};
}

export function mapCityData({ name }: iCity) {
	return { name };
}

export function mapStateData({ name, state_code, cities }: iState, withCities: boolean = false) {
	cities = cities && cities.map(mapCityData);
	return { name, code: state_code, cities: (withCities && cities) || undefined };
}

export function makeMapCountryData(lang?: string) {
	return function mapCountryData(
		{ name, iso2, phone_code, translations, states }: iCountry,
		withStates: boolean = false,
		withCities: boolean = false
	) {
		const mappedStates = states && states.map((state) => mapStateData(state, withCities));
		return {
			name: (lang && translations[lang]) ?? name,
			indicative: phone_code.charAt(0) === "+" ? phone_code : `+${phone_code}`,
			code: iso2,
			states: (withStates && mappedStates) || undefined,
		};
	};
}
