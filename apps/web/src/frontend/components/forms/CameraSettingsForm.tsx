"use client";
import type React from "react";
import type { CameraSettings } from "@/frontend/data/cameraDatas";
import { cameraFieldOptions } from "@/frontend/data/cameraFieldDatas";
// import { formatLabel } from "@/utils/label-formatter";
import { SearchDropdown } from "../dropdowns/SearchDropdown";
// import InputField from "../inputfields/InputField";
import InputDropdown from "../inputfields/InputDropdown";
import NumberInputField from "../inputfields/NumberInputField";

interface CameraSettingsFormProps {
	cameraModels: string[];
	handleSettings: (settings: CameraSettings) => void;
	settings: CameraSettings;
}

const CameraSettingsForm: React.FC<CameraSettingsFormProps> = ({
	settings,
	cameraModels,
	handleSettings,
}) => {
	return (
		<div className="grid w-full grid-cols-2 gap-5">
			{Object.entries(settings).map(([key, value]) => {
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
							onSelect={(model) => {
								handleSettings({ ...settings, Model: model });
							}}
							value={(settings.Model as string) ?? ""}
						/>
					);
				}
				// Render dropdown if options exist
				if (options && options.length > 0) {
					return (
						<InputDropdown
							initialValue={settings[key as keyof CameraSettings] as string}
							key={key}
							label={key}
							onChange={(e) => {
								handleSettings({
									...settings,
									[key]: e.currentTarget.innerText,
								});
							}}
							placeholder={`Select ${key}`}
							values={options}
						/>
					);
				}

				// Render number input if value is numeric
				if (typeof value === "number") {
					return (
						<NumberInputField
							key={key}
							label={key}
							onChange={(e) => {
								handleSettings({ ...settings, [key]: Number(e.target.value) });
							}}
							placeholder={`Enter ${key}`}
							type="number"
							value={settings[key as keyof CameraSettings] as number}
						/>
					);
				}

				// // Render object inputs
				// if (typeof value === "object" && value !== null) {
				//   return (
				//     <div key={key} className="p-2 border border-gray-500 rounded-lg">
				//       <h4 className="font-semibold">{formatLabel(key)}</h4>
				//       {Object.entries(value).map(([subKey, subVal]) => (
				//         <NumberInputField
				//           key={subKey}
				//           label={subKey}
				//           value={subVal as number}
				//           onChange={(e) => {
				//             handleSettings({
				//               ...settings,
				//               [key]: {
				//                 ...value,
				//                 [subKey]: Number(e.target.value),
				//               },
				//             });
				//           }}
				//         />
				//       ))}
				//     </div>
				//   );
				// }
				return null;
			})}
		</div>
	);
};

export default CameraSettingsForm;
