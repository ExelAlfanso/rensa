"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import type React from "react";
import IconInputField from "./IconInputField";

interface SearchInputFieldProps {
	className?: string;
}

const SearchInputField: React.FC<SearchInputFieldProps> = ({ className }) => {
	return (
		<IconInputField
			className={className}
			Icon={MagnifyingGlassIcon}
			iconPosition="right"
			onChange={(e) => console.log(e.target.value)}
			placeholder="Search"
			type="text"
		/>
	);
};

export default SearchInputField;
