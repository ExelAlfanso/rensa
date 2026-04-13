import React, { type KeyboardEvent } from "react";
import TagChip from "../chips/TagChip";
import BaseInputField from "./BaseInputField";

interface TagsInputFieldProps {
	handleTags: (value: string | string[]) => void;
	label?: string;
	placeholder?: string;
	tags: string[];
}

const TagsInputField: React.FC<TagsInputFieldProps> = ({
	label,
	tags,
	handleTags,
	placeholder,
}) => {
	const addTag = (tag: string) => {
		handleTags(tag.trim());
		setInputValue("");
	};
	const removeTag = (tag: string) => {
		const newTags = tags.filter((t) => t !== tag);
		handleTags(newTags);
	};
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			if (inputValue) {
				addTag(inputValue);
			}
		}
	};
	const [inputValue, setInputValue] = React.useState("");
	return (
		<div>
			<div className="mb-2 flex gap-2">
				{tags.map((tag, index) => (
					<TagChip key={index} onClick={() => removeTag(tag)} tag={tag} />
				))}
			</div>
			<BaseInputField
				className="flex-grow"
				label={label}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				type="text"
				value={inputValue}
			/>
		</div>
	);
};

export default TagsInputField;
