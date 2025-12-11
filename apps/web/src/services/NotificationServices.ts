import { elysiaApi } from "@/lib/axios";
import { fetchPhotoOwnerByPhotoId } from "./PhotoServices";
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

export async function sendPhotoSavedNotification(
  actorId: string,
  photoId: string // roll / photo / profile
) {
  try {
    const recipientId = await fetchPhotoOwnerByPhotoId(photoId);
    if (recipientId === actorId) {
      return null;
    }
    const res = await elysiaApi.post(`/notifications/photo-saved`, {
      actorId,
      recipientId,
      photoId,
      type: "photo-saved",
    });
    return res.data;
  } catch (error) {
    console.error("Error sending photo saved notification:", error);
    throw error;
  }
}
