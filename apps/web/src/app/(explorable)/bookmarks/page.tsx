"use client";

import Heading from "@/frontend/components/Heading";
import MasonryGallerySection from "@/frontend/sections/MasonryGallerySection/MasonryGallerySection";
import { useAuthStore } from "@/frontend/stores/useAuthStore";

export default function BookmarksPage() {
	const { user, isLoading } = useAuthStore();
	if (isLoading) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-white-500 pt-[175px]">
				<div className="loading loading-spinner loading-xl" />
			</div>
		);
	}
	return (
		<div className="flex min-h-screen w-full flex-col items-center bg-white-500 px-[25px] pt-[175px] md:px-[30px] md:pt-[200px] lg:px-[70px] xl:px-[90px] 2xl:px-[260px]">
			<Heading className="mb-10 text-primary">Your Bookmarks.</Heading>
			<MasonryGallerySection
				type="bookmarks"
				useDatabase={false}
				userId={user?.id}
			/>
		</div>
	);
}
