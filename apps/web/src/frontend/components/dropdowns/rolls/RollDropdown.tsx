import type React from "react";
import RollDropdownContainer, {
	type RollDropdownContainerProps,
} from "@/frontend/features/rolls/containers/RollDropdownContainer";

type RollDropdownProps = RollDropdownContainerProps;

const RollDropdown: React.FC<RollDropdownProps> = (props) => (
	<RollDropdownContainer {...props} />
);

export default RollDropdown;
