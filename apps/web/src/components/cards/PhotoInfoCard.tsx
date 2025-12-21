"use client";

import React, { use, useEffect, useState } from "react";
import Heading from "../Heading";
import Text from "../Text";

import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { formatDate } from "@/utils/DateFormatter";
import { PhotoMetadata } from "@/models/Photo";
import RecipeList from "../lists/RecipeList";
import ProfileBadge from "../badges/ProfileBadge";
import { api } from "@/lib/axios";
import PrimaryButton from "../buttons/PrimaryButton";
import CommentSection from "@/sections/CommentSection";
import RollDropdownIconButton from "../dropdowns/rolls/RollDropdownIconButton";
import usePhotoRoll from "@/hooks/usePhotoRoll";
import { useAuthStore } from "@/stores/useAuthStore";
import { bookmarkPhoto } from "@/services/PhotoPostServices";
import { fetchUserBookmarkedPhotos } from "@/services/PhotoServices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile } from "@/services/ProfileServices";
import { redirect } from "next/navigation";
interface PhotoInfoCardProps {
  id: string;
  className?: string;
  bookmarks?: number;
  initialBookmarks?: number;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  ownerId: string;
  metadata?: PhotoMetadata;
}

const PhotoInfoCard: React.FC<PhotoInfoCardProps> = ({
  id,
  className,
  title,
  initialBookmarks,
  description,
  metadata,
  ownerId,
}) => {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isBookmarkedState, setIsBookmarked] = useState(false);

  const { data: isBookmarked = false } = useQuery({
    queryKey: ["isPhotoBookmarked", user?.id, id],
    queryFn: async () => {
      if (!user?.id) return false;
      const bookmarkedPhotos = await fetchUserBookmarkedPhotos(user.id);
      return bookmarkedPhotos.includes(id || "");
    },
  });
  useEffect(() => {
    setIsBookmarked(isBookmarked);
  }, [isBookmarked]);
  const { data: profile } = useQuery({
    queryKey: ["ownerId", ownerId],
    queryFn: async () => await fetchProfile(ownerId),
    staleTime: 5 * 60 * 1000,
    enabled: !!ownerId,
  });
  const {
    selectedRoll,
    isLoading,
    isSaved,
    setSelectedRoll,
    savedToRolls,
    saveToRoll,
    removeFromRoll,
  } = usePhotoRoll(id || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleBookmarkToggle = async () => {
    if (!user?.id) redirect("/login");
    setIsBookmarked((prev: boolean) => !prev);
    setBookmarks((prev) =>
      isBookmarkedState ? (prev || 0) - 1 : (prev || 0) + 1
    );
    try {
      const action = isBookmarkedState ? "decrement" : "increment";
      const res = await bookmarkPhoto(user?.id, id || "", action);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      id={id}
      className={`flex flex-col gap-1.5 bg-white-200 ${className} shadow-lg p-10 rounded-3xl text-primary w-full lg:max-w-3xl xl:w-[40%]`}
    >
      {user?.id && (
        <div className="inline-flex items-center justify-between w-full">
          <span className="text-black inline-flex items-center justify-center">
            <Text size="s">{bookmarks}</Text>
            <button onClick={handleBookmarkToggle}>
              {isBookmarkedState ? (
                <BookmarkSimpleIcon
                  weight="fill"
                  size={24}
                  className="hover:scale-110 transition-transform cursor-pointer focus:border-0"
                />
              ) : (
                <BookmarkSimpleIcon
                  weight="regular"
                  size={24}
                  className="hover:scale-110 transition-transform cursor-pointer focus:border-0"
                />
              )}
            </button>
          </span>
          <div className="inline-flex gap-5">
            <RollDropdownIconButton
              isOpen={isDropdownOpen}
              setIsOpen={setIsDropdownOpen}
              selectedRoll={selectedRoll}
              setSelectedRoll={setSelectedRoll}
              savedToRolls={savedToRolls}
              disabled={isLoading || isSaved}
            />

            <PrimaryButton onClick={isSaved ? removeFromRoll : saveToRoll}>
              {isLoading ? "Loading..." : isSaved ? "Saved" : "Save"}
            </PrimaryButton>
          </div>
        </div>
      )}
      <div className="mb-9">
        <div className="mb-7">
          <Text size="s" className="text-white-700">
            {formatDate(metadata?.uploadedAt || "")}
          </Text>
          <Heading size="m">{title}</Heading>
        </div>
        <ProfileBadge
          avatarUrl={profile?.avatarUrl}
          username={profile?.username || "loading..."}
          alt={profile?.username}
          href={`/profile/${ownerId}`}
          className="mb-5"
        />
        <p className="text-[16px] text-black-200 max-w-[350px]">
          {description}
        </p>
      </div>
      <div>
        <RecipeList metadata={metadata}></RecipeList>
      </div>
      <CommentSection id={id}></CommentSection>
    </div>
  );
};

export default PhotoInfoCard;
