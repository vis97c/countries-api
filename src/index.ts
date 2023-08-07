import express from "express";
import path from "node:path";
import monitor from "express-status-monitor";
import _ from "lodash";
import CountryStateCityHandler from "./api/country-state-city";
import CacheHandler from "./cache";

const app = express();
const port = process.env.PORT || 3000;

if (process.env.DEBUG) app.use(monitor());

/**
 * Public
 */
app.use(express.static(path.join(__dirname, "../public")));

/**
 * Countries endpoint
 * TODO: add property filters
 *
 * Data by country
 */
app.get("/api/v1/:country?/:state?/:city?", CacheHandler(60), CountryStateCityHandler);

app.listen(port, () => {
	if (process.env.DEBUG) console.log(`Listening on http://localhost:${port}/`);
});
