import Image from "next/image";
import type React from "react";

interface UploadPreviewPanelProps {
	photo: string;
}

const UploadPreviewPanel: React.FC<UploadPreviewPanelProps> = ({ photo }) => {
	return (
		<section
			aria-labelledby="upload-preview-title"
			className="w-full lg:w-auto"
		>
			<h2
				className="text-left font-forum text-[38px] text-primary"
				id="upload-preview-title"
			>
				What it is about?
			</h2>
			<div className="mt-4 flex justify-center lg:block">
				<Image
					alt="Selected upload preview"
					className="h-auto max-w-3/4 rounded-3xl"
					height={900}
					src={photo}
					width={1200}
				/>
			</div>
		</section>
	);
};

export default UploadPreviewPanel;
