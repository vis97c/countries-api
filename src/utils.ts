import type { Response } from "express";
import path from "node:path";
import fs from "node:fs";
import _ from "lodash";

import type { iCity, iCountry, iState } from "./types";

export async function getJson(filePath: string) {
	return JSON.parse(
		await fs.promises.readFile(`${filePath}.json`, {
			encoding: "utf8",
		})
	);
}

export function makeJsonResponse(response: Response) {
	/**
	 * Returns a JSON response object with the status
	 */
	function JsonResponse(data: Record<string, any> | any[]): void;
	function JsonResponse(errMsg: string, errStatus?: number, headers?: Record<string, any>): void;
	function JsonResponse(
		dataOrErrMsg: string | Record<string, any> | any[],
		errStatus: number = 400,
		headers?: Record<string, any>
	): void {
		const errorMsg = typeof dataOrErrMsg === "string" ? dataOrErrMsg : null;
		const data = errorMsg ? null : dataOrErrMsg;

		if (headers) response.set(headers);

		// 400 by default when a error message is provided
		response.status(errorMsg ? errStatus : 200).json({ error: errorMsg || null, data });
	}

	return JsonResponse;
}

export function mapCityData({ name }: iCity) {
	return { name };
}

export function makeMapStateData(withCities: boolean = false) {
	return function mapStateData({ name, state_code, cities }: iState) {
		cities = cities && cities.map(mapCityData);
		return { name, code: state_code, cities: (withCities && cities) || undefined };
	};
}

export function makeMapCountryData(
	lang?: string,
	withStates: boolean = false,
	withCities: boolean = false
) {
	return function mapCountryData({ name, iso2, phone_code, translations, states }: iCountry) {
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
