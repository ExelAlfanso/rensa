import { fetchPhotoOwnerByPhotoId } from "./PhotoServices";
import { api } from "@/lib/axios-client";

export type PhotoNotificationType =
  | "photo-saved"
  | "photo-bookmarked"
  | "photo-commented";

export async function fetchNotifications(
  recipientId: string,
  page = 1,
  limit = 10
) {
  const res = await api.get("/notifications", {
    params: { recipientId, page, limit },
  });
  // Next API responds with { success, data: notifications, message }
  return res.data?.data ?? [];
}

async function sendPhotoNotification(
  actorId: string,
  photoId: string,
  type: PhotoNotificationType
) {
  const recipientId = await fetchPhotoOwnerByPhotoId(photoId);

  if (!recipientId || recipientId === actorId) {
    return null;
  }

  const res = await api.post(`/notifications`, {
    actorId,
    recipientId,
    photoId,
    type,
  });

  return res.data;
}

export const sendPhotoSavedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-saved");

export const sendBookmarkedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-bookmarked");

export const sendCommentedNotification = (actorId: string, photoId: string) =>
  sendPhotoNotification(actorId, photoId, "photo-commented");

export async function clearUserNotifications(userId: string) {
  const res = await api.delete(`/notifications/${userId}`);
  return res.data.success ?? false;
}

export async function markUserNotificationAsRead(notificationId: string) {
  const res = await api.put(`/notifications/${notificationId}/read`);
  return res.data?.success ?? false;
}
