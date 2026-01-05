import { exiftool } from "exiftool-vendored";
import fs from "fs";
import debug from "debug";

const log = debug("rensa:controller");
const logError = debug("rensa:error");

export const exifRead = async (req, res) => {
  try {
    log("📥 Processing EXIF read request...");

    if (!req.file) {
      logError("❌ No file uploaded in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📸 Uploaded file:", req.file.originalname);
    log(
      "📸 File details: name=%s, size=%d bytes, type=%s",
      req.file.originalname,
      req.file.size,
      req.file.mimetype
    );

    // Write buffer to a temp file, because exiftool requires a file path
    const tempPath = `./uploads/${Date.now()}-${req.file.originalname}`;
    log("💾 Writing temp file to: %s", tempPath);
    fs.writeFileSync(tempPath, req.file.buffer);
    log("✅ Temp file written successfully");

    // Read metadata
    log("🔍 Reading EXIF metadata from temp file...");
    const metadata = await exiftool.read(tempPath);
    log(
      "✅ Metadata extracted successfully, found %d properties",
      Object.keys(metadata).length
    );

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        metadata,
      },
      message: "Metadata extracted successfully",
    });

    log("🗑️ Cleaning up temp file: %s", tempPath);
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error("⚠️ Failed to delete temp file:", err);
        logError(
          "⚠️ Failed to delete temp file: %s - %s",
          tempPath,
          err.message
        );
      } else {
        log("✅ Temp file deleted successfully");
      }
    });
    // Cleanup
  } catch (error) {
    console.error("❌ EXIF Read Error:", error);
    logError("❌ EXIF Read Error: %s", error.message);
    logError("Stack trace: %O", error.stack);
    res.status(500).json({ error: "Failed to read metadata" });
  }
};
