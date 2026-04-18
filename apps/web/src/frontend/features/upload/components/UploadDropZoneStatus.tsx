import type React from "react";
import Text from "@/frontend/components/Text";

interface UploadDropZoneStatusProps {
	isUploading: boolean;
	message: string;
	uploadedFile: File | null;
}

const UploadDropZoneStatus: React.FC<UploadDropZoneStatusProps> = ({
	uploadedFile,
	isUploading,
	message,
}) => {
	if (uploadedFile) {
		return (
			<Text as="p" className="mb-6" size="xxl">
				Upload successful!
			</Text>
		);
	}

	if (isUploading) {
		return (
			<>
				<Text as="p" className="mb-6" size="xxl">
					Uploading your file...
				</Text>
				<Text as="p" className="text-white-800" size="m">
					Please wait a moment
				</Text>
			</>
		);
	}

	if (message) {
		return (
			<>
				<Text as="p" className="mb-6" size="xxl">
					Upload failed!
				</Text>
				<Text as="p" className="text-red-500" size="m">
					{message}
				</Text>
			</>
		);
	}

	return (
		<>
			<Text as="p" className="mb-6" size="xl">
				Drag and drop an image, or <span className="underline">Browse</span>
			</Text>
			<Text as="p" className="text-white-800" size="m">
				High resolution images (jpeg)
			</Text>
		</>
	);
};

export default UploadDropZoneStatus;
