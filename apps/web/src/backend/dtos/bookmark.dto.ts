import { z } from "zod";

export const bookmarkResponseDto = z.object({
	bookmark_id: z.string(),
	user_id: z.string(),
	photo_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const createBookmarkDto = bookmarkResponseDto.omit({
	bookmark_id: true,
	created_at: true,
	updated_at: true,
});
export const updateBookmarkDto = bookmarkResponseDto.partial().omit({
	bookmark_id: true,
	user_id: true,
	photo_id: true,
	created_at: true,
	updated_at: true,
});

export const bookmarkActionDto = z.object({
	action: z.enum(["increment", "decrement"]),
	userId: z.uuid(),
});

export type BookmarkResponseDto = z.infer<typeof bookmarkResponseDto>;
export type CreateBookmarkDto = z.infer<typeof createBookmarkDto>;
export type UpdateBookmarkDto = z.infer<typeof updateBookmarkDto>;

