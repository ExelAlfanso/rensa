"use client";
import Heading from "@/components/Heading";
import MasonryGallerySection from "@/sections/MasonryGallerySection/MasonryGallerySection";
import { useAuthStore } from "@/stores/useAuthStore";

export default function BookmarksPage() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-white-500 w-full pt-[175px] md:pt-[200px]  px-[25px] md:px-[30px] lg:px-[70px] xl:px-[90px] 2xl:px-[260px] flex flex-col items-center">
      <Heading className="text-primary mb-10">Your Bookmarks.</Heading>
      <MasonryGallerySection
        useDatabase={false}
        userId={user?.id}
      ></MasonryGallerySection>
    </div>
  );
}
