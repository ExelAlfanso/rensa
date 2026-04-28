import type {
  NewNotification,
  Notification,
  NotificationType,
} from "../../database/schema";
import type { PublicUser } from "../users/user.model";

export type CreateNotificationInput = Pick<
  NewNotification,
  "recipientId" | "actorId" | "photoId" | "type"
>;

export type NotificationRecord = Notification;

export type NotificationResponse = Omit<Notification, "actorId"> & {
  actorId: PublicUser | null;
};

export const notificationTypes: NotificationType[] = [
  "photo-saved",
  "photo-bookmarked",
  "photo-commented",
];

export function isNotificationType(value: string): value is NotificationType {
  return notificationTypes.includes(value as NotificationType);
}

