import { fetchProfile, fetchProfileByRollId } from "@/services/ProfileServices";
import { api } from "@/lib/axios-client";

// Mock the axios library
jest.mock("@/lib/axios-client", () => ({
  api: {
    get: jest.fn(),
  },
}));

describe("ProfileServices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchProfile", () => {
    it("should fetch user profile successfully", async () => {
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        avatar: "avatar.jpg",
        bio: "Test bio",
      };

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { user: mockUser } },
      });

      const result = await fetchProfile("user123");

      expect(api.get).toHaveBeenCalledWith("/profile/user123");
      expect(result).toEqual(mockUser);
    });

    it("should handle errors when fetching profile", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("User not found"));

      await expect(fetchProfile("invalid-id")).rejects.toThrow(
        "User not found"
      );
    });

    it("should handle network errors", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(fetchProfile("user123")).rejects.toThrow("Network error");
    });
  });

  describe("fetchProfileByRollId", () => {
    it("should fetch profile by roll ID successfully", async () => {
      const mockUserId = "user123";

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { userId: mockUserId } },
      });

      const result = await fetchProfileByRollId("roll123");

      expect(api.get).toHaveBeenCalledWith("/rolls/roll123/owner");
      expect(result).toBe(mockUserId);
    });

    it("should handle errors when fetching profile by roll ID", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("Roll not found"));

      await expect(fetchProfileByRollId("invalid-roll-id")).rejects.toThrow(
        "Roll not found"
      );
    });

    it("should handle missing owner information", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { userId: null } },
      });

      const result = await fetchProfileByRollId("roll123");

      expect(result).toBeNull();
    });
  });
});
