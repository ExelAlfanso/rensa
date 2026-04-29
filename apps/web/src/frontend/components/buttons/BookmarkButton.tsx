"use client";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type React from "react";
import { cn } from "@/utils/cn";

interface BookmarkButtonProps {
	children?: React.ReactNode;
	className?: string;
	id?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
	id,
	className,
	children,
}) => (
	<Link
		className={cn(
			"cursor-pointer transition-colors duration-300 hover:text-gray-800",
			className
		)}
		href={"/bookmarks"}
		id={id}
	>
		<BookmarkSimpleIcon size={32} weight="fill" />
		{children}
	</Link>
);

export default BookmarkButton;
