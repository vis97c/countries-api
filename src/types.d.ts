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
	 * @default "/api/countries"
	 */
	base?: string;
}
