import { useEffect } from "react";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/data/cameraDatas";
import { brandModels } from "@/frontend/data/cameraModelDatas";
import { FilterLists } from "@/frontend/data/filterDatas";
import UploadFormView from "../components/UploadFormView";

export interface UploadFormContainerProps {
	detectAndApplyExif: () => Promise<CameraSettings | null>;
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
	setSettings: (settings: CameraSettings) => void;
	settings: CameraSettings;
	tags: string[];
}

const UploadFormContainer: React.FC<UploadFormContainerProps> = ({
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
			const detectExif = async () => {
				await detectAndApplyExif();
			};
			detectExif();
		}
	}, [photo, detectAndApplyExif]);

	const handleBrandChange = (brand: CameraSettings["Brand"]) => {
		setSelectedCamera(brand);
		setSettings(defaultCameraSettings[brand]);
		handleExifChange("Brand", brand);
	};

	return (
		<UploadFormView
			cameraBrandOptions={Object.keys(defaultCameraSettings)}
			cameraModelOptions={brandModels[selectedCamera] || []}
			categoryOptions={FilterLists[0].items.map((item) => item.label)}
			colorOptions={FilterLists[3].items.map((item) => item.label)}
			handleTags={handleTags}
			isDetecting={isDetecting}
			onBrandChange={handleBrandChange}
			onCategoryChange={(value) => onChange("category", value)}
			onColorChange={(value) => onChange("color", value)}
			onDescriptionChange={(value) => onChange("description", value)}
			onStyleChange={(value) => onChange("style", value)}
			onTitleChange={(value) => onChange("title", value)}
			selectedCamera={selectedCamera}
			setSettings={setSettings}
			settings={settings}
			styleOptions={FilterLists[2].items.map((item) => item.label)}
			tags={tags}
		/>
	);
};

export default UploadFormContainer;
