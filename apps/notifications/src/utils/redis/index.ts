import Redis from "ioredis";
import { env } from "../../config/env";

const client = new Redis(env.redisUrl, {
	maxRetriesPerRequest: 3,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	reconnectOnError(err) {
		const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
		if (targetErrors.some((targetError) => err.message.includes(targetError))) {
			return true;
		}
		return false;
	},
});

let isConnected = false;

client.on("connect", () => {
	isConnected = true;
	console.log("Redis connected successfully");
});

client.on("ready", () => {
	isConnected = true;
	console.log("Redis ready");
});

client.on("error", (error) => {
	console.error("Redis connection error:", error.message);
	isConnected = false;
});

client.on("close", () => {
	console.warn("Redis connection closed");
	isConnected = false;
});

export { client as redis };
export const redisConnected = () => isConnected;
