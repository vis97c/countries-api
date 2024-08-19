/* eslint-disable import/no-unresolved */
import _ from "lodash";

import { setResponseStatus } from "#imports";

import type {
	iCity,
	iCountry,
	iJsonResponse,
	iMappedCity,
	iMappedCountry,
	iMappedState,
	iState,
	tSupportedLangs,
} from "../../types";

export const supportedLangs: tSupportedLangs[] = [
	"kr",
	"pt",
	"nl",
	"hr",
	"fa",
	"de",
	"es",
	"fr",
	"ja",
	"it",
	"cn",
	"tr",
];

export function getMatches(name: string): string[] {
	const deburr = _.deburr(name);

	return [
		name,
		deburr,
		_.kebabCase(name),
		_.kebabCase(deburr),
		name.split(" ")[0],
		deburr.split(" ")[0],
	];
}

export function makeJsonResponse(event: any) {
	/**
	 * Returns a JSON response object with the status
	 */
	function JsonResponse<T extends Record<string, any> | Record<string, any>[]>(
		data: T
	): iJsonResponse<T>;
	function JsonResponse<T extends Record<string, any> | Record<string, any>[]>(
		errMsg: string,
		errStatus?: number
	): iJsonResponse<T>;
	function JsonResponse<T extends Record<string, any> | Record<string, any>[]>(
		dataOrErrMsg: string | T,
		errStatus = 400
	): iJsonResponse<T> {
		const error = typeof dataOrErrMsg === "string" ? dataOrErrMsg : null;
		const data: T | null = typeof dataOrErrMsg === "string" ? null : dataOrErrMsg;

		setResponseStatus(event, error ? errStatus : 200);

		// 400 by default when a error message is provided
		return { error, data };
	}

	return JsonResponse;
}

export function mapCityData({ name }: iCity): iMappedCity {
	return { name };
}

export function makeMapStateData(withCities = false) {
	return function mapStateData({ name, state_code, latitude, longitude, cities }: iState) {
		const state: iMappedState = {
			name,
			code: state_code,
			latitude,
			longitude,
		};

		if (withCities) state.cities = (cities || []).map(mapCityData);

		return state;
	};
}

export function makeMapCountryData(lang?: tSupportedLangs, withStates = false, withCities = false) {
	return function mapCountryData({
		name,
		iso2,
		phone_code,
		currency,
		emoji,
		latitude,
		longitude,
		translations,
		states,
	}: iCountry) {
		const country: iMappedCountry = {
			name: (lang && translations[lang]) ?? name,
			indicative: `+${phone_code.replace("+", "")}`,
			currency,
			emoji,
			latitude,
			longitude,
			code: iso2,
		};

		if (withStates) country.states = (states || []).map(makeMapStateData(withCities));

		return country;
	};
}
