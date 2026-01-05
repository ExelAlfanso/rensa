import express from "express";
import multer from "multer";
import { exifRead } from "../controllers/readerController.js";
import debug from "debug";

const log = debug("rensa:routes");
const logError = debug("rensa:error");

const router = express.Router();

// Memory storage (keeps file in memory as Buffer, not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    log("📋 Validating file: %s (type: %s)", file.originalname, file.mimetype);
    if (file.mimetype.startsWith("image/jpeg")) {
      log("✅ File validation passed");
      cb(null, true);
    } else {
      logError(
        "❌ File validation failed: not a JPEG (type: %s)",
        file.mimetype
      );
      cb(new Error("Only JPEG files are allowed!"), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});
log("📤 Multer upload configured: max size 50MB, JPEG only");

// Routes
router.post("/exifread", upload.single("file"), exifRead);
log("🛣️ Route registered: POST /api/exifread");

export default router;
