"use client";

import Heading from "@/frontend/components/Heading";
import MasonryGallerySection from "@/frontend/sections/MasonryGallerySection/MasonryGallerySection";
import { useAuthStore } from "@/frontend/stores/useAuthStore";

export default function BookmarksPage() {
	const { user, isLoading } = useAuthStore();
	if (isLoading) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-white-500 pt-43.75">
				<div className="loading loading-spinner loading-xl" />
			</div>
		);
	}
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-white-500 px-6.25 pt-43.75 md:px-7.5 md:pt-50 lg:px-17.5 xl:px-22.5 2xl:px-65">
			<Heading className="mb-10 text-primary">Your Bookmarks.</Heading>
			<MasonryGallerySection
				type="bookmarks"
				useDatabase={false}
				userId={user?.id}
			/>
		</div>
	);
}
