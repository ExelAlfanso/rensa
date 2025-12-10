"use client";

import { BellIcon } from "@phosphor-icons/react";
import Heading from "../../Heading";
import Image from "next/image";
import Text from "@/components/Text";
import IconDropdown from "../IconDropdown";
import DropdownItem from "../DropdownItem";
import { useNotificationContext } from "@/providers/NotificationProvider";

const NotificationDropdown = () => {
  const { notifications } = useNotificationContext();

  return (
    <div className="relative z-50 w-full">
      <IconDropdown
        Tag={BellIcon}
        className="h-100 overflow-y-auto no-scrollbar"
      >
        <Heading alignment="center" size="m" className="py-6">
          Notifications
        </Heading>
        {notifications.length > 0 ? (
          notifications.map((notification, idx) => (
            <DropdownItem
              key={idx}
              href={"/photo/" + notification.photoId}
              className={
                idx === notifications.length - 1 ? "rounded-b-2xl" : ""
              }
            >
              <div className={`avatar w-12 h-12 inline mr-3 `}>
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
                saved your image
              </Text>
            </DropdownItem>
          ))
        ) : (
          <Text size="s" className="mb-10 text-gray-400">
            No notifications
          </Text>
        )}
      </IconDropdown>
    </div>
  );
};

export default NotificationDropdown;
