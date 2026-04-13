"use client";
import { DotsThreeCircleIcon } from "@phosphor-icons/react";
import type React from "react";
import { useEditRoll } from "@/frontend/providers/EditRollProvider";
import { useToast } from "@/frontend/providers/ToastProvider";
import DropdownItem from "../DropdownItem";
import IconDropdown from "../IconDropdown";

interface RollPageDropdownProps {
	isOwner: boolean;
	name: string;
	ownerId?: string;
	rollId: string;
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
		<div className={"z-20"}>
			<IconDropdown
				className="no-scrollbar flex max-h-40 flex-col items-center justify-center overflow-y-auto font-figtree font-semibold"
				closeOnItemClick={false}
				iconSize={48}
				Tag={DotsThreeCircleIcon}
				weight="light"
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
