export interface PhotoMetadata {
	exif?: Record<string, string>;
	format?: "jpg" | "jpeg" | string;
	height?: number;
	size?: number;
	uploadedAt?: Date | string;
	width?: number;
}
