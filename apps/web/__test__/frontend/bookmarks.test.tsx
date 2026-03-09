import { render, screen } from "@testing-library/react";
import BookmarksPage from "@/app/(explorable)/bookmarks/page";

// Mock the MasonryGallerySection component
jest.mock("@/sections/MasonryGallerySection/MasonryGallerySection", () => {
  function MasonryGallerySectionMock() {
    return <div data-testid="masonry-gallery">Photo Gallery</div>;
  }
  return MasonryGallerySectionMock;
});

// Mock the Heading component
jest.mock("@/frontend/components/Heading", () => {
  function HeadingMock({ children, ...props }: any) {
    return <h1 {...props}>{children}</h1>;
  }
  return HeadingMock;
});

// Mock useAuthStore
jest.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    user: { id: "test-user-id" },
  }),
}));

describe("BookmarksPage", () => {
  it("renders the bookmarks page", () => {
    const { container } = render(<BookmarksPage />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toBeInTheDocument();
  });

  it("has correct styling", () => {
    const { container } = render(<BookmarksPage />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("min-h-screen", "bg-white-500", "w-full");
  });

  it("renders as a div element", () => {
    const { container } = render(<BookmarksPage />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.tagName).toBe("DIV");
  });

  it("renders the heading with correct text", () => {
    render(<BookmarksPage />);
    expect(
      screen.getByRole("heading", { name: /your bookmarks/i }),
    ).toBeInTheDocument();
  });

  it("renders the masonry gallery section", () => {
    render(<BookmarksPage />);
    expect(screen.getByTestId("masonry-gallery")).toBeInTheDocument();
  });
});
