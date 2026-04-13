"use client";
import type React from "react";
import RollPageDropdownContainer, {
	type RollPageDropdownContainerProps,
} from "@/frontend/features/rolls/containers/RollPageDropdownContainer";

type RollPageDropdownProps = RollPageDropdownContainerProps;

const RollPageDropdown: React.FC<RollPageDropdownProps> = (props) => {
	return <RollPageDropdownContainer {...props} />;
};

export default RollPageDropdown;
