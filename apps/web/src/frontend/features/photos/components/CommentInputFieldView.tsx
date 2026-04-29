import { ChatTeardropIcon } from "@phosphor-icons/react";
import Link from "next/link";
import type React from "react";
import InputField from "@/frontend/components/inputfields/InputField";

interface CommentInputFieldViewProps {
	comment: string;
	onChangeComment: (value: string) => void;
	onSubmit: () => Promise<void>;
	userExists: boolean;
}

const CommentInputFieldView: React.FC<CommentInputFieldViewProps> = ({
	comment,
	onChangeComment,
	onSubmit,
	userExists,
}) => (
	<div className="relative mt-4">
		<InputField
			disabled={!userExists}
			Icon={ChatTeardropIcon}
			iconPosition="left"
			onChange={(e) => onChangeComment(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					onSubmit().catch(() => undefined);
				}
			}}
			placeholder={`  ${userExists ? "Comment" : "Log in to comment..."}`}
			size="m"
			type="text"
			value={comment}
		/>
		{!userExists && (
			<Link
				className="absolute top-0 left-0 h-full w-full rounded-3xl bg-transparent transition-all duration-200 hover:bg-gray-50 hover:opacity-50"
				href="/login"
			/>
		)}
	</div>
);

export default CommentInputFieldView;
