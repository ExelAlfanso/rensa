import {
  fetchPhotosFromDB,
  fetchBookmarkedPhotosFromDB,
} from "@/services/PhotoServices";
import { api } from "@/lib/axios-client";

// Mock the axios library
jest.mock("@/lib/axios-client", () => ({
  api: {
    get: jest.fn(),
  },
}));

describe("PhotoServices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchPhotosFromDB", () => {
    it("should fetch photos successfully with default parameters", async () => {
      const mockPhotos = [
        {
          _id: "1",
          url: "https://example.com/photo1.jpg",
          title: "Test Photo 1",
          userId: { username: "user1", avatar: "avatar1.jpg" },
          bookmarks: 5,
          tags: ["nature"],
        },
        {
          _id: "2",
          url: "https://example.com/photo2.jpg",
          title: "Test Photo 2",
          userId: { username: "user2", avatar: "avatar2.jpg" },
          bookmarks: 10,
          tags: ["urban"],
        },
      ];

      const mockResponse = {
        data: {
          photos: mockPhotos,
          currentPage: 1,
          totalPages: 5,
          hasMore: true,
          total: 50,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchPhotosFromDB(1, undefined, "recent");

      expect(api.get).toHaveBeenCalledWith("/photos", {
        params: {
          page: 1,
          limit: 10,
          sort: "recent",
          filters: undefined,
        },
      });

      expect(result).toEqual({
        data: mockPhotos,
        urls: [
          "https://example.com/photo1.jpg",
          "https://example.com/photo2.jpg",
        ],
        nextPage: 2,
      });
    });

    it("should fetch photos with filters", async () => {
      const mockPhotos = [
        {
          _id: "1",
          url: "https://example.com/photo1.jpg",
          title: "Nature Photo",
          userId: { username: "user1", avatar: "avatar1.jpg" },
          bookmarks: 5,
          tags: ["nature"],
        },
      ];

      const mockResponse = {
        data: {
          photos: mockPhotos,
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
          total: 1,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchPhotosFromDB(
        1,
        ["nature", "landscape"],
        "popular"
      );

      expect(api.get).toHaveBeenCalledWith("/photos", {
        params: {
          page: 1,
          limit: 10,
          sort: "popular",
          filters: "nature,landscape",
        },
      });

      expect(result.nextPage).toBeUndefined();
    });

    it("should handle last page correctly", async () => {
      const mockResponse = {
        data: {
          photos: [],
          currentPage: 5,
          totalPages: 5,
          hasMore: false,
          total: 50,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchPhotosFromDB(5, undefined, "recent");

      expect(result.nextPage).toBeUndefined();
      expect(result.data).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Network error");
      (api.get as jest.Mock).mockRejectedValue(mockError);

      await expect(fetchPhotosFromDB(1, undefined, "recent")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("fetchBookmarkedPhotosFromDB", () => {
    it("should fetch bookmarked photos successfully", async () => {
      const mockBookmarkedPhotos = [
        {
          _id: "1",
          url: "https://example.com/bookmarked1.jpg",
          title: "Bookmarked Photo 1",
          userId: { username: "user1", avatar: "avatar1.jpg" },
          bookmarks: 15,
          tags: ["favorite"],
        },
      ];

      const mockResponse = {
        data: {
          photos: mockBookmarkedPhotos,
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
          total: 1,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await fetchBookmarkedPhotosFromDB("user1", 1);

      expect(api.get).toHaveBeenCalledWith("/photos/bookmark", {
        params: {
          userId: "user1",
          page: 1,
          limit: 10,
        },
      });

      expect(result.data).toEqual(mockBookmarkedPhotos);
      expect(result.urls).toEqual(["https://example.com/bookmarked1.jpg"]);
    });

    it("should handle API errors", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(fetchBookmarkedPhotosFromDB("user1", 1)).rejects.toThrow(
        "API Error"
      );
    });
  });
});
