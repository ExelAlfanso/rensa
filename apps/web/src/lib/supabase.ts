import { createClient } from "@supabase/supabase-js";

const readRequiredEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

export const supabase = createClient(
	readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
	readRequiredEnv("SUPABASE_PUBLISHABLE_KEY")
);

export const supabaseAdmin = createClient(
	readRequiredEnv("SUPABASE_URL"),
	readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
);
