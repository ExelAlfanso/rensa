"use client";
import { DotsThreeCircleIcon } from "@phosphor-icons/react";
import React from "react";
import IconDropdown from "../IconDropdown";
import DropdownItem from "../DropdownItem";
import { useEditRoll } from "@/providers/EditRollProvider";
import { useToast } from "@/providers/ToastProvider";

interface RollPageDropdownProps {
  rollId: string;
  name: string;
  isOwner: boolean;
  ownerId?: string;
}

const RollPageDropdown: React.FC<RollPageDropdownProps> = ({
  rollId,
  name,
  isOwner,
  ownerId,
}) => {
  const { openEditor } = useEditRoll();
  const { showToast } = useToast();
  return (
    <div className={`z-20`}>
      <IconDropdown
        closeOnItemClick={false}
        weight="light"
        className="max-h-40 overflow-y-auto no-scrollbar flex flex-col items-center justify-center font-semibold font-figtree"
        Tag={DotsThreeCircleIcon}
        iconSize={48}
      >
        {isOwner && (
          <DropdownItem
            className="px-10"
            onClick={() => openEditor({ rollId, name, type: "renaming" })}
          >
            Rename
          </DropdownItem>
        )}
        <DropdownItem
          className="px-10"
          onClick={() => {
            const shareUrl = `${window.location.origin}/roll/${rollId}`;
            navigator.clipboard.writeText(shareUrl);
            showToast("Roll link copied to clipboard!", "success");
          }}
        >
          Share
        </DropdownItem>
        {isOwner && (
          <DropdownItem
            className="px-10"
            onClick={() =>
              openEditor({
                rollId,
                name,
                type: "deleting",
                callbackUrl: `/profile/${ownerId}`,
              })
            }
          >
            Delete
          </DropdownItem>
        )}
      </IconDropdown>
    </div>
  );
};

export default RollPageDropdown;
