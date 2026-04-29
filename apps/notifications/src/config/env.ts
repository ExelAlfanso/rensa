import dotenv from "dotenv";

dotenv.config();

export const env = {
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
	databaseUrl:
		process.env.DATABASE_URL ||
		"postgresql://postgres:postgres@localhost:5432/rensa",
	jwtSecret: process.env.NEXTAUTH_SECRET || "",
	nodeEnv: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT || 3002),
	redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
