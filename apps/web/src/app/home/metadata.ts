import type { Metadata } from "next";

export const homeMetadata: Metadata = {
	title:
		"Rensa - Where Every Picture Tells Its Recipe | Photo Sharing Platform",
	description:
		"Discover photography inspiration on Rensa. Explore creative photo recipes, share your vision, and learn the techniques behind stunning photos. Join our community of photographers.",
	keywords: [
		"photography",
		"photo sharing",
		"photo inspiration",
		"photography techniques",
		"photo community",
		"creative photography",
		"photo recipes",
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://rensa.site",
		title: "Rensa - Where Every Picture Tells Its Recipe",
		description:
			"Discover photography inspiration on Rensa. Explore creative photo recipes, share your vision, and learn the techniques behind stunning photos.",
		siteName: "Rensa",
		images: [
			{
				url: "https://rensa.site/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Rensa - Photography sharing platform",
				type: "image/jpeg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Rensa - Where Every Picture Tells Its Recipe",
		description:
			"Discover photography inspiration and learn photo techniques on Rensa.",
		creator: "@rensaphoto",
		images: ["https://rensa.site/og-image.jpg"],
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};
