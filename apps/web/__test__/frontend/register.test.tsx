import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";

// Mock the RegisterForm component
jest.mock("@/components/forms/RegisterForm", () => {
  function RegisterFormMock() {
    return (
      <div data-testid="register-form">
        <h1>Register</h1>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Sign Up</button>
      </div>
    );
  }
  return RegisterFormMock;
});

describe("RegisterPage", () => {
  it("renders the register page", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("renders register form elements", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });
});
