import { render, screen } from "@testing-library/react";
import UploadPage from "@/app/upload/page";

// Mock the UploadSection component
jest.mock("@/sections/UploadSection", () => {
	function UploadSectionMock() {
		return (
			<div data-testid="upload-section">
				<h1>Upload Photos</h1>
				<div>Drag and drop your photos here</div>
				<button>Select Files</button>
			</div>
		);
	}
	return UploadSectionMock;
});

describe("UploadPage", () => {
	it("renders the upload page with correct styling", () => {
		const { container } = render(<UploadPage />);

		const mainDiv = container.firstChild as HTMLElement;
		expect(mainDiv).toHaveClass(
			"min-h-screen",
			"flex",
			"flex-col",
			"bg-white-500",
			"items-center",
			"justify-center",
			"text-primary"
		);
	});

	it("renders the upload section", () => {
		render(<UploadPage />);
		expect(screen.getByTestId("upload-section")).toBeInTheDocument();
	});

	it("renders upload page elements", () => {
		render(<UploadPage />);

		expect(
			screen.getByRole("heading", { name: /upload photos/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/drag and drop your photos here/i)
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /select files/i })
		).toBeInTheDocument();
	});
});
