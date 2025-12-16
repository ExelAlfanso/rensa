import { elysiaApi } from "@/lib/axios";
import { fetchPhotoOwnerByPhotoId } from "./PhotoServices";

export type PhotoNotificationType =
  | "photo-saved"
  | "photo-bookmarked"
  | "photo-commented";

export async function fetchNotifications(
  recipientId: string,
  page = 1,
  limit = 10
) {
  const res = await elysiaApi.get(`/notifications`, {
    params: { recipientId, page, limit },
  });
  return res.data.data.notifications;
}

async function sendPhotoNotification(
  actorId: string,
  photoId: string,
  type: PhotoNotificationType
) {
  try {
    const recipientId = await fetchPhotoOwnerByPhotoId(photoId);

    if (!recipientId || recipientId === actorId) {
      return null;
    }

    const res = await elysiaApi.post(`/notifications`, {
      actorId,
      recipientId,
      photoId,
      type,
    });

    return res.data;
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    throw error;
  }
}

export const sendPhotoSavedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-saved");

export const sendBookmarkedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-bookmarked");

export const sendCommentedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-commented");

export async function clearUserNotifications(userId: string) {
  try {
    const res = await elysiaApi.delete(`/notifications/${userId}`);
    return res.data?.success ?? false;
  } catch (error) {
    console.error("Error clearing notifications:", error);
    throw error;
  }
}

export async function markUserNotificationAsRead(notificationId: string) {
  try {
    const res = await elysiaApi.put(`/notifications/${notificationId}/read`);
    return res.data?.success ?? false;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}
