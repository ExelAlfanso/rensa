import { z } from "zod";

const photoResponseDto = z.object({
	photo_id: z.string(),
	user_id: z.string(),
	image_url: z.string(),
	bookmarks: z.number(),
	title: z.string(),
	description: z.string(),
	tags: z.array(z.string()),
	metadata: z.object({
		width: z.number(),
		height: z.number(),
		format: z.string(),
		size: z.number(),
		exif: z.record(z.string(), z.string()),
		uploaded_at: z.string(),
	}),
	created_at: z.string(),
	updated_at: z.string(),
});

const createPhotoDto = photoResponseDto.omit({
	photo_id: true,
	created_at: true,
	updated_at: true,
});
const updatePhotoDto = photoResponseDto.partial().omit({
	photo_id: true,
	user_id: true,
	metadata: true,
	created_at: true,
	updated_at: true,
});

export type PhotoResponseDto = z.infer<typeof photoResponseDto>;
export type CreatePhotoDto = z.infer<typeof createPhotoDto>;
export type UpdatePhotoDto = z.infer<typeof updatePhotoDto>;
