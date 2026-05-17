import { and, eq } from "drizzle-orm";
import { bookmarks } from "../schemas/bookmarks";
import {
	type UserProfileDto,
	type UserRegisterDto,
	type UserRepositoryInterface,
	type UserResponseDto,
	type UserWithPasswordResponseDto,
	users,
} from "../schemas/users";
import db from "../src/db";

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

export class UserRepository implements UserRepositoryInterface {
	private async getBookmarkPhotoIds(user_id: string): Promise<string[]> {
		const rows = await db
			.select({ photo_id: bookmarks.photo_id })
			.from(bookmarks)
			.where(eq(bookmarks.user_id, user_id));

		return rows
			.map((row) => row.photo_id)
			.filter((value): value is string => Boolean(value));
	}

	async create(user: UserRegisterDto): Promise<UserResponseDto> {
		const [created] = await db
			.insert(users)
			.values({
				email: user.email,
				password: user.password,
				role: "user",
				username: user.username,
				verified: false,
			})
			.returning();
		if (!created) {
			throw new Error("Failed to create user");
		}

		return {
			avatar: created.avatar ?? "",
			bookmarks: await this.getBookmarkPhotoIds(created.user_id),
			created_at: toIso(created.created_at),
			email: created.email,
			role: created.role ?? "user",
			updated_at: toIso(created.updated_at),
			user_id: created.user_id,
			username: created.username,
			verified: created.verified ?? false,
		};
	}

	async getById(id: string): Promise<UserResponseDto | null> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.user_id, id))
			.limit(1);
		if (!row) {
			return null;
		}

		return {
			avatar: row.avatar ?? "",
			bookmarks: await this.getBookmarkPhotoIds(id),
			created_at: toIso(row.created_at),
			email: row.email,
			role: row.role ?? "user",
			updated_at: toIso(row.updated_at),
			user_id: row.user_id,
			username: row.username,
			verified: row.verified ?? false,
		};
	}

	async getByEmail(email: string): Promise<UserWithPasswordResponseDto | null> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		if (!row) {
			return null;
		}

		return {
			avatar: row.avatar ?? "",
			bookmarks: await this.getBookmarkPhotoIds(row.user_id),
			created_at: toIso(row.created_at),
			email: row.email,
			password: row.password,
			role: row.role ?? "user",
			updated_at: toIso(row.updated_at),
			user_id: row.user_id,
			username: row.username,
			verified: row.verified ?? false,
		};
	}

	async getProfileById(id: string): Promise<UserProfileDto | null> {
		const [row] = await db
			.select({
				avatar: users.avatar,
				email: users.email,
				user_id: users.user_id,
				username: users.username,
			})
			.from(users)
			.where(eq(users.user_id, id))
			.limit(1);
		if (!row) {
			return null;
		}

		return {
			avatar: row.avatar ?? undefined,
			email: row.email,
			id: row.user_id,
			username: row.username,
		};
	}

	async updateProfile(params: {
		avatar: string;
		email: string;
		user_id: string;
		username: string;
	}): Promise<UserProfileDto | null> {
		const [row] = await db
			.update(users)
			.set({
				avatar: params.avatar,
				email: params.email,
				updated_at: new Date(),
				username: params.username,
			})
			.where(eq(users.user_id, params.user_id))
			.returning({
				avatar: users.avatar,
				email: users.email,
				user_id: users.user_id,
				username: users.username,
			});
		if (!row) {
			return null;
		}

		return {
			avatar: row.avatar ?? undefined,
			email: row.email,
			id: row.user_id,
			username: row.username,
		};
	}

	async verifyEmail(email: string): Promise<boolean> {
		const [updated] = await db
			.update(users)
			.set({
				updated_at: new Date(),
				verified: true,
			})
			.where(eq(users.email, email))
			.returning({ id: users.user_id });

		return Boolean(updated);
	}

	async resetPassword(params: {
		email: string;
		password: string;
		user_id: string;
	}): Promise<boolean> {
		const [updated] = await db
			.update(users)
			.set({
				password: params.password,
				password_changed_at: new Date(),
				updated_at: new Date(),
			})
			.where(
				and(eq(users.email, params.email), eq(users.user_id, params.user_id))
			)
			.returning({ id: users.user_id });

		return Boolean(updated);
	}

	async updateBookmarks(
		user_id: string,
		photo_id: string,
		action: "increment" | "decrement"
	): Promise<UserResponseDto | null> {
		if (action === "increment") {
			await db
				.insert(bookmarks)
				.values({
					photo_id,
					user_id,
				})
				.onConflictDoNothing({
					target: [bookmarks.photo_id, bookmarks.user_id],
				});
		} else {
			await db
				.delete(bookmarks)
				.where(
					and(eq(bookmarks.photo_id, photo_id), eq(bookmarks.user_id, user_id))
				);
		}

		return this.getById(user_id);
	}
}
