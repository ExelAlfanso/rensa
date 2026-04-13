import type React from "react";
import { useEffect } from "react";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/data/cameraDatas";
import { brandModels } from "@/frontend/data/cameraModelDatas";
import { FilterLists } from "@/frontend/data/filterDatas";
import BaseInputField from "../inputfields/BaseInputField";
import InputDropdown from "../inputfields/InputDropdown";
import TagsInputField from "../inputfields/TagsInputField";
import TextAreaInput from "../inputfields/TextAreaInput";
import CameraSettingsForm from "./CameraSettingsForm";

interface UploadFormProps {
	detectAndApplyExif: () => void;
	file: File | null;
	handleExifChange: (
		field: string,
		value: number | object | string | CameraSettings
	) => void;
	handleTags: (value: string | string[]) => void;
	isDetecting: boolean;
	onChange: (field: string, value: string | string[]) => void;
	photo: string;
	selectedCamera: CameraSettings["Brand"];
	setSelectedCamera: (brand: CameraSettings["Brand"]) => void;
	setSettings: (s: CameraSettings) => void;
	settings: CameraSettings;
	tags: string[];
}

const UploadForm: React.FC<UploadFormProps> = ({
	onChange,
	photo,
	tags,
	handleExifChange,
	handleTags,
	isDetecting,
	detectAndApplyExif,
	settings,
	selectedCamera,
	setSelectedCamera,
	setSettings,
}) => {
	useEffect(() => {
		if (photo) {
			detectAndApplyExif();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [photo, detectAndApplyExif]);
	const handleBrandChange = (brand: CameraSettings["Brand"]) => {
		setSelectedCamera(brand);
		setSettings(defaultCameraSettings[brand]);
		handleExifChange("Brand", brand);
	};
	return (
		<div className="no-scrollbar mt-10 mb-25 flex w-[80%] flex-col gap-5 overflow-y-scroll rounded-3xl bg-white-200 p-10 text-primary shadow-lg md:h-190 lg:h-175">
			<BaseInputField
				label="Title"
				onChange={(e) => onChange("title", e.target.value)}
				placeholder="Title"
			/>
			<TextAreaInput
				label="Description"
				onChange={(e) => onChange("description", e.target.value)}
				placeholder="Add a description"
			/>
			<TagsInputField
				handleTags={handleTags}
				label={"Tags"}
				placeholder={"Enter Tags"}
				tags={tags}
			/>
			<InputDropdown
				label="Category"
				onChange={(e) => {
					const category = e.currentTarget.innerText;
					onChange("category", category);
				}}
				placeholder="Select Category"
				values={FilterLists[0].items.map((item) => item.label)}
			/>
			<InputDropdown
				label="Style"
				onChange={(e) => {
					const style = e.currentTarget.innerText;
					onChange("style", style);
				}}
				placeholder="Select Style"
				values={FilterLists[2].items.map((item) => item.label)}
			/>
			<InputDropdown
				label="Color"
				onChange={(e) => {
					const color = e.currentTarget.innerText;
					onChange("color", color);
				}}
				placeholder="Select Color"
				values={FilterLists[3].items.map((item) => item.label)}
			/>
			<div className="my-2 w-full border-white-700 border-t" />
			<div className="flex flex-col items-center justify-center">
				{isDetecting ? (
					<div className="loading loading-spinner loading-xl mt-5 text-primary" />
				) : (
					<>
						<InputDropdown
							label="Camera Brand"
							onChange={(e) => {
								const brand = e.currentTarget
									.innerText as CameraSettings["Brand"];
								handleBrandChange(brand);
							}}
							placeholder={selectedCamera}
							values={Object.keys(defaultCameraSettings)}
						/>
						<CameraSettingsForm
							cameraModels={brandModels[selectedCamera] || []}
							handleSettings={setSettings}
							settings={settings}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default UploadForm;
