import { ChatTeardropIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import type { CommentType } from "@/frontend/sections/CommentSection";
import { commentPhoto } from "@/frontend/services/photo-post.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import InputField from "./InputField";

interface CommentInputFieldProps {
	id?: string;
	onAddComment: (c: CommentType) => void;
}

const CommentInputField: React.FC<CommentInputFieldProps> = ({
	id,
	onAddComment,
}) => {
	const { user } = useAuthStore();
	const [comment, setComment] = useState("");

	const handleSubmit = async () => {
		if (!comment.trim()) {
			return;
		}

		const tempId = Math.random().toString(36).substr(2, 9);

		const newComment: CommentType = {
			_id: tempId,
			text: comment,
			userId: {
				_id: user?.id || "unknown",
				username: user?.name || "Anonymous",
				avatarUrl: user?.image || "/profile.jpg",
			},
			createdAt: new Date().toISOString(),
		};

		onAddComment(newComment);
		setComment("");
		await commentPhoto(newComment, id || "", user?.id);
	};

	return (
		<div className="relative mt-4">
			<InputField
				disabled={!user}
				Icon={ChatTeardropIcon}
				iconPosition="left"
				onChange={(e) => setComment(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						handleSubmit();
					}
				}}
				placeholder={`  ${user ? "Comment" : "Log in to comment..."}`}
				size="m"
				type="text"
				value={comment}
			/>
			{!user && (
				<Link
					className="absolute top-0 left-0 h-full w-full rounded-3xl bg-transparent transition-all duration-200 hover:bg-gray-50 hover:opacity-50"
					href="/login"
				/>
			)}
		</div>
	);
};

export default CommentInputField;
