import type React from "react";
import PhotoInfoCardContainer, {
	type PhotoInfoCardContainerProps,
} from "@/frontend/features/photos/containers/PhotoInfoCardContainer";

export interface PhotoInfoCardProps extends PhotoInfoCardContainerProps {
	bookmarks?: number;
	children?: React.ReactNode;
}

const PhotoInfoCard: React.FC<PhotoInfoCardProps> = (props) => {
	return <PhotoInfoCardContainer {...props} />;
};

export default PhotoInfoCard;
