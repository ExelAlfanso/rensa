import {
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("auth_users", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: timestamp("email_verified", { withTimezone: true }),
	image: text("image"),
});

export const accounts = pgTable(
	"auth_accounts",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(table) => [
		primaryKey({
			columns: [table.provider, table.providerAccountId],
		}),
	]
);

export const sessions = pgTable("auth_sessions", {
	sessionToken: text("session_token").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
	"auth_verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { withTimezone: true }).notNull(),
	},
	(table) => [primaryKey({ columns: [table.identifier, table.token] })]
);
