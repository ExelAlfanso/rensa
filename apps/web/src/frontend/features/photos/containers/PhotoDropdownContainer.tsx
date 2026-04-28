import type React from "react";
import { useEditPhoto } from "@/frontend/providers/EditPhotoProvider";
import { useToast } from "@/frontend/providers/ToastProvider";
import PhotoDropdownView from "../components/PhotoDropdownView";

export interface PhotoDropdownContainerProps {
	isOwner: boolean;
	photoId: string;
}

const PhotoDropdownContainer: React.FC<PhotoDropdownContainerProps> = ({
	photoId,
	isOwner,
}) => {
	const { openEditor } = useEditPhoto();
	const { showToast } = useToast();

	const handleShare = () => {
		const shareUrl = `${window.location.origin}/photos/${photoId}`;
		navigator.clipboard.writeText(shareUrl);
		showToast("Roll link copied to clipboard!", "success");
	};

	const handleDelete = () => {
		openEditor({ photoId, isOwner });
	};

	return (
		<PhotoDropdownView
			isOwner={isOwner}
			onDelete={handleDelete}
			onShare={handleShare}
		/>
	);
};

export default PhotoDropdownContainer;
