"use client";

import type React from "react";
import { useEditRoll } from "@/frontend/providers/EditRollProvider";
import { useToast } from "@/frontend/providers/ToastProvider";
import RollPageDropdownView from "../components/RollPageDropdownView";

export interface RollPageDropdownContainerProps {
	isOwner: boolean;
	name: string;
	ownerId?: string;
	rollId: string;
}

const RollPageDropdownContainer: React.FC<RollPageDropdownContainerProps> = ({
	rollId,
	name,
	isOwner,
	ownerId,
}) => {
	const { openEditor } = useEditRoll();
	const { showToast } = useToast();

	const handleRename = () => {
		openEditor({ rollId, name, type: "renaming" });
	};

	const handleShare = () => {
		const shareUrl = `${window.location.origin}/roll/${rollId}`;
		navigator.clipboard.writeText(shareUrl);
		showToast("Roll link copied to clipboard!", "success");
	};

	const handleDelete = () => {
		openEditor({
			rollId,
			name,
			type: "deleting",
			callbackUrl: `/profile/${ownerId}`,
		});
	};

	return (
		<RollPageDropdownView
			isOwner={isOwner}
			onDelete={handleDelete}
			onRename={handleRename}
			onShare={handleShare}
		/>
	);
};

export default RollPageDropdownContainer;
