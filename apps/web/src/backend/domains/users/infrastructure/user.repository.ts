import type {
	UserRegisterDto,
	UserResponseDto,
	UserWithPasswordResponseDto,
} from "@/backend/dtos/user.dto";
import type { UserRepositoryInterface } from "@/backend/interfaces/user-repository.interface";
import { supabaseAdmin } from "@/lib/supabase";

// interface UserRow {
// 	avatar: string | null;
// 	created_at: string | null;
// 	email: string;
// 	role: "admin" | "user" | null;
// 	updated_at: string | null;
// 	user_id: string;
// 	username: string;
// 	verified: boolean | null;
// }

// interface BookmarkRow {
// 	photo_id: string;
// }

const NO_ROWS_CODE = "PGRST116";

const isNoRowsError = (error: { code?: string } | null): boolean =>
	error?.code === NO_ROWS_CODE;

export class UserRepository implements UserRepositoryInterface {
	private async getBookmarkPhotoIds(userId: string): Promise<string[]> {
		const { data: result, error } = await supabaseAdmin
			.from("bookmarks")
			.select("photo_id")
			.eq("user_id", userId);
		if (error) {
			throw new Error(`Failed to fetch user bookmarks: ${error.message}`);
		}

		return result.map((row) => row.photo_id);
	}

	async create(user: UserRegisterDto): Promise<UserResponseDto> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.insert({
				email: user.email,
				password: user.password,
				role: "user",
				username: user.username,
				verified: false,
			})
			.select(
				"user_id,email,username,avatar,role,verified,created_at,updated_at"
			)
			.single();
		if (error || !data) {
			throw new Error(`Failed to create user: ${error?.message ?? "No data"}`);
		}

		return {
			...data,
			bookmarks: await this.getBookmarkPhotoIds(data.user_id),
		} as UserResponseDto;
	}

	async getById(id: string): Promise<UserResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.select(
				"user_id,email,username,avatar,role,verified,created_at,updated_at"
			)
			.eq("user_id", id)
			.single();
		if (error) {
			throw new Error(`Failed to fetch user by ID: ${error.message}`);
		}
		return {
			...data,
			bookmarks: await this.getBookmarkPhotoIds(id),
		} as UserResponseDto | null;
	}

	async getByEmail(email: string): Promise<UserWithPasswordResponseDto | null> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.select(
				"user_id,email,username,avatar,role,verified,created_at,updated_at,password"
			)
			.eq("email", email)
			.single();
		if (isNoRowsError(error)) {
			return null;
		}
		if (error || !data) {
			throw new Error(
				`Failed to fetch user by email: ${error?.message ?? "No data"}`
			);
		}

		return {
			...data,
			bookmarks: await this.getBookmarkPhotoIds(data.user_id),
		} as UserWithPasswordResponseDto | null;
	}

	async updateBookmarks(
		userId: string,
		photoId: string,
		action: "increment" | "decrement"
	): Promise<UserResponseDto | null> {
		if (action === "increment") {
			const { error } = await supabaseAdmin.from("bookmarks").upsert(
				{
					photo_id: photoId,
					user_id: userId,
				},
				{
					ignoreDuplicates: true,
					onConflict: "photo_id,user_id",
				}
			);
			if (error) {
				throw new Error(`Failed to add bookmark: ${error.message}`);
			}
		} else {
			const { error } = await supabaseAdmin
				.from("bookmarks")
				.delete()
				.eq("photo_id", photoId)
				.eq("user_id", userId);
			if (error) {
				throw new Error(`Failed to remove bookmark: ${error.message}`);
			}
		}

		return this.getById(userId);
	}
}
