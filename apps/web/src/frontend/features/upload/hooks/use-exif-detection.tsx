import { useState } from "react";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/features/upload/configs/cameraDatas";
import { cameraFieldOptions } from "@/frontend/features/upload/configs/cameraFieldDatas";
import { brandModels } from "@/frontend/features/upload/configs/cameraModelDatas";
import { api } from "@/lib/axios-client";
import {
	detectValueinString,
	extractNumberFromString,
} from "@/utils/value-detections";

type MetadataValue = number | object | string;
type DetectedMetadata = Record<string, MetadataValue>;

const DEFAULT_BRAND: CameraSettings["Brand"] = "Fujifilm";

export function useExifDetection(
	file: File | null,
	handleExifChange: (
		field: string,
		value: number | object | string | CameraSettings
	) => void
) {
	const [isDetecting, setIsDetecting] = useState(false);
	const [settings, setSettings] = useState<CameraSettings>(
		defaultCameraSettings.Fujifilm
	);
	const [selectedCamera, setSelectedCamera] =
		useState<CameraSettings["Brand"]>(DEFAULT_BRAND);

	const detectMetadata = async (): Promise<DetectedMetadata | null> => {
		if (!file) {
			return null;
		}
		setIsDetecting(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await api.post("/photos/exifread", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data.data as DetectedMetadata;
		} catch (err) {
			console.error("Metadata detection failed:", err);
			return null;
		} finally {
			setIsDetecting(false);
		}
	};

	const detectBrand = (
		detectedMetadata: DetectedMetadata
	): CameraSettings["Brand"] => {
		const makeValue =
			typeof detectedMetadata.Make === "string" ? detectedMetadata.Make : "";
		const detectedBrand = detectValueinString(
			Object.keys(defaultCameraSettings),
			makeValue
		) as CameraSettings["Brand"];

		if (detectedBrand in defaultCameraSettings) {
			return detectedBrand;
		}
		return DEFAULT_BRAND;
	};

	const resolveStringMetadataValue = (
		key: string,
		value: string,
		brand: CameraSettings["Brand"],
		activeCamera: CameraSettings["Brand"]
	): string | number => {
		if (key === "Model") {
			const matchedModel = detectValueinString(brandModels[brand] || [], value);
			return matchedModel || value;
		}

		const detectedValue = detectValueinString(
			cameraFieldOptions[activeCamera]?.[key] || [],
			value
		);
		if (detectedValue) {
			return detectedValue;
		}

		const extractedNumber = extractNumberFromString(value);
		return extractedNumber ?? value;
	};

	const autoFillSettings = (
		detectedMetadata: DetectedMetadata
	): CameraSettings => {
		const brand = detectBrand(detectedMetadata);
		const nextSettings: CameraSettings = { ...defaultCameraSettings[brand] };
		const settingsRecord = nextSettings as unknown as Record<string, unknown>;
		const defaultBrandSettings = defaultCameraSettings[
			brand
		] as unknown as Record<string, unknown>;

		setSelectedCamera(brand);
		handleExifChange("Brand", brand);

		for (const [key, rawValue] of Object.entries(detectedMetadata)) {
			if (!(key in defaultBrandSettings)) {
				continue;
			}

			const resolvedValue =
				typeof rawValue === "string"
					? resolveStringMetadataValue(key, rawValue, brand, brand)
					: rawValue;

			settingsRecord[key] = resolvedValue;
			handleExifChange(key, resolvedValue);
		}

		setSettings(nextSettings);
		return nextSettings;
	};

	const detectAndApplyExif = async (): Promise<CameraSettings | null> => {
		const metadata = await detectMetadata();
		if (metadata) {
			return autoFillSettings(metadata);
		}
		return null;
	};

	return {
		isDetecting,
		detectMetadata,
		autoFillSettings,
		settings,
		selectedCamera,
		setSelectedCamera,
		detectAndApplyExif,
		setSettings,
	};
}
