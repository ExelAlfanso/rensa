import { asc, count, eq } from "drizzle-orm";
import type {
	CommentRepositoryInterface,
	CommentResponseDto,
	ListCommentsResult,
} from "../schemas/comments";
import { comments } from "../schemas/comments";
import { users } from "../schemas/users";
import db from "../src/db";

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

export class CommentRepository implements CommentRepositoryInterface {
	async create(params: {
		photo_id: string;
		user_id: string;
		text: string;
	}): Promise<CommentResponseDto> {
		const [row] = await db
			.insert(comments)
			.values({
				photo_id: params.photo_id,
				text: params.text,
				user_id: params.user_id,
			})
			.returning();
		if (!row) {
			throw new Error("Failed to create comment");
		}

		return {
			comment_id: row.comment_id,
			photo_id: row.photo_id ?? "",
			user_id: row.user_id ?? "",
			text: row.text,
			created_at: toIso(row.created_at),
			updated_at: toIso(row.updated_at),
		};
	}

	async listByPhotoId(params: {
		photo_id: string;
		offset: number;
		limit: number;
	}): Promise<ListCommentsResult> {
		const rows = await db
			.select({
				avatar: users.avatar,
				comment_id: comments.comment_id,
				created_at: comments.created_at,
				photo_id: comments.photo_id,
				text: comments.text,
				updated_at: comments.updated_at,
				user_id: comments.user_id,
				username: users.username,
			})
			.from(comments)
			.leftJoin(users, eq(comments.user_id, users.user_id))
			.where(eq(comments.photo_id, params.photo_id))
			.orderBy(asc(comments.created_at))
			.limit(params.limit)
			.offset(params.offset);

		const [countRow] = await db
			.select({ total: count() })
			.from(comments)
			.where(eq(comments.photo_id, params.photo_id));

		const mapped = rows.map((row) => {
			const user =
				row.user_id && row.username
					? {
							id: row.user_id,
							username: row.username,
							avatar_url: row.avatar ?? undefined,
						}
					: (row.user_id ?? "");

			return {
				comment_id: row.comment_id,
				photo_id: row.photo_id ?? "",
				user_id: user,
				text: row.text,
				created_at: toIso(row.created_at),
				updated_at: toIso(row.updated_at),
			};
		});

		return {
			comments: mapped as CommentResponseDto[],
			total: Number(countRow?.total ?? 0),
		};
	}
}
