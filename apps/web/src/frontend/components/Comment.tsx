import type React from "react";
import Text from "@/frontend/components/Text";
import { formatTimeAgo } from "@/utils/date-formatter";
import ProfileBadge from "./badges/ProfileBadge";

interface CommentProps {
	avatarUrl?: string;
	children?: string;
	className?: string;
	createdAt?: string;
	disableBorder?: boolean;
	id?: string;
	userId?: string;
	username?: string;
}

const Comment: React.FC<CommentProps> = ({
	id,
	className,
	children,
	username,
	createdAt,
	userId,
	avatarUrl,
	disableBorder = false,
}) => {
	return (
		<div className={`${className} text-[13px]`} id={id}>
			<div className="flex flex-row items-center justify-between">
				<ProfileBadge
					avatarUrl={avatarUrl}
					className="mb-2"
					href={`/profile/${userId}`}
					username={username}
				/>
				<Text className="mb-1 text-white-700" size="xs">
					{formatTimeAgo(createdAt || "")}
				</Text>
			</div>
			<h1 className="font-figtree text-black">{children}</h1>
			{!disableBorder && (
				<div className="my-2 w-full border-white-700 border-t" />
			)}
		</div>
	);
};

export default Comment;
