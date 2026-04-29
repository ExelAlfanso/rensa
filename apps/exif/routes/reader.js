import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import debug from "debug";
import express from "express";
import multer from "multer";
import { exifRead } from "../controllers/readerController.js";

const log = debug("rensa:routes");

const router = express.Router();
const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => cb(null, uploadsDir),
		filename: (_req, _file, cb) =>
			cb(null, `${Date.now()}-${randomUUID()}.jpg`),
	}),
	limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});
log("Multer upload configured: max size 50MB with disk temp storage");

// Routes
router.post("/exifread", upload.single("file"), exifRead);
log("Route registered: POST /api/exifread");

export default router;
