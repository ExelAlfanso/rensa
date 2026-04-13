import { render, screen } from "@testing-library/react";
import ExplorePage from "@/app/(explorable)/explore/page";

// Mock the FilterSection component
jest.mock("@/sections/FilterSection", () => {
	function FilterSectionMock() {
		return (
			<div data-testid="filter-section">
				<h1>Explore Photos</h1>
				<div>Filter controls</div>
				<div>Photo Gallery</div>
			</div>
		);
	}
	return FilterSectionMock;
});

describe("ExplorePage", () => {
	it("renders the explore page with correct styling", () => {
		const { container } = render(<ExplorePage />);

		const mainDiv = container.firstChild as HTMLElement;
		expect(mainDiv).toHaveClass(
			"flex",
			"flex-col",
			"items-center",
			"w-full",
			"min-h-screen",
			"bg-white-500"
		);
	});

	it("renders the filter section", () => {
		render(<ExplorePage />);
		expect(screen.getByTestId("filter-section")).toBeInTheDocument();
	});

	it("renders explore page elements", () => {
		render(<ExplorePage />);

		expect(
			screen.getByRole("heading", { name: /explore photos/i })
		).toBeInTheDocument();
		expect(screen.getByText(/filter controls/i)).toBeInTheDocument();
		expect(screen.getByText(/photo gallery/i)).toBeInTheDocument();
	});
});
