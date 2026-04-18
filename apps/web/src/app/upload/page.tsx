import type { Metadata } from "next";
import UploadPageContainer from "@/frontend/features/upload/containers/UploadPageContainer";

export const metadata: Metadata = {
	title: "Upload Photo",
	description: "Upload your photo recipe to share it with the Rensa community.",
	alternates: {
		canonical: "/upload",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export default function UploadPage() {
	return (
		<main>
			<div className="flex min-h-screen flex-col items-center justify-center bg-white-500 text-primary">
				<UploadPageContainer />
			</div>
		</main>
	);
}
