"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import PrimaryButton from "@/frontend/components/buttons/PrimaryButton";
import TertiaryButton from "@/frontend/components/buttons/TertiaryButton";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/data/cameraDatas";
import { useExifDetection } from "@/frontend/hooks/use-exif-detection";
import { useFileUpload } from "@/frontend/hooks/use-file-upload";
import { useLoading } from "@/frontend/hooks/use-loading";
import { uploadFormData } from "@/frontend/services/upload.service";
import { useAuthStore } from "@/frontend/stores/useAuthStore";
import UploadDropZone from "../components/dropzones/UploadDropZone";
import UploadForm from "../components/forms/UploadForm";
import Heading from "../components/Heading";
import Text from "../components/Text";
import UploadPreview from "../components/UploadPreview";

const UploadSection: React.FC = () => {
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
	const user = useAuthStore((state) => state.user);
	const { setLoading } = useLoading();

	const [error, setError] = useState<string>("");
	const [form, setForm] = useState<{
		title: string;
		description: string;
		tags: string[];
		category: string;
		style: string;
		color: string;
		camera: string;
		exif: CameraSettings;
	}>({
		title: "",
		description: "",
		tags: [],
		category: "",
		style: "",
		color: "",
		camera: "",
		exif: defaultCameraSettings.Fujifilm,
	});

	const handleExifChange = (
		field: string,
		value: number | object | string | CameraSettings["Brand"]
	) => {
		if (field === "Brand") {
			const newExif = defaultCameraSettings[value as CameraSettings["Brand"]];
			setForm((prev) => ({ ...prev, exif: newExif }));
		} else {
			setForm((prev) => ({ ...prev, exif: { ...prev.exif, [field]: value } }));
		}
	};
	const {
		isDetecting,
		detectAndApplyExif,
		settings,
		selectedCamera,
		setSelectedCamera,
		setSettings,
	} = useExifDetection(uploadedFile, handleExifChange);

	const handleTagsChange = (value: string | string[]) => {
		if (typeof value === "string") {
			if (!value.trim() || form.tags.includes(value.trim())) {
				return;
			}
			setForm((prev) => ({ ...prev, tags: [...prev.tags, value.trim()] }));
		} else {
			setForm((prev) => ({ ...prev, tags: [...value] }));
		}
	};
	const handleCancelButton = () => {
		handleCancel();
		setForm({
			title: "",
			description: "",
			tags: [],
			category: "",
			style: "",
			color: "",
			camera: "",
			exif: defaultCameraSettings.Fujifilm,
		});
	};
	const validateForm = () => {
		if (!form.title.trim()) {
			setError("Title is required!");
			return false;
		}
		if (!form.description.trim()) {
			setError("Description is required!");
			return false;
		}
		if (!form.tags || form.tags.length === 0) {
			setError("At least one tag is required!");
			return false;
		}

		if (!photo) {
			setError("No photo selected!");
			return false;
		}
		return true;
	};
	const handleUpload = async () => {
		setError("");
		if (!user?.id) {
			setError("You must be logged in to upload.");
			return;
		}
		if (!validateForm()) {
			return;
		}
		const tagsWithBrand = [...form.tags, form.exif.Brand.toLowerCase()];

		const formData = new FormData();
		if (uploadedFile) {
			formData.append("file", uploadedFile);
		}
		formData.append("userId", user?.id || "");
		formData.append("title", form.title);
		formData.append("description", form.description);
		formData.append("category", form.category.toLowerCase());
		formData.append("style", form.style.toLowerCase());
		formData.append("color", form.color.toLowerCase());
		formData.append("camera", form.camera.toLowerCase());
		formData.append("tags", JSON.stringify(tagsWithBrand));
		formData.append("exif", JSON.stringify(form.exif));

		setLoading(true);
		try {
			await uploadFormData(formData);
			router.push("/explore");
		} catch (err) {
			console.error("Upload failed:", err);
			setError("Upload failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field: string, value: string | string[]) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setError("");
	};
	const router = useRouter();
	let content: React.ReactNode;

	if (uploadedFile) {
		content = (
			<Text className="mb-6" size="xxl">
				Upload successful!
			</Text>
		);
	} else if (isUploading) {
		content = (
			<>
				<Text className="mb-6" size="xxl">
					Uploading your file...
				</Text>
				<Text className="text-white-800" size="m">
					Please wait a moment
				</Text>
			</>
		);
	} else if (message) {
		content = (
			<>
				<Text className="mb-6" size="xxl">
					Upload failed!
				</Text>
				<Text className="text-red-500" size="m">
					{message}
				</Text>
			</>
		);
	} else {
		content = (
			<>
				<Text className="mb-6" size="xl">
					Drag and drop an image, or{" "}
					<span>
						<Text className="inline underline" size="xl">
							Browse
						</Text>
					</span>
				</Text>
				<Text className="text-white-800" size="m">
					High resolution images (jpeg)
				</Text>
			</>
		);
	}

	return (
		<div className="w-full gap-2 px-5 md:px-10 xl:px-65">
			{uploadedFile ? (
				<div className="flex items-center justify-between py-10 lg:mb-10">
					<TertiaryButton onClick={handleCancelButton}>Cancel</TertiaryButton>
					<PrimaryButton disabled={isDetecting} onClick={handleUpload}>
						Upload
					</PrimaryButton>
				</div>
			) : (
				<div className="mb-10 flex items-end justify-between">
					<button
						className="cursor-pointer text-primary transition-colors duration-300 hover:text-gray-500"
						onClick={() => router.back()}
					>
						<ArrowLeftIcon size={32} />
					</button>
				</div>
			)}
			<Heading alignment="center" size="s">
				{!uploadedFile && "Show us the scene that stayed with you."}
			</Heading>
			{uploadedFile ? (
				<div className="pt-15">
					{error && (
						<Text className="mb-2 text-center text-red-500">{error}</Text>
					)}
					<div className="flex flex-col items-start justify-center lg:flex-row">
						<UploadPreview photo={photo} />
						<UploadForm
							detectAndApplyExif={detectAndApplyExif}
							file={uploadedFile}
							handleExifChange={handleExifChange}
							handleTags={handleTagsChange}
							isDetecting={isDetecting}
							onChange={handleChange}
							photo={photo}
							selectedCamera={selectedCamera}
							setSelectedCamera={setSelectedCamera}
							setSettings={setSettings}
							settings={settings}
							tags={form.tags}
						/>
					</div>
				</div>
			) : (
				<UploadDropZone
					content={content}
					fileInputRef={fileInputRef}
					handleBrowseClick={handleBrowseClick}
					handleDragLeave={handleDragLeave}
					handleDragOver={handleDragOver}
					handleDrop={handleDrop}
					handleFileChange={handleFileChange}
					isDragOver={isDragOver}
					isUploading={isUploading}
				/>
			)}
		</div>
	);
};

export default UploadSection;
