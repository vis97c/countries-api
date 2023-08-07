import type { RequestHandler } from "express";
import cache from "memory-cache";

export default function CacheHandler(duration: number): RequestHandler {
	return function handler(req, res, next) {
		const key = "__express__" + req.originalUrl || req.url;
		const cachedBody = cache.get(key);

		if (cachedBody) {
			// send cached response
			if (process.env.DEBUG) console.log(`Serve cached response: ${req.originalUrl}`);

			res.send(cachedBody);
		} else {
			// save original send function
			if (process.env.DEBUG) console.log(`Process new response: ${req.originalUrl}`);

			// override default send function
			res.send = (function (_super) {
				return function (this: any, body) {
					cache.put(key, body, duration * 1000);
					return _super.call(this, body);
				};
			})(res.send);

			// proceed with norma request
			next();
		}
	};
}
