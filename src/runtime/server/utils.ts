/* eslint-disable import/no-unresolved */
import _ from "lodash";

import { setResponseStatus } from "#imports";

import type { iCity, iCountry, iState, tSupportedLangs } from "../../types.js";

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

interface iMappedCity {
	name: string;
	state?: iMappedState;
	country?: iMappedCountry;
}

interface iMappedState {
	name: string;
	code: string;
	cities?: iMappedCity[];
	country?: iMappedCountry;
}

interface iMappedCountry {
	name: string;
	code: string;
	indicative: string;
	states?: iMappedState[];
}

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

interface iJsonResponse<T> {
	error: string | null;
	data: T | null;
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
	return function mapStateData({ name, state_code, cities }: iState): iMappedState {
		const mappedCities = cities && cities.map(mapCityData);

		return { name, code: state_code, cities: (withCities && mappedCities) || undefined };
	};
}

export function makeMapCountryData(lang?: tSupportedLangs, withStates = false, withCities = false) {
	return function mapCountryData({
		name,
		iso2,
		phone_code,
		translations,
		states,
	}: iCountry): iMappedCountry {
		const mapStateData = makeMapStateData(withCities);
		const mappedStates = states && states.map(mapStateData);

		return {
			name: (lang && translations[lang]) ?? name,
			indicative: phone_code.charAt(0) === "+" ? phone_code : `+${phone_code}`,
			code: iso2,
			states: (withStates && mappedStates) || undefined,
		};
	};
}
