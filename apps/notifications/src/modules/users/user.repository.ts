import { api } from "../../utils/axios";
import type { PublicUser } from "./user.model";

export class UserRepository {
  static async findPublicById(id: string): Promise<PublicUser | null> {
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data?.data?.user ?? response.data?.user ?? response.data;

      if (!user?.id && !user?._id) return null;

      return {
        id: user.id ?? user._id,
        username: user.username,
        avatar: user.avatar ?? null,
      };
    } catch (error) {
      console.warn(`Failed to fetch user profile for ${id}`);
      return null;
    }
  }
}
