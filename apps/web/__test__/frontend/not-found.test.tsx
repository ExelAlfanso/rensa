import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

// Mock Next.js components
jest.mock("next/image", () => {
  function NextImageMock(props: any) {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={props.alt || "mocked image"} />;
  }
  return NextImageMock;
});

jest.mock("next/link", () => {
  function NextLinkMock({ href, children }: any) {
    return <a href={href}>{children}</a>;
  }
  return NextLinkMock;
});

// Mock Footer component
jest.mock("@/components/footer/Footer", () => {
  function FooterMock() {
    return <footer data-testid="footer">Footer</footer>;
  }
  return FooterMock;
});

// Mock IconButton
jest.mock("@/components/buttons/IconButton", () => {
  function IconButtonMock({ children }: any) {
    return <button>{children}</button>;
  }
  return IconButtonMock;
});

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  ArrowRightIcon: () => <span>→</span>,
}));

describe("NotFound Page", () => {
  it("renders the 404 page", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("displays the correct error message", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: /you've reached an empty zone/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the page you're looking for might have been moved/i)
    ).toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    render(<NotFound />);

    const images = screen.getAllByAltText(/not found/i);
    expect(images.length).toBeGreaterThan(0);
  });

  it("renders a link back to home", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("has correct background styling", () => {
    const { container } = render(<NotFound />);

    const mainDiv = container.querySelector(".bg-white");
    expect(mainDiv).toBeInTheDocument();
  });
});
