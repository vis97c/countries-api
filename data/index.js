import fsp from "fs/promises";
import fs from "fs";
import path from "path";
import _ from "lodash";

/**
 * Write file
 * @param {string} filePath
 * @param {*} data
 */
async function writeFile(filePath, data) {
	await fsp.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Make dir
 *
 * @param {string[]} dirPaths
 * @param {function(number)} callback
 */
async function makeDir(dirPaths, callback) {
	if (await Promise.all(dirPaths.map((dirPath) => fsp.mkdir(dirPath, { recursive: true })))) {
		return callback(Date.now());
	}

	throw new Error("Couldn't create directories");
}

/**
 * Main
 *
 * Data source:
 * @see https://github.com/dr5hn/countries-states-cities-database/blob/master/countries+states+cities.json
 */
(async function () {
	const start = Date.now();
	let processed = 0;
	let proccessTime = 0;
	const file = "countries+states+cities.json";
	const countries = JSON.parse(
		await fsp.readFile(path.join("data", file), {
			encoding: "utf8",
		})
	);
	const countriesPath = "src/runtime/countries";

	if (fs.existsSync(path.join(countriesPath, "index.json"))) {
		console.log("Countries already built, omiting");

		return;
	}

	makeDir([countriesPath], async (countryStart) => {
		for (const country of countries) {
			const countryPath = path.join(countriesPath, _.kebabCase(country.name));

			console.log(
				`Creating file for ${country.name}, which has ${country.states.length} states`
			);

			// write country
			await writeFile(`${countryPath}.json`, country);

			const countryProcessTime = Date.now() - countryStart;

			processed += 1;
			proccessTime += countryProcessTime;

			console.log(
				"\x1b[33m%s\x1b[0m",
				`Done with ${country.name} in ${countryProcessTime}ms`
			);

			// last country
			if (processed === countries.length) {
				// write countries index
				await writeFile(
					path.join(countriesPath, "index.json"),
					countries.map(({ id, name, iso2, phone_code, translations }) => ({
						id,
						name,
						iso2,
						phone_code,
						translations,
					}))
				);

				// time output
				console.log(
					"\x1b[34m%s\x1b[0m",
					`Processed in ${Date.now() - start}ms, with a machine time of ${proccessTime}ms`
				);
			}
		}
	});
})();
