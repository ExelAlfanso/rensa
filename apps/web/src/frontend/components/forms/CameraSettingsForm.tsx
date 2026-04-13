"use client";
import type React from "react";
import type { CameraSettings } from "@/frontend/data/cameraDatas";
import CameraSettingsFormContainer from "@/frontend/features/upload/containers/CameraSettingsFormContainer";

interface CameraSettingsFormProps {
	cameraModels: string[];
	handleSettings: (settings: CameraSettings) => void;
	settings: CameraSettings;
}

const CameraSettingsForm: React.FC<CameraSettingsFormProps> = ({
	...props
}) => {
	return <CameraSettingsFormContainer {...props} />;
};

export default CameraSettingsForm;
