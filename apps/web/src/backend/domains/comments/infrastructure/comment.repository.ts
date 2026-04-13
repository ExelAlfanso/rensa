import type { CommentResponseDto } from "@/backend/dtos/comment.dto";
import type {
	CommentRepositoryInterface,
	ListCommentsResult,
} from "@/backend/interfaces/comment-repository.interface";
import { supabaseAdmin } from "@/lib/supabase";

interface CommentInsertRow {
	photo_id: string;
	text: string;
	user_id: string;
}

interface CommentListRow {
	comment_id: string;
	created_at: string | null;
	photo_id: string;
	text: string;
	updated_at: string | null;
	user_id: string;
	users:
		| {
				avatar: string | null;
				user_id: string;
				username: string;
		  }
		| {
				avatar: string | null;
				user_id: string;
				username: string;
		  }[]
		| null;
}

export class CommentRepository implements CommentRepositoryInterface {
	async create(params: {
		photoId: string;
		userId: string;
		text: string;
	}): Promise<CommentResponseDto> {
		const payload: CommentInsertRow = {
			photo_id: params.photoId,
			user_id: params.userId,
			text: params.text,
		};
		const { data, error } = await supabaseAdmin
			.from("comments")
			.insert(payload)
			.select("comment_id,photo_id,user_id,text,created_at,updated_at")
			.single();
		if (error || !data) {
			throw new Error(
				`Failed to create comment: ${error?.message ?? "No data"}`
			);
		}

		return {
			_id: data.comment_id,
			photoId: data.photo_id,
			userId: data.user_id,
			text: data.text,
			createdAt: data.created_at ?? undefined,
			updatedAt: data.updated_at ?? undefined,
		};
	}

	async listByPhotoId(params: {
		photoId: string;
		offset: number;
		limit: number;
	}): Promise<ListCommentsResult> {
		const from = params.offset;
		const to = from + params.limit - 1;
		const { data, error } = await supabaseAdmin
			.from("comments")
			.select(
				"comment_id,photo_id,user_id,text,created_at,updated_at,users:user_id(user_id,username,avatar)"
			)
			.eq("photo_id", params.photoId)
			.order("created_at", { ascending: true })
			.range(from, to);
		if (error) {
			throw new Error(`Failed to list comments: ${error.message}`);
		}

		const { count, error: countError } = await supabaseAdmin
			.from("comments")
			.select("comment_id", { count: "exact", head: true })
			.eq("photo_id", params.photoId);
		if (countError) {
			throw new Error(`Failed to count comments: ${countError.message}`);
		}

		const comments = ((data ?? []) as CommentListRow[]).map((row) => {
			const rawUser = Array.isArray(row.users) ? row.users[0] : row.users;
			const user =
				rawUser && rawUser.user_id
					? {
							_id: rawUser.user_id,
							username: rawUser.username,
							avatarUrl: rawUser.avatar ?? undefined,
						}
					: row.user_id;

			return {
				_id: row.comment_id,
				photoId: row.photo_id,
				userId: user,
				text: row.text,
				createdAt: row.created_at ?? undefined,
				updatedAt: row.updated_at ?? undefined,
			};
		});

		return {
			comments: comments as CommentResponseDto[],
			total: count ?? 0,
		};
	}
}
