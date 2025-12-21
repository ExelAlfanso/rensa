import { render, screen } from "@testing-library/react";
import App from "@/app/page";

// Mock the Home page component
jest.mock("@/app/home/page", () => {
  function HomeMock() {
    return (
      <div data-testid="home-page">
        <h1>Welcome to Rensa</h1>
        <p>Home Page Content</p>
      </div>
    );
  }
  return HomeMock;
});

describe("App Root Page", () => {
  it("renders the app root page", () => {
    render(<App />);

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders the home page component", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /welcome to rensa/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/home page content/i)).toBeInTheDocument();
  });
});
