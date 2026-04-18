"use client";

import { useCallback } from "react";
import useReadOnVisible from "@/frontend/hooks/use-read-on-visible";
import { useNotificationContext } from "@/frontend/providers/NotificationProvider";
import type { NotificationData } from "@/frontend/types/notification";
import NotificationItemView from "../components/NotificationItemView";

interface NotificationItemContainerProps {
	isLast: boolean;
	notification: NotificationData;
}

const NotificationItemContainer = ({
	notification,
	isLast,
}: NotificationItemContainerProps) => {
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
		<NotificationItemView
			isLast={isLast}
			itemRef={ref}
			notification={notification}
		/>
	);
};

export default NotificationItemContainer;
