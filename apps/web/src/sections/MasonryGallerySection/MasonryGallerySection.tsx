"use client";

import React, { useEffect } from "react";
import "@/components/MasonryGallery.css";
import { useInView } from "react-intersection-observer";
import {
  fetchPhotosFromDB,
  fetchPhotosFromRoll,
  Photo,
  FetchPhotosResponse,
  fetchBookmarkedPhotosFromDB,
} from "@/services/PhotoServices";
import { useInfiniteQuery } from "@tanstack/react-query";
import MasonryGalleryGrid from "./MasonryGalleryGrid";
import { PopulatedPhoto } from "@/types/PopulatedPhoto";

interface MasonryGallerySectionProps {
  activeTab?: string;
  filters?: string[];
  useDatabase?: boolean;
  rollId?: string;
  onPhotoClick?: (photo: Photo | string, index: number) => void;
  userId?: string;
}

const TAB_POPULAR = "tab2";
const MasonryGallerySection: React.FC<MasonryGallerySectionProps> = ({
  activeTab,
  filters,
  useDatabase = true,
  rollId,
  userId,
}) => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const sort = activeTab === TAB_POPULAR ? "popular" : "recent";
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<FetchPhotosResponse>({
    queryKey: [
      "photos",
      filters,
      activeTab,
      useDatabase ? "db" : "picsum",
      rollId,
      userId,
    ],
    queryFn: async ({ pageParam }): Promise<FetchPhotosResponse> => {
      const page = pageParam as number;
      if (rollId) {
        return await fetchPhotosFromRoll(rollId, page, filters, sort);
      } else if (useDatabase) {
        return await fetchPhotosFromDB(page, filters, sort);
      } else if (userId) {
        return await fetchBookmarkedPhotosFromDB(userId, page);
      }
      return null as unknown as FetchPhotosResponse;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const photos: PopulatedPhoto[] =
    data?.pages.flatMap((page) => page.data as PopulatedPhoto[]) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Error loading images:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <MasonryGalleryGrid photos={photos} />

      <div
        ref={ref}
        className="flex items-center justify-center w-full py-20"
        role="status"
        aria-live="polite"
      >
        {status === "pending" && (
          <div className="text-black loading loading-spinner loading-xl" />
        )}
        {isFetchingNextPage && (
          <div className="text-black loading loading-spinner loading-lg" />
        )}
        {/* {!hasNextPage && photos.length > 0 && (
          <p className="text-gray-500">No more images to load</p>
        )} */}
      </div>
    </div>
  );
};

export default MasonryGallerySection;
