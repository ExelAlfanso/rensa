import { index, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { photos } from "./photos";
import { users } from "./users";

export const bookmarks = pgTable(
	"bookmarks",
	{
		bookmark_id: uuid("bookmark_id").primaryKey().defaultRandom(),
		photo_id: uuid("photo_id").references(() => photos.photo_id, {
			onDelete: "cascade",
		}),
		user_id: uuid("user_id").references(() => users.user_id, {
			onDelete: "cascade",
		}),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [
		unique("bookmarks_photo_id_user_id_unique").on(
			table.photo_id,
			table.user_id
		),
		index("idx_bookmarks_photo").on(table.photo_id),
	]
);

export interface BookmarkActionDto {
	action: "increment" | "decrement";
	user_id: string;
}
