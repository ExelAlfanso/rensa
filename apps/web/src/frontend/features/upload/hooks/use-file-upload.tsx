"use client";
import { useCallback, useRef, useState } from "react";
import {
	isAcceptedPhotoUploadFile,
	PHOTO_UPLOAD_MAX_INPUT_SIZE_BYTES,
	PHOTO_UPLOAD_MAX_INPUT_SIZE_MB,
} from "@/shared/configs/photo-upload.config";

export function useFileUpload() {
	const [photo, setPhoto] = useState("");
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState("");

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);
	const handleBrowseClick = () => {
		fileInputRef.current?.click();
	};
	const handleFileSelect = useCallback((file: File) => {
		const isWithinAllowedSize = file.size <= PHOTO_UPLOAD_MAX_INPUT_SIZE_BYTES;
		if (!isWithinAllowedSize) {
			setMessage(
				`Image must be ${PHOTO_UPLOAD_MAX_INPUT_SIZE_MB}MB or smaller.`
			);
			return;
		}

		if (!isAcceptedPhotoUploadFile(file)) {
			setMessage("Only JPG/JPEG files are allowed.");
			return;
		}
		// setUploadedFile(null);
		setUploadedFile(file);
		setMessage("");
		setIsUploading(true);

		const previewFile = URL.createObjectURL(file);
		setPhoto(previewFile);

		setTimeout(() => {
			setIsUploading(false);
			// console.log("File selected:", file.name);
		}, 800);
		// console.log("Selected file:", uploadedFile);
	}, []);
	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			const files = e.dataTransfer.files;

			if (files && files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[handleFileSelect]
	);
	//TODO: handle file change from input type file, can be photo, profile, document, etc.
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleCancel = () => {
		setMessage("");
		setUploadedFile(null);
		setIsUploading(false);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return {
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
	};
}
