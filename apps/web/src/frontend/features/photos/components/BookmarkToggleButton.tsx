"use client";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import Text from "@/frontend/components/Text";

interface BookmarkToggleButtonProps {
	bookmarks: number;
	isBookmarked: boolean;
	onToggle: () => void;
}

export default function BookmarkToggleButton({
	bookmarks,
	isBookmarked,
	onToggle,
}: BookmarkToggleButtonProps) {
	return (
		<span className="inline-flex items-center justify-center text-black">
			<Text size="s">{bookmarks}</Text>
			<button onClick={onToggle} type="button">
				<BookmarkSimpleIcon
					className="cursor-pointer transition-transform hover:scale-110 focus:border-0"
					size={24}
					weight={isBookmarked ? "fill" : "regular"}
				/>
			</button>
		</span>
	);
}
