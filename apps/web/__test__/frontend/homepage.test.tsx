import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/home/page";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
	useScroll: () => ({
		scrollYProgress: { get: () => 0 },
	}),
	useSpring: (value: any) => value,
	useTransform: (_: any, __: any, values: any) => values[0],
}));

jest.mock("@/frontend/components/carousel/Carousel", () => {
	function CarouselMock() {
		return <div data-testid="carousel">CarouselMock</div>;
	}
	return CarouselMock;
});

jest.mock("@/frontend/components/navbar/HomeNavbar", () => {
	function NavbarMock() {
		return <nav data-testid="navbar">NavbarMock</nav>;
	}
	return NavbarMock;
});

jest.mock("@/frontend/components/footer/Footer", () => {
	function FooterMock() {
		return <footer data-testid="footer">FooterMock</footer>;
	}
	return FooterMock;
});

jest.mock("@/sections/HeroSection", () => {
	function HeroMock() {
		return <section data-testid="hero">HeroMock</section>;
	}
	return HeroMock;
});

jest.mock("@/frontend/components/buttons/IconButton", () => {
	function IconButtonMock({ children, ...props }: any) {
		return <button {...props}>{children}</button>;
	}
	return IconButtonMock;
});

jest.mock("@phosphor-icons/react", () => ({
	ArrowArcRightIcon: () => <span>→</span>,
}));

// Mock Next.js <Image /> (because it doesn’t work well in Jest without mock)
jest.mock("next/image", () => {
	function NextImageMock(props: any) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img {...props} alt={props.alt || "mocked image"} />;
	}
	return NextImageMock;
});

// Mock Next.js <Link />
jest.mock("next/link", () => {
	function NextLinkMock({ href, children }: any) {
		return <a href={href}>{children}</a>;
	}
	return NextLinkMock;
});

describe("LandingPage", () => {
	it("renders the landing page without crashing", () => {
		render(<LandingPage />);
		expect(screen.getByTestId("navbar")).toBeInTheDocument();
	});

	it("renders all major sections", () => {
		render(<LandingPage />);

		// Check if major sections are rendered
		expect(screen.getByTestId("navbar")).toBeInTheDocument();
		expect(screen.getByTestId("hero")).toBeInTheDocument();
		expect(screen.getByTestId("carousel")).toBeInTheDocument();
		expect(screen.getByTestId("footer")).toBeInTheDocument();
	});

	it("renders main navigation and footer with correct semantic HTML", () => {
		render(<LandingPage />);

		const navbar = screen.getByTestId("navbar");
		const footer = screen.getByTestId("footer");

		expect(navbar.tagName).toBe("NAV");
		expect(footer.tagName).toBe("FOOTER");
	});

	it("renders the hero section prominently", () => {
		render(<LandingPage />);

		const hero = screen.getByTestId("hero");
		expect(hero.tagName).toBe("SECTION");
	});

	it("renders the carousel for featured content", () => {
		render(<LandingPage />);

		const carousel = screen.getByTestId("carousel");
		expect(carousel).toBeInTheDocument();
	});
});
