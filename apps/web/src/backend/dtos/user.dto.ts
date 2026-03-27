import { z } from "zod";

export const userResponseDto = z.object({
	user_id: z.string(),
	email: z.string(),
	username: z.string(),
	role: z.enum(["user", "admin"]),
	created_at: z.string(),
	updated_at: z.string(),
});

export const userCreateDto = userResponseDto.omit({
	user_id: true,
	created_at: true,
	updated_at: true,
});

export const userUpdateDto = userResponseDto
	.omit({
		user_id: true,
		email: true,
		role: true,
		created_at: true,
		updated_at: true,
	})
	.partial();

export const userLoginDto = z.object({
	email: z.string(),
	password: z.string(),
});
export const userRegisterDto = z.object({
	email: z.string(),
	username: z.string(),
	password: z.string(),
	confirmPassword: z.string(),
});
export type UserCreateDto = z.infer<typeof userCreateDto>;
export type UserUpdateDto = z.infer<typeof userUpdateDto>;
export type UserResponseDto = z.infer<typeof userResponseDto>;
export type UserLoginDto = z.infer<typeof userLoginDto>;
export type UserRegisterDto = z.infer<typeof userRegisterDto>;
