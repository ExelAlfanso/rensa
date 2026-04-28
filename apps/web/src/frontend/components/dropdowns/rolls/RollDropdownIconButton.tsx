"use client";

import type React from "react";
import RollDropdownIconButtonContainer, {
	type RollDropdownIconButtonContainerProps,
} from "@/frontend/features/rolls/containers/RollDropdownIconButtonContainer";

export type RollDropdownIconButtonProps = RollDropdownIconButtonContainerProps;

const RollDropdownIconButton: React.FC<RollDropdownIconButtonProps> = (
	props
) => {
	return <RollDropdownIconButtonContainer {...props} />;
};

export default RollDropdownIconButton;
