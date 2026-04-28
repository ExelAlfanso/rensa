"use client";

import Image from "next/image";
import type React from "react";
import DropdownItem from "@/frontend/components/dropdowns/DropdownItem";
import Text from "@/frontend/components/Text";
import type { NotificationData } from "@/frontend/types/notification";
import { cn } from "@/utils/cn";

interface NotificationItemViewProps {
	isLast: boolean;
	itemRef: React.Ref<HTMLLIElement>;
	notification: NotificationData;
}

const NotificationItemView = ({
	notification,
	isLast,
	itemRef,
}: NotificationItemViewProps) => {
	return (
		<DropdownItem
			className={cn("w-full", isLast && "rounded-b-2xl")}
			href={`/photo/${notification.photoId}`}
			key={notification.id}
			ref={itemRef}
		>
			<div className="relative mr-3 inline h-12 w-12">
				<Image
					alt="profile"
					className="aspect-square rounded-2xl object-cover"
					fill
					src={notification.actorId.avatar || "/profile.jpg"}
				/>
			</div>
			<Text className="inline" size="xs">
				<span className="inline font-bold">
					{notification.actorId.username}
				</span>{" "}
				{notification.type === "photo-saved"
					? "saved your photo."
					: notification.type === "photo-commented"
						? "commented on your photo."
						: "bookmarked your photo."}
			</Text>
		</DropdownItem>
	);
};

export default NotificationItemView;
