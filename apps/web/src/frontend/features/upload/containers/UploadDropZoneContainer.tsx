import type React from "react";
import UploadDropZoneView from "../components/UploadDropZoneView";

const FILE_SIZE_LIMIT_MB = 20;

export interface UploadDropZoneContainerProps {
	content?: React.ReactNode;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	handleBrowseClick: () => void;
	handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
	handleDrop: (event: React.DragEvent<HTMLElement>, sizeLimit: number) => void;
	handleFileChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		size: number
	) => void;
	isDragOver: boolean;
	isUploading: boolean;
}

const UploadDropZoneContainer: React.FC<UploadDropZoneContainerProps> = ({
	handleBrowseClick,
	handleDrop,
	handleDragOver,
	handleDragLeave,
	isDragOver,
	isUploading,
	fileInputRef,
	handleFileChange,
	content,
}) => {
	return (
		<UploadDropZoneView
			content={content}
			fileInputRef={fileInputRef}
			isDragOver={isDragOver}
			isUploading={isUploading}
			onBrowseClick={handleBrowseClick}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={(event) => handleDrop(event, FILE_SIZE_LIMIT_MB)}
			onFileChange={(event) => handleFileChange(event, FILE_SIZE_LIMIT_MB)}
		/>
	);
};

export default UploadDropZoneContainer;
