import {
  fetchRollById,
  fetchRollsByUserId,
  addPhotoToRoll,
  removePhotoFromRoll,
  fetchIsSavedToRolls,
  updateRollDetails,
  fetchDefaultRoll,
} from "@/services/RollServices";
import { api } from "@/lib/axios-client";
import { sendPhotoSavedNotification } from "@/services/NotificationServices";

// Mock dependencies
jest.mock("@/lib/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock("@/services/NotificationServices", () => ({
  sendPhotoSavedNotification: jest.fn(),
}));

describe("RollServices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchRollById", () => {
    it("should fetch a roll by ID successfully", async () => {
      const mockRoll = {
        _id: "roll123",
        name: "My Roll",
        userId: "user123",
        photos: ["photo1", "photo2"],
      };

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: mockRoll },
      });

      const result = await fetchRollById("roll123");

      expect(api.get).toHaveBeenCalledWith("/rolls/roll123");
      expect(result).toEqual(mockRoll);
    });

    it("should handle errors when fetching roll", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("Roll not found"));

      await expect(fetchRollById("invalid-id")).rejects.toThrow(
        "Roll not found"
      );
    });
  });

  describe("fetchRollsByUserId", () => {
    it("should fetch rolls for a user with default sort", async () => {
      const mockRolls = [
        { _id: "roll1", name: "Roll 1", userId: "user123" },
        { _id: "roll2", name: "Roll 2", userId: "user123" },
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { rolls: mockRolls } },
      });

      const result = await fetchRollsByUserId("user123");

      expect(api.get).toHaveBeenCalledWith(
        "/rolls?userId=user123&sort=undefined"
      );
      expect(result).toEqual(mockRolls);
    });

    it("should fetch rolls with custom sort", async () => {
      const mockRolls = [{ _id: "roll1", name: "Roll 1", userId: "user123" }];

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { rolls: mockRolls } },
      });

      await fetchRollsByUserId("user123", "latest");

      expect(api.get).toHaveBeenCalledWith("/rolls?userId=user123&sort=latest");
    });
  });

  describe("addPhotoToRoll", () => {
    it("should add a photo to roll and send notification", async () => {
      (sendPhotoSavedNotification as jest.Mock).mockResolvedValue(undefined);
      (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await addPhotoToRoll("actor123", "roll123", "photo123");

      expect(sendPhotoSavedNotification).toHaveBeenCalledWith(
        "actor123",
        "photo123"
      );
      expect(api.post).toHaveBeenCalledWith("/rolls/roll123/photos/photo123", {
        rollIds: ["roll123"],
        photoId: "photo123",
      });
      expect(result.data.success).toBe(true);
    });

    it("should handle errors during photo addition", async () => {
      (sendPhotoSavedNotification as jest.Mock).mockResolvedValue(undefined);
      (api.post as jest.Mock).mockRejectedValue(
        new Error("Failed to add photo")
      );

      await expect(
        addPhotoToRoll("actor123", "roll123", "photo123")
      ).rejects.toThrow("Failed to add photo");
    });
  });

  describe("removePhotoFromRoll", () => {
    it("should remove a photo from roll successfully", async () => {
      (api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

      const result = await removePhotoFromRoll("roll123", "photo123");

      expect(api.delete).toHaveBeenCalledWith("/rolls/roll123/photos/photo123");
      expect(result.data.success).toBe(true);
    });

    it("should handle errors during photo removal", async () => {
      (api.delete as jest.Mock).mockRejectedValue(
        new Error("Failed to remove photo")
      );

      await expect(removePhotoFromRoll("roll123", "photo123")).rejects.toThrow(
        "Failed to remove photo"
      );
    });
  });

  describe("fetchIsSavedToRolls", () => {
    it("should fetch roll IDs where photo is saved", async () => {
      const mockRollIds = ["roll1", "roll2", "roll3"];

      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { rollIds: mockRollIds } },
      });

      const result = await fetchIsSavedToRolls("photo123");

      expect(api.get).toHaveBeenCalledWith("/rolls/is-saved", {
        params: { photoId: "photo123" },
      });
      expect(result).toEqual(mockRollIds);
    });

    it("should return empty array when photo is not saved anywhere", async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: { data: { rollIds: [] } },
      });

      const result = await fetchIsSavedToRolls("photo123");

      expect(result).toEqual([]);
    });
  });

  describe("updateRollDetails", () => {
    it("should update roll name and description", async () => {
      const updatedRoll = {
        _id: "roll123",
        name: "Updated Name",
        description: "Updated Description",
      };

      (api.patch as jest.Mock).mockResolvedValue({
        data: { success: true, data: updatedRoll },
      });

      const result = await updateRollDetails(
        "roll123",
        "Updated Name",
        "Updated Description"
      );

      expect(api.patch).toHaveBeenCalledWith("/rolls/roll123", {
        name: "Updated Name",
        description: "Updated Description",
      });
      expect(result.data.success).toBe(true);
    });

    it("should handle update errors", async () => {
      (api.patch as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await expect(
        updateRollDetails("roll123", "New Name", "New Description")
      ).rejects.toThrow("Update failed");
    });
  });

  describe("fetchDefaultRoll", () => {
    it("should fetch the default roll", async () => {
      const mockDefaultRoll = {
        _id: "default-roll",
        name: "Default Roll",
        userId: "user123",
        isDefault: true,
      };

      (api.get as jest.Mock).mockResolvedValue({
        data: mockDefaultRoll,
      });

      const result = await fetchDefaultRoll();

      expect(api.get).toHaveBeenCalledWith("/rolls/default");
      expect(result).toEqual(mockDefaultRoll);
    });

    it("should handle errors when fetching default roll", async () => {
      (api.get as jest.Mock).mockRejectedValue(
        new Error("No default roll found")
      );

      await expect(fetchDefaultRoll()).rejects.toThrow("No default roll found");
    });
  });
});
