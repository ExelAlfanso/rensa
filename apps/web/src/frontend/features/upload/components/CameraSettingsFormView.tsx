import type React from "react";
import { SearchDropdown } from "@/frontend/components/dropdowns/SearchDropdown";
import InputDropdown from "@/frontend/components/inputfields/InputDropdown";
import NumberInputField from "@/frontend/components/inputfields/NumberInputField";
import type { CameraSettings } from "@/frontend/data/cameraDatas";
import { cameraFieldOptions } from "@/frontend/data/cameraFieldDatas";

export interface CameraSettingsFormViewProps {
	cameraModels: string[];
	onModelChange: (model: string) => void;
	onNumberChange: (key: keyof CameraSettings, value: number) => void;
	onOptionChange: (key: keyof CameraSettings, value: string) => void;
	settings: CameraSettings;
}

const CameraSettingsFormView: React.FC<CameraSettingsFormViewProps> = ({
	settings,
	cameraModels,
	onModelChange,
	onOptionChange,
	onNumberChange,
}) => {
	return (
		<div className="grid w-full grid-cols-2 gap-5">
			{Object.entries(settings).map(([key, value]) => {
				const typedKey = key as keyof CameraSettings;
				const brand = settings.Brand;
				const options = cameraFieldOptions[brand]?.[key];

				if (key === "Brand") {
					return null;
				}

				if (key === "Model") {
					return (
						<SearchDropdown
							cameraModels={cameraModels}
							key={key}
							label={key}
							onSelect={onModelChange}
							value={(settings.Model as string) ?? ""}
						/>
					);
				}

				if (options && options.length > 0) {
					return (
						<InputDropdown
							initialValue={settings[typedKey] as string}
							key={key}
							label={key}
							onChange={(event) => {
								onOptionChange(typedKey, event.currentTarget.innerText);
							}}
							placeholder={`Select ${key}`}
							values={options}
						/>
					);
				}

				if (typeof value === "number") {
					return (
						<NumberInputField
							key={key}
							label={key}
							onChange={(event) => {
								onNumberChange(typedKey, Number(event.target.value));
							}}
							placeholder={`Enter ${key}`}
							type="number"
							value={settings[typedKey] as number}
						/>
					);
				}

				return null;
			})}
		</div>
	);
};

export default CameraSettingsFormView;
