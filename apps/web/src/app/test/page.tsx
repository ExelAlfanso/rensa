"use client";

import { useFileUpload } from "@/frontend/hooks/use-file-upload";
import { cn } from "@/utils/cn";

export default function ProfilePage() {
	const {
		photo,
		uploadedFile,
		isUploading,
		isDragOver,
		message,
		fileInputRef,
		handleDragOver,
		handleDragLeave,
		handleBrowseClick,
		handleDrop,
		handleFileChange,
		handleCancel,
	} = useFileUpload();

	return (
		<div className="flex min-h-screen bg-white-200">
			<div
				className={cn(
					"flex h-50 w-50 cursor-pointer flex-col items-center justify-center rounded-full border-white-700 border-dashed transition-all duration-300",
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
					{isUploading && (
						<div className="loading loading-spinner loading-xl mb-6 bg-gray-700" />
					)}
					{photo && !isUploading && (
						<img
							alt="Uploaded"
							className="h-50 w-50 rounded-full object-cover"
							src={photo}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
