"use client";

import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import usePhotoRoll from "@/frontend/hooks/use-photo-roll";
import { fetchProfile } from "@/frontend/services/profile.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import type { PhotoMetadata } from "@/frontend/types/photo";
import PhotoInfoCardView from "../components/PhotoInfoCardView";

export interface PhotoInfoCardContainerProps {
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

const PhotoInfoCardContainer: React.FC<PhotoInfoCardContainerProps> = ({
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
		<PhotoInfoCardView
			className={className}
			description={description}
			id={id}
			initialBookmarks={initialBookmarks}
			isDropdownOpen={isDropdownOpen}
			isLoading={isLoading}
			isOwner={user?.id === ownerId}
			isSaved={isSaved}
			metadata={metadata}
			onSaveToggle={isSaved ? removeFromRoll : saveToRoll}
			ownerId={ownerId}
			profileAvatarUrl={profile?.avatarUrl}
			profileUsername={profile?.username}
			savedToRolls={savedToRolls}
			selectedRoll={selectedRoll}
			setIsDropdownOpen={setIsDropdownOpen}
			setSelectedRoll={setSelectedRoll}
			title={title}
			userId={user?.id}
		/>
	);
};

export default PhotoInfoCardContainer;
