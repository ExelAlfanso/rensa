import {
  fetchNotifications,
  sendPhotoSavedNotification,
  sendBookmarkedNotification,
  sendCommentedNotification,
  clearUserNotifications,
  markUserNotificationAsRead,
} from "@/services/NotificationServices";
import { elysiaApi } from "@/lib/axios";
import { fetchPhotoOwnerByPhotoId } from "@/services/PhotoServices";

// Mock dependencies
jest.mock("@/lib/axios", () => ({
  elysiaApi: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock("@/services/PhotoServices", () => ({
  fetchPhotoOwnerByPhotoId: jest.fn(),
}));

describe("NotificationServices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchNotifications", () => {
    it("should fetch notifications successfully", async () => {
      const mockNotifications = [
        {
          _id: "notif1",
          actorId: "actor1",
          recipientId: "recipient1",
          photoId: "photo1",
          type: "photo-saved",
          read: false,
        },
        {
          _id: "notif2",
          actorId: "actor2",
          recipientId: "recipient1",
          photoId: "photo2",
          type: "photo-bookmarked",
          read: true,
        },
      ];

      (elysiaApi.get as jest.Mock).mockResolvedValue({
        data: { data: { notifications: mockNotifications } },
      });

      const result = await fetchNotifications("recipient1", 1, 10);

      expect(elysiaApi.get).toHaveBeenCalledWith("/notifications", {
        params: { recipientId: "recipient1", page: 1, limit: 10 },
      });
      expect(result).toEqual(mockNotifications);
    });

    it("should use default pagination values", async () => {
      (elysiaApi.get as jest.Mock).mockResolvedValue({
        data: { data: { notifications: [] } },
      });

      await fetchNotifications("recipient1");

      expect(elysiaApi.get).toHaveBeenCalledWith("/notifications", {
        params: { recipientId: "recipient1", page: 1, limit: 10 },
      });
    });
  });

  describe("sendPhotoSavedNotification", () => {
    it("should send photo saved notification successfully", async () => {
      const mockResponse = { success: true, data: { _id: "notif123" } };

      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue("recipient123");
      (elysiaApi.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await sendPhotoSavedNotification("actor123", "photo123");

      expect(fetchPhotoOwnerByPhotoId).toHaveBeenCalledWith("photo123");
      expect(elysiaApi.post).toHaveBeenCalledWith("/notifications", {
        actorId: "actor123",
        recipientId: "recipient123",
        photoId: "photo123",
        type: "photo-saved",
      });
      expect(result).toEqual(mockResponse);
    });

    it("should not send notification if recipient is the same as actor", async () => {
      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue("actor123");

      const result = await sendPhotoSavedNotification("actor123", "photo123");

      expect(elysiaApi.post).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should not send notification if recipient is not found", async () => {
      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue(null);

      const result = await sendPhotoSavedNotification("actor123", "photo123");

      expect(elysiaApi.post).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue("recipient123");
      (elysiaApi.post as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(
        sendPhotoSavedNotification("actor123", "photo123")
      ).rejects.toThrow("API Error");
    });
  });

  describe("sendBookmarkedNotification", () => {
    it("should send bookmarked notification successfully", async () => {
      const mockResponse = { success: true };

      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue("recipient123");
      (elysiaApi.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      await sendBookmarkedNotification("actor123", "photo123");

      expect(elysiaApi.post).toHaveBeenCalledWith("/notifications", {
        actorId: "actor123",
        recipientId: "recipient123",
        photoId: "photo123",
        type: "photo-bookmarked",
      });
    });
  });

  describe("sendCommentedNotification", () => {
    it("should send commented notification successfully", async () => {
      const mockResponse = { success: true };

      (fetchPhotoOwnerByPhotoId as jest.Mock).mockResolvedValue("recipient123");
      (elysiaApi.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      await sendCommentedNotification("actor123", "photo123");

      expect(elysiaApi.post).toHaveBeenCalledWith("/notifications", {
        actorId: "actor123",
        recipientId: "recipient123",
        photoId: "photo123",
        type: "photo-commented",
      });
    });
  });

  describe("clearUserNotifications", () => {
    it("should clear user notifications successfully", async () => {
      (elysiaApi.delete as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      const result = await clearUserNotifications("user123");

      expect(elysiaApi.delete).toHaveBeenCalledWith("/notifications/user123");
      expect(result).toBe(true);
    });

    it("should return false when success is undefined", async () => {
      (elysiaApi.delete as jest.Mock).mockResolvedValue({ data: {} });

      const result = await clearUserNotifications("user123");

      expect(result).toBe(false);
    });

    it("should handle errors when clearing notifications", async () => {
      (elysiaApi.delete as jest.Mock).mockRejectedValue(
        new Error("Delete failed")
      );

      await expect(clearUserNotifications("user123")).rejects.toThrow(
        "Delete failed"
      );
    });
  });

  describe("markUserNotificationAsRead", () => {
    it("should mark notification as read successfully", async () => {
      (elysiaApi.put as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      const result = await markUserNotificationAsRead("notif123");

      expect(elysiaApi.put).toHaveBeenCalledWith(
        "/notifications/notif123/read"
      );
      expect(result).toBe(true);
    });

    it("should return false when success is undefined", async () => {
      (elysiaApi.put as jest.Mock).mockResolvedValue({ data: {} });

      const result = await markUserNotificationAsRead("notif123");

      expect(result).toBe(false);
    });

    it("should handle errors when marking notification as read", async () => {
      (elysiaApi.put as jest.Mock).mockRejectedValue(
        new Error("Update failed")
      );

      await expect(markUserNotificationAsRead("notif123")).rejects.toThrow(
        "Update failed"
      );
    });
  });
});
