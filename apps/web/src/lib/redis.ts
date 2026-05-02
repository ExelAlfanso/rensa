import Redis from "ioredis";

const REDIS_URL =
	process.env.REDIS_URL ??
	process.env.UPSTASH_REDIS_URL ??
	process.env.KV_URL ??
	process.env.REDIS_TLS_URL;

declare global {
	var __rensaRedis: Redis | undefined;
}

export function getRedis() {
	if (!REDIS_URL) {
		throw new Error(
			"Redis connection URL is not configured. Set REDIS_URL to your Redis URI."
		);
	}

	if (!globalThis.__rensaRedis) {
		globalThis.__rensaRedis = new Redis(REDIS_URL, {
			maxRetriesPerRequest: 3,
		});
	}

	return globalThis.__rensaRedis;
}

export default getRedis;
