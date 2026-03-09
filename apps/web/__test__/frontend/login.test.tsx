import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

// Mock the LoginForm component
jest.mock("@/frontend/components/forms/LoginForm", () => {
  function LoginFormMock() {
    return (
      <div data-testid="login-form">
        <h1>Login</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </div>
    );
  }
  return LoginFormMock;
});

describe("LoginPage", () => {
  it("renders the login page", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders login form elements", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
