"use client";

import type React from "react";
import TertiaryDropdown from "../TertiaryDropdown";

interface ProfileRollFilterDropdownProps {
	setFilter?: (filter: string) => void;
}

const ProfileRollFilterDropdown: React.FC<ProfileRollFilterDropdownProps> = ({
	setFilter,
}) => {
	const filters = ["Latest", "Oldest"];
	return (
		<TertiaryDropdown
			className="w-35"
			initialValue={"Latest"}
			onChange={(value) => setFilter?.(value.toLowerCase().replace(" ", "-"))}
			values={filters}
		/>
	);
};

export default ProfileRollFilterDropdown;
