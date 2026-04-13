"use client";
import { XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import type React from "react";
import LinkIconButton from "./buttons/LinkIconButton";

interface ImagePreviewProps {
	alt: string;
	height?: number;
	src: string;
	width?: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
	src,
	alt,
	width,
	height,
}) => {
	return (
		<div className="relative flex flex-col items-center justify-center gap-5">
			<LinkIconButton className="self-start" href={"back"} Icon={XIcon} />
			<div className="w-full xl:max-w-2xl">
				<Image
					alt={alt}
					className="rounded-3xl"
					height={height}
					src={src}
					width={width}
				/>
			</div>
		</div>
	);
};
export default ImagePreview;
