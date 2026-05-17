import { PhotoRepository } from "@rensa/db/queries/photo.repository";
import { UserRepository } from "@rensa/db/queries/user.repository";
import type {
	PhotoRepositoryInterface,
	UserRepositoryInterface,
} from "@rensa/db/schema";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "@/backend/common/backend.error";

export class BookmarkService {
	readonly photoRepository: PhotoRepositoryInterface;
	readonly userRepository: UserRepositoryInterface;

	constructor(
		userRepository: UserRepositoryInterface,
		photoRepository: PhotoRepositoryInterface
	) {
		this.userRepository = userRepository;
		this.photoRepository = photoRepository;
	}

	async updateBookmark(params: {
		photo_id: string;
		user_id: string;
		action: "increment" | "decrement";
		actor_id?: string;
	}): Promise<{
		bookmarks: string[];
		is_bookmarked: boolean;
	}> {
		if (!params.actor_id) {
			throw new UnauthorizedError();
		}
		if (params.actor_id !== params.user_id) {
			throw new ForbiddenError("Cannot update bookmarks for another user");
		}

		const photo_exists = await this.photoRepository.exists(params.photo_id);
		if (!photo_exists) {
			throw new NotFoundError("Photo not found");
		}

		const updated_user = await this.userRepository.updateBookmarks(
			params.user_id,
			params.photo_id,
			params.action
		);
		if (!updated_user) {
			throw new NotFoundError("User not found");
		}

		return {
			bookmarks: updated_user.bookmarks,
			is_bookmarked: params.action === "increment",
		};
	}
}

const userRepository = new UserRepository();
const photoRepository = new PhotoRepository();

export const bookmarkService = new BookmarkService(
	userRepository,
	photoRepository
);
