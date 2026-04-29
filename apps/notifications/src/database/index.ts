import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import { notifications, notificationTypeEnum } from "./schema";

const schema = { notificationTypeEnum, notifications };

export const pool = new Pool({
	connectionString: env.databaseUrl,
});

export const db = drizzle(pool, { schema });

let isConnected = false;

export async function connectDatabase() {
	if (isConnected) {
		return;
	}

	const client = await pool.connect();
	try {
		await client.query("select 1");
		isConnected = true;
		console.log("PostgreSQL connected");
	} finally {
		client.release();
	}
}
