import { XIcon } from "@phosphor-icons/react";
import type React from "react";
import Text from "../Text";

interface TagChipProps {
	disabled?: boolean;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	tag: string;
}

const TagChip: React.FC<TagChipProps> = ({
	tag,
	onClick,
	disabled = false,
}) => {
	return (
		<span className="flex w-20 justify-between gap-2 rounded-full border bg-black p-2 pr-6 pl-4 text-white-200 sm:w-25">
			<Text size="xs">{tag}</Text>
			<button disabled={disabled} onClick={onClick} type="button">
				<XIcon color={"white"} size={10} />
			</button>
		</span>
	);
};

export default TagChip;
