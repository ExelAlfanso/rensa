"use client";

import { BellIcon } from "@phosphor-icons/react";
import Heading from "../../Heading";
import Image from "next/image";
import Text from "@/components/Text";
import IconDropdown from "../IconDropdown";
import DropdownItem from "../DropdownItem";
import { useNotificationContext } from "@/providers/NotificationProvider";
import useReadOnVisible from "@/hooks/useReadOnVisible";
import { NotificationData } from "@/models/Notification";
import { useCallback } from "react";

interface NotificationItemProps {
  notification: NotificationData;
  isLast: boolean;
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
      ref={ref}
      key={notification.id}
      href={"/photo/" + notification.photoId}
      className={`w-full ${isLast ? "rounded-b-2xl" : ""}`}
    >
      <div className={`w-12 h-12 inline mr-3 relative`}>
        <Image
          src={notification.actorId.avatar || "/profile.jpg"}
          alt="profile"
          fill
          className="object-cover rounded-2xl aspect-square"
        />
      </div>
      <Text size="xs" className="inline">
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
    clearNotifications();
  };
  return (
    <div className="relative z-50 w-full">
      {unreadCount > 0 && (
        <div className="absolute z-20 right-0 top-0 rounded-full bg-red-500 w-4 h-4 text-white-500 text-[10px] flex items-center justify-center">
          {unreadCount}
        </div>
      )}
      <IconDropdown Tag={BellIcon} className="h-100">
        <Heading alignment="center" size="m" className="py-6 relative w-full">
          Notifications
          {notifications.length > 0 && (
            <button
              onClick={handleClearAllNotifications}
              className="absolute right-5 top-18 text-gray-700 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
            >
              <Text size="xs">Clear all</Text>
            </button>
          )}
        </Heading>
        <ul className="overflow-y-auto no-scrollbar w-full flex flex-col items-center">
          {notifications?.length > 0 ? (
            notifications.map((notification, idx) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isLast={idx === notifications.length - 1}
              />
            ))
          ) : (
            <Text size="s" className="mb-10 text-gray-400">
              No notifications
            </Text>
          )}
        </ul>
      </IconDropdown>
    </div>
  );
};

export default NotificationDropdown;
