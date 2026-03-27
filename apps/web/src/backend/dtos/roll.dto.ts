import { z } from "zod";

export const rollResponseDto = z.object({
	roll_id: z.string(),
	user_id: z.string(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const rollCreateDto = rollResponseDto.omit({
	roll_id: true,
	user_id: true,
	created_at: true,
	updated_at: true,
});
export const rollUpdateDto = rollResponseDto
	.omit({
		roll_id: true,
		user_id: true,
		created_at: true,
		updated_at: true,
	})
	.partial();

export type RollCreateDto = z.infer<typeof rollCreateDto>;
export type RollUpdateDto = z.infer<typeof rollUpdateDto>;
export type RollResponseDto = z.infer<typeof rollResponseDto>;
