import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { photos } from "./photos";
import { users } from "./users";

export const comments = pgTable(
	"comments",
	{
		comment_id: uuid("comment_id").primaryKey().defaultRandom(),
		photo_id: uuid("photo_id").references(() => photos.photo_id, {
			onDelete: "cascade",
		}),
		user_id: uuid("user_id").references(() => users.user_id, {
			onDelete: "cascade",
		}),
		text: text("text").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [
		index("idx_comments_photo").on(table.photo_id),
		index("idx_comments_user").on(table.user_id),
	]
);

export interface CommentResponseDto {
	comment_id: string;
	created_at?: string;
	photo_id: string;
	text: string;
	updated_at?: string;
	user_id:
		| string
		| {
				avatar_url?: string;
				id: string;
				username: string;
		  };
}

export interface CreateCommentDto {
	text: string;
	user_id?: string;
}

export interface ListCommentsResult {
	comments: CommentResponseDto[];
	total: number;
}

export interface CommentRepositoryInterface {
	create(params: {
		photo_id: string;
		text: string;
		user_id: string;
	}): Promise<CommentResponseDto>;
	listByPhotoId(params: {
		limit: number;
		offset: number;
		photo_id: string;
	}): Promise<ListCommentsResult>;
}
