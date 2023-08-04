import express, { Response } from "express";
import path from "node:path";
import fs from "node:fs";
import monitor from "express-status-monitor";

const app = express();
const port = process.env.PORT || 3000;
const supportedLangs = ["kr", "pt", "nl", "hr", "fa", "de", "es", "fr", "ja", "it", "cn", "tr"];

async function getJson(fileName: string) {
	return JSON.parse(
		await fs.promises.readFile(path.join(__dirname, "../data", `${fileName}.json`), {
			encoding: "utf8",
		})
	);
}

function makeJsonResponse(response: Response) {
	/**
	 * Returns a JSON response object with the status
	 */
	return function JsonResponse(dataOrErrMsg: string | Record<string, any> | any[]) {
		const errorMsg = typeof dataOrErrMsg === "string" ? dataOrErrMsg : null;
		const data = errorMsg ? null : dataOrErrMsg;
		response.status(errorMsg ? 500 : 200).json({ error: errorMsg || null, data });
	};
}

function makeMapCountryData(lang?: string) {
	return function mapCountryData({ name, iso2, phone_code, translations }: Record<string, any>) {
		return {
			name: (lang && translations[lang]) ?? name,
			indicative: phone_code.charAt(0) === "+" ? phone_code : `+${phone_code}`,
			code: iso2,
		};
	};
}

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
 */
app.get("/api/v1/:country?/:state?/:city?", async function (req, res) {
	const JsonRes = makeJsonResponse(res);
	const lang = req.query.lang;

	if (lang) {
		if (typeof lang !== "string") {
			JsonRes("Non supported lang format was given");
			return;
		} else if (!supportedLangs.includes(lang)) {
			JsonRes(
				`Given language is not supported, supported translations are: ${supportedLangs.join(
					", "
				)}`
			);
			return;
		}
	}

	const mapCountryData = makeMapCountryData(lang);
	const countryParam = req.params.country?.toLowerCase();
	const countries: Array<Record<string, any>> = await getJson("countries");

	// Specific country
	if (countryParam) {
		const country = countries.find(({ name, iso2, translations }) => {
			const matchable = [iso2, (lang && translations[lang]) ?? name];
			return matchable.map((v) => v.toLowerCase()).includes(countryParam);
		});

		if (country) JsonRes(mapCountryData(country));
		else JsonRes("No country with the given code or name was found");

		return;
	}

	// All countries
	JsonRes(countries.map(mapCountryData));
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}/`);
});
