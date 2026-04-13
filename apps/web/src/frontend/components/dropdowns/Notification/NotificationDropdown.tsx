"use client";

import { BellIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback } from "react";
import Text from "@/frontend/components/Text";
import useReadOnVisible from "@/frontend/hooks/use-read-on-visible";
import { useNotificationContext } from "@/frontend/providers/NotificationProvider";
import type { NotificationData } from "@/frontend/types/notification";
import { cn } from "@/utils/cn";
import Heading from "../../Heading";
import DropdownItem from "../DropdownItem";
import IconDropdown from "../IconDropdown";

interface NotificationItemProps {
	isLast: boolean;
	notification: NotificationData;
}

const NotificationItem = ({ notification, isLast }: NotificationItemProps) => {
	const { markNotificationAsRead } = useNotificationContext();

	const handleVisible = useCallback(() => {
		markNotificationAsRead(notification.id);
	}, [markNotificationAsRead, notification.id]);

	const ref = useReadOnVisible(
		notification.id,
		notification.read,
		handleVisible
	);

	return (
		<DropdownItem
			className={cn("w-full", isLast && "rounded-b-2xl")}
			href={`/photo/${notification.photoId}`}
			key={notification.id}
			ref={ref}
		>
			<div className={"relative mr-3 inline h-12 w-12"}>
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

const NotificationDropdown = () => {
	const { notifications, clearNotifications } = useNotificationContext();
	const unreadCount = notifications.filter((n) => !n.read).length;
	const handleClearAllNotifications = () => {
		// console.log("Clearing all notifications");
		clearNotifications();
	};
	return (
		<div className="relative z-50 w-full">
			{unreadCount > 0 && (
				<div className="absolute top-0 right-0 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white-500">
					{unreadCount}
				</div>
			)}
			<IconDropdown className="h-100" closeOnItemClick={false} Tag={BellIcon}>
				<Heading alignment="center" className="relative w-full py-6" size="m">
					Notifications
					{notifications.length > 0 && (
						<button
							className="absolute top-18 right-5 cursor-pointer text-gray-700 transition-colors duration-300 hover:text-gray-600"
							onClick={handleClearAllNotifications}
						>
							<Text size="xs">Clear all</Text>
						</button>
					)}
				</Heading>
				<ul className="no-scrollbar flex w-full flex-col items-center overflow-y-auto">
					{notifications?.length > 0 ? (
						notifications.map((notification, idx) => (
							<NotificationItem
								isLast={idx === notifications.length - 1}
								key={notification.id}
								notification={notification}
							/>
						))
					) : (
						<Text className="mb-10 text-gray-400" size="s">
							No notifications
						</Text>
					)}
				</ul>
			</IconDropdown>
		</div>
	);
};

export default NotificationDropdown;
