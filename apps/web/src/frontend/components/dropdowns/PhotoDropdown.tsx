import type React from "react";
import PhotoDropdownContainer, {
	type PhotoDropdownContainerProps,
} from "@/frontend/features/photos/containers/PhotoDropdownContainer";

export type PhotoDropdownProps = PhotoDropdownContainerProps;

const PhotoDropdown: React.FC<PhotoDropdownProps> = (props) => (
	<PhotoDropdownContainer {...props} />
);

export default PhotoDropdown;
