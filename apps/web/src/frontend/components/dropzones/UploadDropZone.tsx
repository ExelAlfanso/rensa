import { PanoramaIcon } from "@phosphor-icons/react";
import type React from "react";
import { cn } from "@/utils/cn";

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

const UploadDropZone: React.FC<UploadDropZoneProps> = ({
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
		<div
			className={cn(
				"mx-auto my-20 flex h-96 max-w-2xl cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-white-700 border-dashed px-10 transition-all duration-300 md:px-15 lg:px-28",
				isDragOver ? "bg-white-600" : "hover:bg-white-600"
			)}
			onClick={handleBrowseClick}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={(e) => handleDrop(e, 20)}
		>
			<input
				accept="image/jpeg,.jpg,.jpeg"
				className="hidden"
				onChange={(e) => handleFileChange(e, 20)}
				ref={fileInputRef}
				type="file"
			/>
			<div className="flex items-center justify-center">
				{isUploading ? (
					<div className="loading loading-spinner loading-xl mb-6 bg-gray-700" />
				) : (
					<PanoramaIcon size={240} weight={"thin"} />
				)}
			</div>
			<div className="flex flex-col items-center justify-center">{content}</div>
		</div>
	);
};

export default UploadDropZone;
