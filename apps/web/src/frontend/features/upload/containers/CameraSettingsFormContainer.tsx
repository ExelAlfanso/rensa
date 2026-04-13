import type { CameraSettings } from "@/frontend/data/cameraDatas";
import CameraSettingsFormView from "../components/CameraSettingsFormView";

export interface CameraSettingsFormContainerProps {
	cameraModels: string[];
	handleSettings: (settings: CameraSettings) => void;
	settings: CameraSettings;
}

const CameraSettingsFormContainer: React.FC<
	CameraSettingsFormContainerProps
> = ({ settings, cameraModels, handleSettings }) => {
	const handleModelChange = (model: string) => {
		handleSettings({ ...settings, Model: model });
	};

	const handleOptionChange = (key: keyof CameraSettings, value: string) => {
		handleSettings({
			...settings,
			[key]: value,
		});
	};

	const handleNumberChange = (key: keyof CameraSettings, value: number) => {
		handleSettings({
			...settings,
			[key]: value,
		});
	};

	return (
		<CameraSettingsFormView
			cameraModels={cameraModels}
			onModelChange={handleModelChange}
			onNumberChange={handleNumberChange}
			onOptionChange={handleOptionChange}
			settings={settings}
		/>
	);
};

export default CameraSettingsFormContainer;
