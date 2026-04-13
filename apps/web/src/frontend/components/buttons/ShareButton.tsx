import { CheckIcon, LinkIcon } from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import { useToast } from "@/frontend/providers/ToastProvider";
import AccentButton from "./AccentButton";

interface ShareButtonProps {
	userId: string;
}
const ShareButton: React.FC<ShareButtonProps> = ({ userId }) => {
	const [copied, setCopied] = useState(false);
	const { showToast } = useToast();

	const handleCopy = async () => {
		const profileUrl = `${window.location.origin}/profile/${userId}`;
		setCopied(true);
		try {
			await navigator.clipboard.writeText(profileUrl);
			setTimeout(() => setCopied(false), 1500);
			showToast("Link copied to clipboard!", "success");
		} catch {
			showToast("Failed to copy link.", "error");
		}
	};
	return (
		<AccentButton onClick={handleCopy}>
			{copied ? (
				<>
					<CheckIcon className="mr-2 h-4 w-4" /> Copied!
				</>
			) : (
				<>
					<LinkIcon className="mr-2 h-4 w-4" /> Share
				</>
			)}
		</AccentButton>
	);
};

export default ShareButton;
