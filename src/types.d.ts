export interface iCity {
	state?: Omit<iState, "cities">;
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
	translations: Record<keyof typeof supportedLangs, string>;
	timezones?: Array<Record<string, any>>;
}
