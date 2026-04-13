import { render, screen } from "@testing-library/react";
import ErrorPage from "@/app/error/page";

describe("ErrorPage", () => {
	it("renders the error page", () => {
		render(<ErrorPage />);

		expect(
			screen.getByText(/sorry, something went wrong/i)
		).toBeInTheDocument();
	});

	it("renders as a paragraph element", () => {
		render(<ErrorPage />);

		const paragraph = screen.getByText(/sorry, something went wrong/i);
		expect(paragraph.tagName).toBe("P");
	});
});
