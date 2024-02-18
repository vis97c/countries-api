/* eslint-disable import/no-unresolved */
import { defineEventHandler, setResponseHeaders } from "#imports";

interface iIP {
	blockUntil: number;
	accessTimes: number[];
}

const requestQuantity = Number(process.env.REQUEST_QUANTITY) || 9;
const requestTime = Number(process.env.REQUEST_TIME) || 3000;
const requestBlockTime = Number(process.env.REQUEST_BLOCK_TIME) || 10000;

class AccessLogger {
	private requests: Record<string, iIP> = {};

	/**
	 * Access logger constructor
	 * @param quantity How many times can a request be made within the time span given
	 * @param time The time span
	 * @param blockTime If the limit is reached for how much time block the ip
	 */
	constructor(
		private quantity: number,
		private time: number,
		private blockTime: number
	) {
		// schedule cleanup on a regular interval (every 30 minutes)
		setInterval(this.age, 30 * 60 * 1000);
	}

	private age() {
		// clean up any accesses that have not been here within this.time and are not currently blocked
		const now = Date.now();
		const limit = now - this.time;

		for (const ip in this.requests) {
			const { accessTimes, blockUntil } = this.requests[ip];

			// if not currently blocking this one
			if (blockUntil >= now) continue;

			// if newest access is older than time limit, then nuke the whole item
			if (!accessTimes.length || accessTimes[accessTimes.length - 1] < limit) {
				delete this.requests[ip];
			} else {
				// in case an ip is regularly visiting so its recent access is never old
				// we must age out older access times to keep them from
				// accumulating forever
				if (accessTimes.length > this.quantity * 2 && accessTimes[0] < limit) {
					let index = 0;

					for (let i = 1; i < accessTimes.length; i++) {
						if (accessTimes[i] < limit) {
							index = i;
						} else {
							break;
						}
					}

					// remove index + 1 old access times from the front of the array
					accessTimes.splice(0, index + 1);
				}
			}
		}
	}
	private add(ip: string) {
		if (!this.requests[ip]) this.requests[ip] = { accessTimes: [], blockUntil: 0 };

		// push this access time into the access array for this IP
		this.requests[ip].accessTimes.push(Date.now());
	}
	public check(ip: string) {
		// add this access
		this.add(ip);

		// should always be an info here because we just added it
		const { accessTimes, blockUntil } = this.requests[ip];
		// calc time limits
		const now = Date.now();
		const limit = now - this.time;
		let count = 0;

		// short circuit if already blocking this ip
		if (blockUntil >= now) return false;
		// short circuit an access that has not even had max quantity accesses yet
		if (accessTimes.length < this.quantity) return true;

		for (let i = accessTimes.length - 1; i >= 0; i--) {
			if (accessTimes[i] > limit) {
				++count;

				continue;
			}

			// assumes counts are in time order so no need to look any more
			break;
		}

		if (count > this.quantity) {
			// block from now until (now + this.blockTime)
			this.requests[ip].blockUntil = now + this.blockTime;

			return false;
		}

		return true;
	}
}

/** 9 request every 3 second, then wait for 10 seconds */
const logger = new AccessLogger(requestQuantity, requestTime, requestBlockTime);

export default defineEventHandler((event) => {
	const ip =
		event.node.req.headers["forwarded"] ||
		event.node.req.connection.remoteAddress ||
		event.node.req.socket.remoteAddress;

	console.log(ip);

	if (ip && !logger.check(ip)) {
		// cancel the request here
		setResponseStatus(event, 429);
		setResponseHeaders(event, { "Retry-After": requestBlockTime });

		// 400 by default when a error message is provided
		return { error: "Too many requests", data: null };
	}
});
