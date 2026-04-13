import { useState } from "react";
import {
	type CameraSettings,
	defaultCameraSettings,
} from "@/frontend/data/cameraDatas";
import { cameraFieldOptions } from "@/frontend/data/cameraFieldDatas";
import { brandModels } from "@/frontend/data/cameraModelDatas";
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

	const detectMetadata = async () => {
		if (!file) {
			return;
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

	const autoFillSettings = (detectedMetadata: DetectedMetadata) => {
		const brand = detectBrand(detectedMetadata);
		const nextSettings = { ...defaultCameraSettings[brand], ...settings };

		setSelectedCamera(brand);
		handleExifChange("Brand", brand);

		for (const [key, rawValue] of Object.entries(detectedMetadata)) {
			if (!(key in settings)) {
				continue;
			}

			const resolvedValue =
				typeof rawValue === "string"
					? resolveStringMetadataValue(key, rawValue, brand, selectedCamera)
					: rawValue;

			nextSettings[key as keyof CameraSettings] = resolvedValue as never;
			handleExifChange(key, resolvedValue);
		}

		setSettings(nextSettings);
	};

	const detectAndApplyExif = async () => {
		const metadata = await detectMetadata();
		if (metadata) {
			autoFillSettings(metadata);
		}
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
