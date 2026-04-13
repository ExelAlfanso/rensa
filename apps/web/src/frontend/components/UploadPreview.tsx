import Image from "next/image";
import type React from "react";
import Heading from "./Heading";

interface UploadPreviewProps {
	photo: string;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ photo }) => {
	return (
		<div className="flex flex-col items-center justify-center lg:block">
			<Heading alignment="left" size="l">
				What it is about?
			</Heading>
			<Image
				alt={"image"}
				className="h-auto max-w-3/4 rounded-3xl"
				height={900}
				src={photo}
				width={1200}
			/>
		</div>
	);
};

export default UploadPreview;
