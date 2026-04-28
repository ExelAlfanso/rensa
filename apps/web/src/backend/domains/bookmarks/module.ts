import { BookmarksApplication } from "./application/bookmarks.application";
import { UpdateBookmarkUseCase } from "./application/update-bookmark.use-case";
import { bookmarksInfrastructure } from "./infrastructure/bookmarks.repositories";

const updateBookmarkUseCase = new UpdateBookmarkUseCase(
	bookmarksInfrastructure.userRepository,
	bookmarksInfrastructure.photoRepository
);
const bookmarksApplication = new BookmarksApplication(updateBookmarkUseCase);
const bookmarkService = {
	updateBookmark: updateBookmarkUseCase.execute.bind(updateBookmarkUseCase),
};

export const bookmarkDomain = {
	bookmarkService,
	updateBookmarkUseCase,
	bookmarksApplication,
};
