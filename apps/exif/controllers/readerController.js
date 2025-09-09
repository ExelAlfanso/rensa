import { exiftool } from "exiftool-vendored";
import fs from "fs";

export const exifRead = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📸 Uploaded file:", req.file.originalname);

    // Write buffer to a temp file, because exiftool requires a file path
    const tempPath = `./uploads/${Date.now()}-${req.file.originalname}`;
    fs.writeFileSync(tempPath, req.file.buffer);

    // Read metadata
    const metadata = await exiftool.read(tempPath);

    res.json({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      metadata,
    });

    // Cleanup
    fs.unlink(tempPath, (err) => {
      if (err) console.error("⚠️ Failed to delete temp file:", err);
    });
  } catch (error) {
    console.error("❌ EXIF Read Error:", error);
    res.status(500).json({ error: "Failed to read metadata" });
  }
};
