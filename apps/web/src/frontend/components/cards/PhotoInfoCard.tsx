"use client";

import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import BookmarkToggleContainer from "@/frontend/features/photos/containers/BookmarkToggleContainer";
import usePhotoRoll from "@/frontend/hooks/use-photo-roll";
import CommentSection from "@/frontend/sections/CommentSection";
import { fetchProfile } from "@/frontend/services/profile.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import type { PhotoMetadata } from "@/frontend/types/photo";
import { formatDate } from "@/utils/date-formatter";
import ProfileBadge from "../badges/ProfileBadge";
import PrimaryButton from "../buttons/PrimaryButton";
import PhotoDropdown from "../dropdowns/PhotoDropdown";
import RollDropdownIconButton from "../dropdowns/rolls/RollDropdownIconButton";
import Heading from "../Heading";
import RecipeList from "../lists/RecipeList";

interface PhotoInfoCardProps {
	bookmarks?: number;
	children?: React.ReactNode;
	className?: string;
	description?: string;
	id: string;
	initialBookmarks?: number;
	metadata?: PhotoMetadata;
	ownerId: string;
	title?: string;
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
	const { data: profile } = useQuery({
		queryKey: ["ownerId", ownerId],
		queryFn: () => fetchProfile(ownerId),
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

	return (
		<div
			className={`flex flex-col gap-1.5 bg-white-200 ${className} w-full rounded-3xl p-10 text-primary shadow-lg lg:max-w-3xl xl:w-[40%]`}
			id={id}
		>
			{user?.id && (
				<div className="inline-flex w-full items-center justify-between">
					<BookmarkToggleContainer
						initialBookmarks={initialBookmarks}
						photoId={id}
					/>
					<div className="inline-flex gap-5">
						<RollDropdownIconButton
							disabled={isLoading || isSaved}
							isOpen={isDropdownOpen}
							savedToRolls={savedToRolls}
							selectedRoll={selectedRoll}
							setIsOpen={setIsDropdownOpen}
							setSelectedRoll={setSelectedRoll}
						/>
						<PrimaryButton onClick={isSaved ? removeFromRoll : saveToRoll}>
							{isSaved ? "Saved" : "Save"}
						</PrimaryButton>

						<PhotoDropdown isOwner={user?.id === ownerId} photoId={id} />
					</div>
				</div>
			)}
			<div className="mb-9">
				<div className="mb-7">
					<Text className="text-white-700" size="s">
						{formatDate(metadata?.uploadedAt || "")}
					</Text>
					<Heading size="m">{title}</Heading>
				</div>
				<ProfileBadge
					alt={profile?.username}
					avatarUrl={profile?.avatarUrl}
					className="mb-5"
					href={`/profile/${ownerId}`}
					username={profile?.username || "loading..."}
				/>
				<p className="max-w-[350px] text-[16px] text-black-200">
					{description}
				</p>
			</div>
			<div>
				<RecipeList metadata={metadata} />
			</div>
			<CommentSection id={id} />
		</div>
	);
};

export default PhotoInfoCard;
