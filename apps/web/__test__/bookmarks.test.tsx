import { render } from "@testing-library/react";
import BookmarksPage from "@/app/(explorable)/bookmarks/page";

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
});
