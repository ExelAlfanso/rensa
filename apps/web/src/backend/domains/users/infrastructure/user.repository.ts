import { and, eq } from "drizzle-orm";
import { bookmarks, users } from "@/backend/db/schema";
import type {
	UserRegisterDto,
	UserResponseDto,
	UserWithPasswordResponseDto,
} from "@/backend/dtos/user.dto";
import type { UserRepositoryInterface } from "@/backend/interfaces/user-repository.interface";
import db from "@/lib/drizzle";

const toIso = (value: Date | null): string | undefined =>
	value ? value.toISOString() : undefined;

export class UserRepository implements UserRepositoryInterface {
	private async getBookmarkPhotoIds(userId: string): Promise<string[]> {
		const rows = await db
			.select({ photoId: bookmarks.photoId })
			.from(bookmarks)
			.where(eq(bookmarks.userId, userId));

		return rows
			.map((row) => row.photoId)
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
			user_id: created.userId,
			email: created.email,
			username: created.username,
			avatar: created.avatar ?? "",
			role: created.role ?? "user",
			verified: created.verified ?? false,
			bookmarks: await this.getBookmarkPhotoIds(created.userId),
			createdAt: toIso(created.createdAt),
			updatedAt: toIso(created.updatedAt),
		};
	}

	async getById(id: string): Promise<UserResponseDto | null> {
		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.userId, id))
			.limit(1);
		if (!row) {
			return null;
		}

		return {
			user_id: row.userId,
			email: row.email,
			username: row.username,
			avatar: row.avatar ?? "",
			role: row.role ?? "user",
			verified: row.verified ?? false,
			bookmarks: await this.getBookmarkPhotoIds(id),
			createdAt: toIso(row.createdAt),
			updatedAt: toIso(row.updatedAt),
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
			user_id: row.userId,
			email: row.email,
			username: row.username,
			avatar: row.avatar ?? "",
			role: row.role ?? "user",
			verified: row.verified ?? false,
			bookmarks: await this.getBookmarkPhotoIds(row.userId),
			createdAt: toIso(row.createdAt),
			updatedAt: toIso(row.updatedAt),
			password: row.password,
		};
	}

	async updateBookmarks(
		userId: string,
		photoId: string,
		action: "increment" | "decrement"
	): Promise<UserResponseDto | null> {
		if (action === "increment") {
			await db
				.insert(bookmarks)
				.values({
					photoId,
					userId,
				})
				.onConflictDoNothing({
					target: [bookmarks.photoId, bookmarks.userId],
				});
		} else {
			await db
				.delete(bookmarks)
				.where(
					and(eq(bookmarks.photoId, photoId), eq(bookmarks.userId, userId))
				);
		}

		return this.getById(userId);
	}
}
