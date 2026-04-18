import type { UpdateBookmarkUseCase } from "./update-bookmark.use-case";

export class BookmarksApplication {
	private readonly updateBookmarkUseCase: UpdateBookmarkUseCase;

	constructor(updateBookmarkUseCase: UpdateBookmarkUseCase) {
		this.updateBookmarkUseCase = updateBookmarkUseCase;
	}

	updateBookmark(params: {
		photoId: string;
		userId: string;
		action: "increment" | "decrement";
		actorId?: string;
	}): Promise<{
		bookmarks: string[];
		isBookmarked: boolean;
	}> {
		return this.updateBookmarkUseCase.execute(params);
	}
}
