import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "@/backend/common/backend.error";
import type { PhotoRepositoryInterface } from "@/backend/interfaces/photo-repository.interface";
import type { UserRepositoryInterface } from "@/backend/interfaces/user-repository.interface";

export class UpdateBookmarkUseCase {
	readonly photoRepository: PhotoRepositoryInterface;
	readonly userRepository: UserRepositoryInterface;

	constructor(
		userRepository: UserRepositoryInterface,
		photoRepository: PhotoRepositoryInterface
	) {
		this.userRepository = userRepository;
		this.photoRepository = photoRepository;
	}

	async execute(params: {
		photoId: string;
		userId: string;
		action: "increment" | "decrement";
		actorId?: string;
	}): Promise<{
		bookmarks: string[];
		isBookmarked: boolean;
	}> {
		if (!params.actorId) {
			throw new UnauthorizedError();
		}
		if (params.actorId !== params.userId) {
			throw new ForbiddenError("Cannot update bookmarks for another user");
		}

		const photoExists = await this.photoRepository.exists(params.photoId);
		if (!photoExists) {
			throw new NotFoundError("Photo not found");
		}

		const updatedUser = await this.userRepository.updateBookmarks(
			params.userId,
			params.photoId,
			params.action
		);
		if (!updatedUser) {
			throw new NotFoundError("User not found");
		}

		return {
			bookmarks: updatedUser.bookmarks,
			isBookmarked: params.action === "increment",
		};
	}
}
