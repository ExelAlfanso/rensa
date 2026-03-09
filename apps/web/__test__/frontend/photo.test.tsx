import { render, screen } from "@testing-library/react";
import PhotoPage from "@/app/(explorable)/photo/[id]/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the PhotoServices
jest.mock("@/services/PhotoServices", () => ({
  fetchPhotoById: jest.fn(),
  fetchUserBookmarkedPhotos: jest.fn(),
}));

// Mock the ProfileServices
jest.mock("@/services/ProfileServices", () => ({
  fetchProfile: jest.fn(),
}));

// Mock MasonryGallerySection
jest.mock("@/sections/MasonryGallerySection/MasonryGallerySection", () => {
  function MasonryGalleryMock() {
    return <div data-testid="masonry-gallery">Related Photos Gallery</div>;
  }
  return MasonryGalleryMock;
});

// Mock ImagePreview
jest.mock("@/frontend/components/ImagePreview", () => {
  function ImagePreviewMock({ src, alt }: any) {
    return <img data-testid="image-preview" src={src} alt={alt} />;
  }
  return ImagePreviewMock;
});

// Mock PhotoInfoCard
jest.mock("@/frontend/components/cards/PhotoInfoCard", () => {
  function PhotoInfoCardMock({ title, description, ownerId }: any) {
    return (
      <div data-testid="photo-info-card">
        <h2>{title}</h2>
        <p>{description}</p>
        <div data-testid="photo-dropdown">
          <button>Share</button>
          {ownerId === "test-user-id" && <button>Delete</button>}
        </div>
      </div>
    );
  }
  return PhotoInfoCardMock;
});

const mockPhoto = {
  _id: "123",
  title: "Test Photo",
  description: "A beautiful test photo",
  url: "https://example.com/photo.jpg",
  userId: "test-user-id",
  bookmarks: 5,
  metadata: {
    width: 1920,
    height: 1080,
    uploadedAt: "2025-12-30T00:00:00.000Z",
  },
};

describe("PhotoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the photo page with correct layout", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    const { container } = render(await PhotoPage({ params }));

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("bg-white-500", "w-full", "flex", "flex-col");
  });

  it("renders the image preview", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    const imagePreview = screen.getByTestId("image-preview");
    expect(imagePreview).toBeInTheDocument();
    expect(imagePreview).toHaveAttribute("src", mockPhoto.url);
    expect(imagePreview).toHaveAttribute("alt", mockPhoto.title);
  });

  it("renders the photo info card", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    const photoInfoCard = screen.getByTestId("photo-info-card");
    expect(photoInfoCard).toBeInTheDocument();
    expect(screen.getByText(mockPhoto.title)).toBeInTheDocument();
    expect(screen.getByText(mockPhoto.description)).toBeInTheDocument();
  });

  it("renders the related photos section", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    expect(
      screen.getByText(/we thought you will like this/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("masonry-gallery")).toBeInTheDocument();
  });

  it("renders photo dropdown with share button", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    const photoDropdown = screen.getByTestId("photo-dropdown");
    expect(photoDropdown).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
  });

  it("renders delete button in photo dropdown when user is owner", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    fetchPhotoById.mockResolvedValue(mockPhoto);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("does not render delete button when user is not owner", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    const photoByDifferentUser = {
      ...mockPhoto,
      userId: "different-user-id",
    };
    fetchPhotoById.mockResolvedValue(photoByDifferentUser);

    const params = Promise.resolve({ id: "123" });
    render(await PhotoPage({ params }));

    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it("redirects to not-found when photo is not found", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    const { redirect } = require("next/navigation");
    fetchPhotoById.mockResolvedValue(null);

    const params = Promise.resolve({ id: "invalid-id" });

    await PhotoPage({ params });

    expect(redirect).toHaveBeenCalledWith("/not-found");
  });

  it("redirects to not-found when fetch fails", async () => {
    const { fetchPhotoById } = require("@/services/PhotoServices");
    const { redirect } = require("next/navigation");
    fetchPhotoById.mockRejectedValue(new Error("Network error"));

    const params = Promise.resolve({ id: "123" });

    await PhotoPage({ params });

    expect(redirect).toHaveBeenCalledWith("/not-found");
  });
});
