import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { exifRead } from "../controllers/readerController.js";
import debug from "debug";

const log = debug("rensa:routes");

const router = express.Router();
const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${randomUUID()}.jpg`),
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});
log("Multer upload configured: max size 50MB with disk temp storage");

// Routes
router.post("/exifread", upload.single("file"), exifRead);
log("Route registered: POST /api/exifread");

export default router;
