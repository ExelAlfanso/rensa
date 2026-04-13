import { render, screen } from "@testing-library/react";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

// Mock the ForgotPasswordForm component
jest.mock("@/frontend/components/forms/ForgotPasswordForm", () => {
	function ForgotPasswordFormMock() {
		return (
			<div data-testid="forgot-password-form">
				<h1>Forgot Password</h1>
				<input placeholder="Email" type="email" />
				<button type="submit">Send Reset Link</button>
			</div>
		);
	}
	return ForgotPasswordFormMock;
});

describe("ForgotPasswordPage", () => {
	it("renders the forgot password page", () => {
		render(<ForgotPasswordPage />);
		expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
	});

	it("renders forgot password form elements", () => {
		render(<ForgotPasswordPage />);

		expect(
			screen.getByRole("heading", { name: /forgot password/i })
		).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /send reset link/i })
		).toBeInTheDocument();
	});
});
