import { TrashIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/frontend/providers/ToastProvider";
import { removePhotoFromRoll } from "@/frontend/services/roll.service";
import type { PopulatedPhoto } from "@/types/PopulatedPhoto";
import { cn } from "@/utils/cn";
import SmallIconButton from "./buttons/SmallIconButton";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

interface RollPagePhotoCardProps {
	id: string;
	isOwner: boolean;
	onPhotoRemoved?: (photoId: string) => void;
	photo: PopulatedPhoto;
	rollId: string;
}

const RollPagePhotoCard: React.FC<RollPagePhotoCardProps> = ({
	id,
	photo,
	rollId,
	onPhotoRemoved,
	isOwner,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { showToast } = useToast();
	const handleUnsaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			setIsLoading(true);
			await removePhotoFromRoll(rollId, id);
			if (onPhotoRemoved) {
				onPhotoRemoved(id);
			}
			showToast("Photo removed from roll successfully", "success");
		} catch (error) {
			console.error("Failed to remove photo from roll:", error);
			showToast("Failed to remove photo from roll", "error");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			animate={{ opacity: 1 }}
			className="m-3 mb-5"
			exit={{ opacity: 0 }}
			initial={{ opacity: 0 }}
			layout
			transition={{ duration: 0.35, ease: "easeOut" }}
		>
			<Link href={id ? `/photo/${id}` : "#"} prefetch={false}>
				<div className="group relative cursor-pointer overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-[1.02]">
					<ImageWithSkeleton
						image={{
							src: photo.url,
							alt: photo.title,
							width: 350,
							height: 450,
						}}
					/>

					<div className="pointer-events-none absolute inset-0 rounded-3xl bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-40" />

					{isOwner && (
						<div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<div className="pointer-events-auto absolute top-3 right-3">
								<SmallIconButton
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-colors duration-200 hover:bg-gray-200",
										isLoading && "cursor-wait opacity-70"
									)}
									disabled={isLoading}
									onClick={handleUnsaveClick}
								>
									{isLoading ? (
										<div className="loading loading-spinner text-current" />
									) : (
										<TrashIcon size={16} weight="bold" />
									)}
								</SmallIconButton>
							</div>
						</div>
					)}
				</div>
			</Link>
		</motion.div>
	);
};

export default RollPagePhotoCard;
