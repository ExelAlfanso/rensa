import RollPagePhotoCardContainer, {
	type RollPagePhotoCardContainerProps,
} from "@/frontend/features/photos/containers/RollPagePhotoCardContainer";
import type { PopulatedPhoto } from "@/types/PopulatedPhoto";

export interface RollPagePhotoCardProps
	extends RollPagePhotoCardContainerProps {
	id: string;
	isOwner: boolean;
	onPhotoRemoved?: (photoId: string) => void;
	photo: PopulatedPhoto;
	rollId: string;
}

const RollPagePhotoCard: React.FC<RollPagePhotoCardProps> = (props) => (
	<RollPagePhotoCardContainer {...props} />
);

export default RollPagePhotoCard;
