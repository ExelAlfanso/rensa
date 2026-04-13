import type React from "react";
import usePhotoRoll from "@/frontend/hooks/use-photo-roll";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import type { PopulatedPhoto } from "@/types/PopulatedPhoto";
import PhotoCardView from "../components/PhotoCardView";

export interface PhotoCardContainerProps {
	closeAllDropdowns: () => void;
	id: string | null;
	isDropdownOpen: boolean;
	onToggleDropdown: React.Dispatch<React.SetStateAction<boolean>>;
	photo: PopulatedPhoto;
}

const PhotoCardContainer: React.FC<PhotoCardContainerProps> = ({
	id,
	photo,
	isDropdownOpen,
	onToggleDropdown,
	closeAllDropdowns,
}) => {
	const {
		selectedRoll,
		setSelectedRoll,
		isLoading,
		isSaved,
		savedToRolls,
		saveToRoll,
		removeFromRoll,
	} = usePhotoRoll(id);
	const { user } = useAuthStore();

	const handleSaveToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (isSaved) {
			removeFromRoll();
			return;
		}
		saveToRoll();
	};

	return (
		<PhotoCardView
			closeAllDropdowns={closeAllDropdowns}
			id={id}
			isDropdownOpen={isDropdownOpen}
			isLoading={isLoading}
			isSaved={isSaved}
			onSaveToggle={handleSaveToggle}
			onToggleDropdown={onToggleDropdown}
			photo={photo}
			savedToRolls={savedToRolls}
			selectedRoll={selectedRoll}
			setSelectedRoll={setSelectedRoll}
			showVisitPageCta={!user}
		/>
	);
};

export default PhotoCardContainer;
