import express from "express";
import path from "node:path";
import monitor from "express-status-monitor";
import _ from "lodash";

import CountryStateCityHandler from "./api/country-state-city";
import CacheHandler from "./cache";
import AccessLogger from "./access";
import { makeJsonResponse } from "./utils";

const app = express();
const port = process.env.PORT || 3000;
const requestQuantity = Number(process.env.REQUEST_QUANTITY) || 9;
const requestTime = Number(process.env.REQUEST_TIME) || 3000;
const requestBlockTime = Number(process.env.REQUEST_BLOCK_TIME) || 10000;
/** Request chache in seconds */
const requestCache = Number(process.env.REQUEST_CACHE) || 60 * 60 * 24;
/** 9 request every 3 second, then wait for 10 seconds */
const logger = new AccessLogger(requestQuantity, requestTime, requestBlockTime);

/** Allow monitoring '/status' */
if (process.env.DEBUG) app.use(monitor());

/** Limits the number of request from any ip */
app.use(function (req, res, next) {
	const JsonResponse = makeJsonResponse(res);

	if (!logger.check(req.ip)) {
		// cancel the request here
		return JsonResponse("Too many requests", 429, { "Retry-After": requestBlockTime });
	}
	next();
});

/**
 * Public
 *
 * @static
 */
app.use(express.static(path.join(__dirname, "../public")));

/**
 * Countries endpoint, data by country
 *
 * @endpoint
 */
app.get("/api/v1/:country?/:state?/:city?", CacheHandler(requestCache), CountryStateCityHandler);

/** Boot server up */
app.listen(port, () => {
	if (process.env.DEBUG) console.log(`Listening on http://localhost:${port}/`);
});
