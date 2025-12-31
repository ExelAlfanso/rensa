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
  await sendPhotoSavedNotification(actorId, photoId);
  return api.post(`/rolls/${rollId}/photos/${photoId}`, {
    rollIds: [rollId],
    photoId,
  });
}

export async function removePhotoFromRoll(rollId: string, photoId: string) {
  return api.delete(`/rolls/${rollId}/photos/${photoId}`);
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
