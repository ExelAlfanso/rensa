import React from "react";
import IconDropdown from "./IconDropdown";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import DropdownItem from "./DropdownItem";
import { useToast } from "@/providers/ToastProvider";
import { useEditPhoto } from "@/providers/EditPhotoProvider";

interface PhotoDropdownProps {
  photoId: string;
  isOwner: boolean;
}

const PhotoDropdown: React.FC<PhotoDropdownProps> = ({ photoId, isOwner }) => {
  const { openEditor } = useEditPhoto();
  const { showToast } = useToast();
  return (
    <div className="flex items-center justify-center">
      <IconDropdown
        weight="bold"
        className="max-h-40 overflow-y-auto no-scrollbar flex flex-col items-center justify-center font-semibold font-figtree"
        closeOnItemClick={false}
        Tag={DotsThreeVerticalIcon}
        iconSize={24}
      >
        <DropdownItem className="px-10">
          <button
            data-close-dropdown="true"
            onClick={() => {
              const shareUrl = `${window.location.origin}/photos/${photoId}`;
              navigator.clipboard.writeText(shareUrl);
              showToast("Roll link copied to clipboard!", "success");
            }}
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
