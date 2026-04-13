import type React from "react";
import UploadDropZoneContainer from "@/frontend/features/upload/containers/UploadDropZoneContainer";

interface UploadDropZoneProps {
	content?: React.ReactNode;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	handleBrowseClick: () => void;
	handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
	handleDrop: (
		event: React.DragEvent<HTMLDivElement>,
		sizeLimit: number
	) => void;
	handleFileChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		size: number
	) => void;
	isDragOver: boolean;
	isUploading: boolean;
}

const UploadDropZone: React.FC<UploadDropZoneProps> = (props) => {
	return <UploadDropZoneContainer {...props} />;
};

export default UploadDropZone;
