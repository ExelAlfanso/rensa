import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import type React from "react";
import { useEditPhoto } from "@/frontend/providers/EditPhotoProvider";
import { useToast } from "@/frontend/providers/ToastProvider";
import DropdownItem from "./DropdownItem";
import IconDropdown from "./IconDropdown";

interface PhotoDropdownProps {
	isOwner: boolean;
	photoId: string;
}

const PhotoDropdown: React.FC<PhotoDropdownProps> = ({ photoId, isOwner }) => {
	const { openEditor } = useEditPhoto();
	const { showToast } = useToast();
	return (
		<div className="flex items-center justify-center">
			<IconDropdown
				className="no-scrollbar flex max-h-40 flex-col items-center justify-center overflow-y-auto font-figtree font-semibold"
				closeOnItemClick={false}
				iconSize={24}
				Tag={DotsThreeVerticalIcon}
				weight="bold"
			>
				<DropdownItem className="px-10">
					<button
						data-close-dropdown="true"
						onClick={() => {
							const shareUrl = `${window.location.origin}/photos/${photoId}`;
							navigator.clipboard.writeText(shareUrl);
							showToast("Roll link copied to clipboard!", "success");
						}}
						type="button"
					>
						Share
					</button>
				</DropdownItem>
				{isOwner && (
					<DropdownItem
						className="px-10"
						onClick={() => openEditor({ photoId, isOwner })}
					>
						Delete
					</DropdownItem>
				)}
			</IconDropdown>
		</div>
	);
};

export default PhotoDropdown;
