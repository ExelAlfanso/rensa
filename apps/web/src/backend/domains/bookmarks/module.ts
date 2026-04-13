import { BookmarksApplication } from "./application/bookmarks.application";
import { UpdateBookmarkUseCase } from "./application/update-bookmark.use-case";
import { bookmarksInfrastructure } from "./infrastructure/bookmarks.repositories";

const updateBookmarkUseCase = new UpdateBookmarkUseCase(
	bookmarksInfrastructure.userRepository,
	bookmarksInfrastructure.photoRepository
);
const bookmarksApplication = new BookmarksApplication(updateBookmarkUseCase);

export const bookmarkDomain = {
	...bookmarksInfrastructure,
	updateBookmarkUseCase,
	bookmarksApplication,
};
