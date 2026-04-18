import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const contactStatusEnum = pgEnum("contact_status", [
	"new",
	"read",
	"responded",
]);

export const bugSeverityEnum = pgEnum("bug_severity", [
	"low",
	"medium",
	"high",
	"critical",
]);

export const bugStatusEnum = pgEnum("bug_status", [
	"new",
	"investigating",
	"acknowledged",
	"resolved",
	"closed",
]);

export const users = pgTable("users", {
	userId: uuid("user_id").primaryKey().defaultRandom(),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	avatar: text("avatar"),
	role: userRoleEnum("role").default("user"),
	verified: boolean("verified").default(false),
	passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const photos = pgTable(
	"photos",
	{
		photoId: uuid("photo_id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.userId, {
			onDelete: "cascade",
		}),
		url: text("url").notNull(),
		title: text("title").notNull(),
		description: text("description"),
		category: text("category"),
		style: text("style"),
		color: text("color"),
		camera: text("camera"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_photos_user").on(table.userId)]
);

export const photoMetadata = pgTable("photo_metadata", {
	photoMetadataId: uuid("photo_metadata_id")
		.primaryKey()
		.references(() => photos.photoId, { onDelete: "cascade" }),
	width: integer("width"),
	height: integer("height"),
	format: text("format"),
	size: integer("size"),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
});

export const comments = pgTable(
	"comments",
	{
		commentId: uuid("comment_id").primaryKey().defaultRandom(),
		photoId: uuid("photo_id").references(() => photos.photoId, {
			onDelete: "cascade",
		}),
		userId: uuid("user_id").references(() => users.userId, {
			onDelete: "cascade",
		}),
		text: text("text").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [
		index("idx_comments_photo").on(table.photoId),
		index("idx_comments_user").on(table.userId),
	]
);

export const rolls = pgTable(
	"rolls",
	{
		rollId: uuid("roll_id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.userId, {
			onDelete: "cascade",
		}),
		name: text("name").notNull(),
		description: text("description"),
		imageUrl: text("image_url"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_rolls_user").on(table.userId)]
);

export const rollPhotos = pgTable(
	"roll_photos",
	{
		rollId: uuid("roll_id").references(() => rolls.rollId, {
			onDelete: "cascade",
		}),
		photoId: uuid("photo_id").references(() => photos.photoId, {
			onDelete: "cascade",
		}),
	},
	(table) => [primaryKey({ columns: [table.rollId, table.photoId] })]
);

export const contacts = pgTable(
	"contacts",
	{
		contactId: uuid("contact_id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		subject: text("subject").notNull(),
		message: text("message").notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		status: contactStatusEnum("status").default("new"),
		respondedAt: timestamp("responded_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_contacts_email").on(table.email)]
);

export const bugReports = pgTable(
	"bug_reports",
	{
		bugReportId: uuid("bug_report_id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		email: text("email").notNull(),
		description: text("description").notNull(),
		steps: text("steps"),
		expectedBehavior: text("expected_behavior"),
		actualBehavior: text("actual_behavior"),
		browser: text("browser"),
		attachments: text("attachments"),
		severity: bugSeverityEnum("severity").default("medium"),
		status: bugStatusEnum("status").default("new"),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [index("idx_bug_reports_email").on(table.email)]
);

export const bookmarks = pgTable(
	"bookmarks",
	{
		bookmarkId: uuid("bookmark_id").primaryKey().defaultRandom(),
		photoId: uuid("photo_id").references(() => photos.photoId, {
			onDelete: "cascade",
		}),
		userId: uuid("user_id").references(() => users.userId, {
			onDelete: "cascade",
		}),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [
		unique("bookmarks_photo_id_user_id_unique").on(table.photoId, table.userId),
		index("idx_bookmarks_photo").on(table.photoId),
	]
);

// NextAuth tables used by DrizzleAdapter
export const authUsers = pgTable("auth_users", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: timestamp("email_verified", { withTimezone: true }),
	image: text("image"),
});

export const authAccounts = pgTable(
	"auth_accounts",
	{
		userId: text("user_id")
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
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

export const authSessions = pgTable("auth_sessions", {
	sessionToken: text("session_token").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => authUsers.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const authVerificationTokens = pgTable(
	"auth_verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { withTimezone: true }).notNull(),
	},
	(table) => [primaryKey({ columns: [table.identifier, table.token] })]
);
