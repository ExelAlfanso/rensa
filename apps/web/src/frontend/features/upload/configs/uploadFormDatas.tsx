import {
	PHOTO_UPLOAD_ACCEPTED_EXTENSIONS,
	PHOTO_UPLOAD_ACCEPTED_MIME_TYPES,
	PHOTO_UPLOAD_MAX_FILES,
	PHOTO_UPLOAD_MAX_INPUT_SIZE_MB,
} from "@/shared/configs/photo-upload.config";

export const cameraOptions = [
	"Fujifilm",
	"Sony",
	"Canon",
	"Nikon",
	"Panasonic",
	"Olympus",
	"Lumix",
	"Leica",
	"Pentax",
	"Ricoh",
	"Hasselblad",
];

export const uploadConstraints = {
	fileSize: PHOTO_UPLOAD_MAX_INPUT_SIZE_MB,
	fileTypes: [...PHOTO_UPLOAD_ACCEPTED_EXTENSIONS],
	maxFiles: PHOTO_UPLOAD_MAX_FILES,
	acceptedFormats: [...PHOTO_UPLOAD_ACCEPTED_MIME_TYPES],
} as const;
