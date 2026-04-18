import type React from "react";
import UploadDropZoneView from "../components/UploadDropZoneView";

export interface UploadDropZoneContainerProps {
	content?: React.ReactNode;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	handleBrowseClick: () => void;
	handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
	handleDrop: (event: React.DragEvent<HTMLElement>) => void;
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
			onDrop={handleDrop}
			onFileChange={handleFileChange}
		/>
	);
};

export default UploadDropZoneContainer;
