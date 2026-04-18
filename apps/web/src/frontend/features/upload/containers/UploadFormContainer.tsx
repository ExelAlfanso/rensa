import { FilterLists } from "@/frontend/data/filterDatas";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/features/upload/configs/cameraDatas";
import { brandModels } from "@/frontend/features/upload/configs/cameraModelDatas";
import UploadFormView from "../components/UploadFormView";

export interface UploadFormContainerProps {
	handleExifChange: (
		field: string,
		value: number | object | string | CameraSettings
	) => void;
	handleTags: (value: string | string[]) => void;
	isDetecting: boolean;
	onChange: (field: string, value: string | string[]) => void;
	selectedCamera: CameraSettings["Brand"];
	setSelectedCamera: (brand: CameraSettings["Brand"]) => void;
	setSettings: (settings: CameraSettings) => void;
	settings: CameraSettings;
	tags: string[];
}

const UploadFormContainer: React.FC<UploadFormContainerProps> = ({
	onChange,
	tags,
	handleExifChange,
	handleTags,
	isDetecting,
	settings,
	selectedCamera,
	setSelectedCamera,
	setSettings,
}) => {
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
