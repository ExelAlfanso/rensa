import { PhotoRepository } from "@rensa/db/queries/photo.repository";
import { UserRepository } from "@rensa/db/queries/user.repository";
import { BookmarkService } from "./service";

export class BookmarksController {
	private readonly bookmarkService: BookmarkService;

	constructor(bookmarkService: BookmarkService) {
		this.bookmarkService = bookmarkService;
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
		return this.bookmarkService.updateBookmark(params);
	}
}

const userRepository = new UserRepository();
const photoRepository = new PhotoRepository();
const bookmarkService = new BookmarkService(userRepository, photoRepository);

export const bookmarkController = new BookmarksController(bookmarkService);

