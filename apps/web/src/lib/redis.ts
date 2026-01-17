import { Redis } from "@upstash/redis";

let redisInstance: ReturnType<typeof Redis.fromEnv> | null = null;

export function getRedis() {
  if (!redisInstance) {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      // Do not attempt to instantiate Redis at build-time if env is missing.
      // Return a stub that will throw when used at runtime to make the error explicit.
      redisInstance = new Proxy(
        {},
        {
          get() {
            throw new Error(
              "Upstash Redis is not configured (UPSTASH_REDIS_REST_URL / _TOKEN)",
            );
          },
        },
      ) as unknown as ReturnType<typeof Redis.fromEnv>;
    } else {
      redisInstance = Redis.fromEnv();
    }
  }

  return redisInstance;
}

export default getRedis;
