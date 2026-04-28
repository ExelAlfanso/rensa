"use client";

import { useBookmarkToggle } from "@/frontend/features/photos/hooks/use-bookmark-toggle";
import BookmarkToggleButton from "../components/BookmarkToggleButton";

interface BookmarkToggleContainerProps {
	initialBookmarks?: number;
	photoId: string;
}

export default function BookmarkToggleContainer({
	photoId,
	initialBookmarks = 0,
}: BookmarkToggleContainerProps) {
	const { bookmarks, handleToggle, isBookmarked } = useBookmarkToggle({
		initialBookmarks,
		photoId,
	});

	return (
		<BookmarkToggleButton
			bookmarks={bookmarks}
			isBookmarked={isBookmarked}
			onToggle={handleToggle}
		/>
	);
}
