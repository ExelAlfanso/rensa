import { PanoramaIcon } from "@phosphor-icons/react";
import type React from "react";
import { UPLOAD_DROP_ZONE_ACCEPT } from "@/frontend/features/upload/configs/upload.config";
import { cn } from "@/utils/cn";

export interface UploadDropZoneViewProps {
	content?: React.ReactNode;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	isDragOver: boolean;
	isUploading: boolean;
	onDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	onDragOver: (event: React.DragEvent<HTMLElement>) => void;
	onDrop: (event: React.DragEvent<HTMLElement>) => void;
	onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadDropZoneView: React.FC<UploadDropZoneViewProps> = ({
	onDrop,
	onDragOver,
	onDragLeave,
	isDragOver,
	isUploading,
	fileInputRef,
	onFileChange,
	content,
}) => (
	<label
		aria-labelledby="upload-dropzone-title"
		className={cn(
			"mx-auto my-20 flex h-96 max-w-2xl cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-white-700 border-dashed px-10 transition-all duration-300 md:px-15 lg:px-28",
			isDragOver ? "bg-white-600" : "hover:bg-white-600"
		)}
		htmlFor="upload-image-input"
		onDragLeave={onDragLeave}
		onDragOver={onDragOver}
		onDrop={onDrop}
	>
		<input
			accept={UPLOAD_DROP_ZONE_ACCEPT}
			className="hidden"
			id="upload-image-input"
			onChange={onFileChange}
			ref={fileInputRef}
			type="file"
		/>
		<div aria-hidden className="flex items-center justify-center">
			{isUploading ? (
				<div className="loading loading-spinner loading-xl mb-6 bg-gray-700" />
			) : (
				<PanoramaIcon size={240} weight={"thin"} />
			)}
		</div>
		<div className="flex flex-col items-center justify-center">
			<div className="sr-only" id="upload-dropzone-title">
				Upload image drop zone
			</div>
			{content}
		</div>
	</label>
);

export default UploadDropZoneView;
