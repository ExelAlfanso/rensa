import { AnimatePresence } from "motion/react";
import Masonry from "react-masonry-css";
import RollPagePhotoCard from "@/frontend/components/RollPagePhotoCard";
import type { PopulatedPhoto } from "@/types/PopulatedPhoto";

interface RollPageMasonryGalleryGridProps {
	isOwner: boolean;
	onPhotoRemoved?: (photoId: string) => void;
	photos: PopulatedPhoto[];
	rollId: string;
}

const RollPageMasonryGalleryGrid: React.FC<RollPageMasonryGalleryGridProps> = ({
	photos,
	rollId,
	onPhotoRemoved,
	isOwner,
}) => {
	const getDynamicColumns = (photoCount: number) => {
		if (photoCount <= 1) {
			return 1;
		}
		if (photoCount === 2) {
			return 2;
		}
		if (photoCount === 3) {
			return 3;
		}
		if (photoCount === 4) {
			return 4;
		}
		return 5;
	};

	const breakpointColumnsObj = {
		default: getDynamicColumns(photos.length),
		1920: Math.min(getDynamicColumns(photos.length), 5),
		1600: Math.min(getDynamicColumns(photos.length), 4),
		1280: Math.min(getDynamicColumns(photos.length), 3),
		900: Math.min(getDynamicColumns(photos.length), 2),
		640: 2,
	};
	const masonryWidthClass = photos.length > 5 ? "w-full" : "w-auto";

	return (
		<AnimatePresence mode="popLayout">
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={`${masonryWidthClass} my-masonry-grid`}
				columnClassName="my-masonry-grid_column"
			>
				{photos.map((photo) => {
					const photoId = photo._id.toString();
					return (
						<RollPagePhotoCard
							id={photoId}
							isOwner={isOwner}
							key={photoId}
							onPhotoRemoved={onPhotoRemoved}
							photo={photo}
							rollId={rollId}
						/>
					);
				})}
			</Masonry>
		</AnimatePresence>
	);
};

export default RollPageMasonryGalleryGrid;
