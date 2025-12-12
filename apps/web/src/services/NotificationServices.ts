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

//TODO: RATE LIMITING
export async function sendPhotoSavedNotification(
  actorId: string,
  photoId: string // roll / photo / profile
) {
  try {
    const recipientId = await fetchPhotoOwnerByPhotoId(photoId);
    if (recipientId === actorId) {
      return null;
    }
    const res = await elysiaApi.post(`/notifications`, {
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
export async function sendBookmarkedNotification(
  actorId: string,
  photoId: string // roll / photo / profile
) {
  try {
    const recipientId = await fetchPhotoOwnerByPhotoId(photoId);
    if (recipientId === actorId) {
      return null;
    }
    const res = await elysiaApi.post(`/notifications`, {
      actorId,
      recipientId,
      photoId,
      type: "photo-bookmarked",
    });
    return res.data;
  } catch (error) {
    console.error("Error sending photo bookmarked notification:", error);
    throw error;
  }
}
export async function sendCommentedNotification(
  actorId: string,
  photoId: string // roll / photo / profile
) {
  try {
    const recipientId = await fetchPhotoOwnerByPhotoId(photoId);
    if (recipientId === actorId) {
      return null;
    }
    const res = await elysiaApi.post(`/notifications`, {
      actorId,
      recipientId,
      photoId,
      type: "photo-commented",
    });
    return res.data;
  } catch (error) {
    console.error("Error sending photo commented notification:", error);
    throw error;
  }
}

// export async function clearNotifications(recipientId: string) {
//   try {
//     const res = await elysiaApi.delete(`/notifications`, {
//       params: { recipientId },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error clearing notifications:", error);
//     throw error;
//   }
// }
