"use client";

import { PencilIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEditRoll } from "@/frontend/providers/EditRollProvider";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import { formatDate } from "@/utils/date-formatter";
import SmallIconButton from "../buttons/SmallIconButton";
import Heading from "../Heading";

interface RollCardProps {
	createdAt?: string;
	id: string;
	imageUrls: string[];
	name: string;
	userId?: string; // owner of the roll
}

const RollCard: React.FC<RollCardProps> = ({
	id,
	userId,
	name,
	imageUrls,
	createdAt,
}) => {
	const { user } = useAuthStore();
	const isOwner = user?.id === userId;
	const { openEditor } = useEditRoll();

	const previews = imageUrls.slice(0, 4);
	let previewGridCols = "";
	if (previews.length <= 1) {
		previewGridCols = "grid-cols-1";
	} else if (previews.length === 2) {
		previewGridCols = "grid-cols-1 grid-rows-2";
	} else {
		previewGridCols = "grid-rows-2 grid-cols-2";
	}

	return (
		<Link className="group" href={`/roll/${id}`}>
			<div className="relative h-full w-42.5 cursor-pointer overflow-hidden rounded-2xl border border-gray-300 bg-white p-3 shadow-md transition-transform duration-200 hover:scale-[1.02] md:w-66.25">
				<div className={`grid gap-2.5 ${previewGridCols}`}>
					{previews.length < 1 && (
						<div className="flex aspect-square max-h-37.5 w-full items-center justify-center rounded-lg bg-gray-200 md:max-h-50">
							<span className="text-gray-500">No image</span>
						</div>
					)}
					{previews.map((url, idx) => {
						const count = previews.length;
						const baseClass = "relative w-full aspect-square";
						let sizeClass = "";
						if (count === 1) {
							sizeClass = "max-h-[150px] md:max-h-[200px]";
						} else if (count === 2 || count === 3 || count === 4) {
							sizeClass = "max-h-[40px] md:max-h-[90px]";
						}
						const spanClass = count === 3 && idx === 2 ? "col-span-2" : "";
						const photoClass = `${baseClass} ${sizeClass} ${spanClass}`;

						return (
							<div className={photoClass} key={url}>
								<Image
									alt={name}
									className="rounded-lg object-cover"
									fill
									src={url}
								/>
							</div>
						);
					})}
				</div>

				<Heading className="mt-2 font-forum text-black" size="s">
					{name}
				</Heading>

				{createdAt && (
					<p className="text-gray-500 text-sm">{formatDate(createdAt)}</p>
				)}

				<div className="pointer-events-none absolute inset-0 rounded-2xl bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

				{/* Edit button (only for owner) */}
				{isOwner && (
					<div className="pointer-events-auto absolute top-3 right-3">
						<SmallIconButton
							className="rounded-full bg-white p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								openEditor({ rollId: id, name, type: "default" });
							}}
						>
							<PencilIcon size={16} weight="bold" />
						</SmallIconButton>
					</div>
				)}
			</div>
		</Link>
	);
};

export default RollCard;
