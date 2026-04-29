import type React from "react";
import PhotoCardContainer, {
	type PhotoCardContainerProps,
} from "@/frontend/features/photos/containers/PhotoCardContainer";

export type PhotoCardProps = PhotoCardContainerProps;

const PhotoCard: React.FC<PhotoCardProps> = (props) => (
	<PhotoCardContainer {...props} />
);

export default PhotoCard;
