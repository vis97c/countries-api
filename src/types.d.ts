export type tSupportedLangs =
	| "kr"
	| "pt"
	| "nl"
	| "hr"
	| "fa"
	| "de"
	| "es"
	| "fr"
	| "ja"
	| "it"
	| "cn"
	| "tr";

export interface iCity {
	state?: Omit<iState, "cities">;
	country?: Omit<iCountry, "states">;
	// intenals
	name: string;
}

export interface iState {
	cities?: iCity[];
	country?: Omit<iCountry, "states">;
	// intenals
	name: string;
	state_code: string;
}

export interface iCountry {
	states?: iState[];
	// intenals
	name: string;
	iso2: string;
	iso3?: string;
	phone_code: string;
	translations: Record<tSupportedLangs, string>;
	timezones?: Array<Record<string, any>>;
}

/**
 * Nuxt specific configuration
 */
export interface CountriesModuleOptions {
	/**
	 * nuxt server route base
	 *
	 * @default "/_countries"
	 */
	base?: string;
}

export interface iMappedCity {
	name: string;
	state?: iMappedState;
	country?: iMappedCountry;
}

export interface iMappedState {
	name: string;
	code: string;
	cities?: iMappedCity[];
	country?: iMappedCountry;
}

export interface iMappedCountry {
	name: string;
	code: string;
	indicative: string;
	states?: iMappedState[];
}

export interface iJsonResponse<T> {
	error: string | null;
	data: T | null;
}
