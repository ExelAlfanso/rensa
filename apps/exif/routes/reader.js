import express from "express";
import multer from "multer";
import { exifRead } from "../controllers/readerController.js";

const router = express.Router();

// Memory storage (keeps file in memory as Buffer, not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/jpeg")) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG files are allowed!"), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Routes
router.post("/exifread", upload.single("file"), exifRead);

export default router;
