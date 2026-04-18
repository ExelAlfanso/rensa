import type { Metadata } from "next";
import BookmarksPageClient from "./BookmarksPageClient";

export const metadata: Metadata = {
	title: "Your Bookmarks",
	description: "Your saved photos on Rensa.",
	alternates: {
		canonical: "/bookmarks",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function BookmarksPage() {
	return <BookmarksPageClient />;
}
