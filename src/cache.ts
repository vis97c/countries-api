import type { RequestHandler } from "express";
import cache from "memory-cache";

interface iCachedResponse {
	body: any;
	headers: Record<string, any>;
}

export default function CacheHandler(duration: number): RequestHandler {
	return function handler(req, res, next) {
		const key = "__express__" + req.originalUrl || req.url;
		const cachedResponse: iCachedResponse | undefined = cache.get(key);

		if (cachedResponse) {
			// send cached response
			if (process.env.DEBUG) console.log(`Serve cached response: ${req.originalUrl}`);

			res.set(cachedResponse.headers).send(cachedResponse.body);
		} else {
			// save original send function
			if (process.env.DEBUG) console.log(`Process new response: ${req.originalUrl}`);

			// override default send function
			res.send = (function (_super) {
				return function (this: any, body) {
					cache.put(key, { body, headers: res.getHeaders() }, duration * 1000);
					return _super.call(this, body);
				};
			})(res.send);

			// proceed with norma request
			next();
		}
	};
}
