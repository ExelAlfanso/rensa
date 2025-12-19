import { api } from "@/lib/axios";

export function fetchProfile(id: string) {
  return api.get(`/profile/${id}`).then((res) => res.data.data.user);
}

export function fetchProfileByRollId(rollId: string) {
  return api.get(`/rolls/${rollId}/owner`).then((res) => res.data.data.userId);
}
