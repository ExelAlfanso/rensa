import type { Metadata } from "next";
import ExplorePageContainer from "@/frontend/features/explore/containers/ExplorePageContainer";

export const metadata: Metadata = {
	title: "Explore Photography Ideas",
	description:
		"Browse curated photography inspiration, discover creative styles, and learn visual recipes from the Rensa community.",
	alternates: {
		canonical: "/explore",
	},
	openGraph: {
		title: "Explore Photography Ideas | Rensa",
		description:
			"Browse curated photography inspiration, discover creative styles, and learn visual recipes from the Rensa community.",
		url: "/explore",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Explore Photography Ideas | Rensa",
		description:
			"Browse curated photography inspiration, discover creative styles, and learn visual recipes from the Rensa community.",
	},
};

export default function ExplorePage() {
	return <ExplorePageContainer />;
}
