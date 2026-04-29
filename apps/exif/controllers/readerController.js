import debug from "debug";
import { exiftool } from "exiftool-vendored";
import fs from "fs";

const log = debug("rensa:controller");
const logError = debug("rensa:error");
const fsAsync = fs.promises;

const SAFE_METADATA_KEYS = [
	"Make",
	"Model",
	"LensModel",
	"ImageWidth",
	"ImageHeight",
	"Megapixels",
	"DateTimeOriginal",
	"CreateDate",
	"ModifyDate",
	"Orientation",
	"ExposureTime",
	"FNumber",
	"ISO",
	"FocalLength",
	"WhiteBalance",
	"Flash",
];

const isJpegSignature = (buffer) => {
	if (!buffer || buffer.length < 3) {
		return false;
	}
	return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
};

const toSafeMetadata = (metadata) => {
	const safeMetadata = {};
	for (const key of SAFE_METADATA_KEYS) {
		if (metadata[key] !== undefined) {
			safeMetadata[key] = metadata[key];
		}
	}
	return safeMetadata;
};

export const exifRead = async (req, res) => {
	let tempPath;
	try {
		log("Processing EXIF read request");

		if (!req.file) {
			logError("No file uploaded in request");
			return res.status(400).json({ error: "No file uploaded" });
		}

		tempPath = req.file.path;
		log(
			"File details: name=%s, size=%d bytes, type=%s",
			req.file.originalname,
			req.file.size,
			req.file.mimetype
		);

		const header = Buffer.alloc(12);
		const fileHandle = await fsAsync.open(tempPath, "r");
		try {
			await fileHandle.read(header, 0, header.length, 0);
		} finally {
			await fileHandle.close();
		}

		if (!isJpegSignature(header)) {
			logError("Unsupported media type: invalid JPEG signature");
			return res.status(415).json({ error: "Only JPEG files are allowed!" });
		}

		log("Reading EXIF metadata from temp file");
		const metadata = await exiftool.read(tempPath);
		const safeMetadata = toSafeMetadata(metadata);
		log(
			"Metadata extracted successfully, found %d safe properties",
			Object.keys(safeMetadata).length
		);
		log(
			"Metadata extraction total properties from exiftool: %d",
			Object.keys(metadata).length
		);

		res.json({
			success: true,
			data: {
				filename: req.file.originalname,
				size: req.file.size,
				mimetype: req.file.mimetype,
				metadata: safeMetadata,
			},
			message: "Metadata extracted successfully",
		});
	} catch (error) {
		console.error("EXIF Read Error:", error);
		logError("EXIF Read Error: %s", error.message);
		logError("Stack trace: %O", error.stack);
		res.status(500).json({ error: "Failed to read metadata" });
	} finally {
		if (tempPath) {
			try {
				await fsAsync.unlink(tempPath);
				log("Temp file deleted successfully: %s", tempPath);
			} catch (cleanupError) {
				if (cleanupError.code !== "ENOENT") {
					logError(
						"Failed to delete temp file %s: %s",
						tempPath,
						cleanupError.message
					);
				}
			}
		}
	}
};
