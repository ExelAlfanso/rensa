import { api } from "@/lib/axios-client";
import { sendPhotoSavedNotification } from "./NotificationServices";

export async function fetchRollById(rollId: string) {
  const res = await api.get(`/rolls/${rollId}`);
  return res.data.data;
}
export async function fetchRollsByUserId(userId: string, sort?: string) {
  const res = await api.get(`/rolls?userId=${userId}&sort=${sort}`);
  return res.data.data.rolls;
}
export async function addPhotoToRoll(
  actorId: string,
  rollId: string,
  photoId: string
) {
  try {
    console.debug("addPhotoToRoll", {
      actorId,
      rollId,
      photoId,
      baseURL: api.defaults.baseURL,
    });
    await sendPhotoSavedNotification(actorId, photoId);
    return api.post(`/rolls/${rollId}/photos/${photoId}`, {
      rollIds: [rollId],
      photoId,
    });
  } catch (error) {
    console.error("addPhotoToRoll failed:", {
      actorId,
      rollId,
      photoId,
      error,
    });
    throw error;
  }
}

export async function removePhotoFromRoll(rollId: string, photoId: string) {
  try {
    console.debug("removePhotoFromRoll", {
      rollId,
      photoId,
      baseURL: api.defaults.baseURL,
    });
    return api.delete(`/rolls/${rollId}/photos/${photoId}`);
  } catch (error) {
    console.error("removePhotoFromRoll failed:", { rollId, photoId, error });
    throw error;
  }
}

export async function fetchIsSavedToRolls(photoId: string) {
  const res = await api.get(`/rolls/is-saved`, {
    params: { photoId },
  });
  return res.data.data.rollIds;
}

export async function updateRollDetails(
  rollId: string,
  name: string,
  description: string
) {
  return api.patch(`/rolls/${rollId}`, { name, description });
}

export async function fetchDefaultRoll() {
  const res = await api.get(`/rolls/default`);

  return res.data;
}
