import { z } from "zod";
import { paginationQueryDto, uuidDto } from "./common.dto";

export const rollResponseDto = z
	.object({
		roll_id: uuidDto,
		user_id: uuidDto,
		name: z.string(),
		description: z.string().default(""),
		imageUrl: z.string().default("/images/image6.JPG"),
		photos: z.array(uuidDto).default([]),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

export const rollCreateDto = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	user_id: uuidDto,
});

export const rollUpdateDto = z
	.object({
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		imageUrl: z.string().optional(),
	})
	.refine(
		(value) =>
			value.name !== undefined ||
			value.description !== undefined ||
			value.imageUrl !== undefined,
		{
			message: "At least one roll field must be provided",
		}
	);

export const rollIdParamDto = z.object({
	rollId: uuidDto,
});

export const photoIdParamDto = z.object({
	photoId: uuidDto,
});

export const listRollsQueryDto = z.object({
	userId: uuidDto,
	sort: z.enum(["latest", "oldest"]).default("latest"),
});

export const listRollPhotosQueryDto = paginationQueryDto;

export const isSavedQueryDto = z.object({
	photoId: uuidDto,
});

export type RollCreateDto = z.infer<typeof rollCreateDto>;
export type RollUpdateDto = z.infer<typeof rollUpdateDto>;
export type RollResponseDto = z.infer<typeof rollResponseDto>;
export type ListRollPhotosQueryDto = z.infer<typeof listRollPhotosQueryDto>;

