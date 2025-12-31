import { api } from "@/lib/axios-client";
import {
  sendBookmarkedNotification,
  sendCommentedNotification,
} from "./NotificationServices";
import { CommentType } from "@/sections/CommentSection";

export async function bookmarkPhoto(
  userId: string | undefined,
  photoId: string,
  action: "increment" | "decrement"
) {
  try {
    const res = await api.post(`/photos/bookmark/${photoId}`, {
      action,
      userId: userId,
    });
    if (action === "increment")
      await sendBookmarkedNotification(userId || "", photoId);
    return res.data.bookmarks;
  } catch (error) {
    console.error("Error bookmarking photo:", error);
    throw error;
  }
}

export async function commentPhoto(
  newComment: CommentType,
  id: string,
  userId: string | undefined
) {
  try {
    await api.post(`/photos/${id}/comments`, {
      text: newComment.text,
      userId: userId,
    });
    await sendCommentedNotification(userId || "", id);
  } catch (err) {
    console.error("Error posting comment:", err);
  }
}

export async function removeUserPhoto(photoId: string) {
  try {
    await api.delete(`/photos/${photoId}`);
  } catch (error) {
    console.error("Error removing photo:", error);
    throw error;
  }
}
