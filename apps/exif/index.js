import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import readerRoutes from "./routes/reader.js";
import { exiftool } from "exiftool-vendored";
import debug from "debug";

const log = debug("rensa:server");
const logRequest = debug("rensa:request");
const logError = debug("rensa:error");

dotenv.config();
const app = express();

log("🚀 Initializing Rensa Express server...");

// ✅ Enable CORS for Next.js frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // your frontend
    credentials: true,
  })
);
log("✅ CORS enabled for origin: %s", process.env.CORS_ORIGIN);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  logRequest("→ %s %s from %s", req.method, req.url, req.ip);
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    logRequest("← %s %s %d (%dms)", req.method, req.url, res.statusCode, duration);
  });
  
  next();
});

app.get("/health", (req, res) => {
  log("Health check requested");
  res.json({ status: "ok" });
});

// Routes
app.use("/api", readerRoutes);

// Multer error handler (global)
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logError("❌ Multer error: %s (code: %s)", error.message, error.code);
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 50MB." });
    }
  }
  if (error.message === "Only JPEG files are allowed!") {
    logError("❌ File type error: Only JPEG files are allowed");
    return res.status(400).json({ error: "Only JPEG files are allowed!" });
  }
  logError("❌ Unexpected error: %O", error);
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Gracefully close exiftool when app exits
process.on("exit", () => {
  console.log("Closing exiftool...");
  exiftool.end();
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running at http://0.0.0.0:%d", PORT);
  log("🎧 Server listening on port %d", PORT);
  log("🔍 Debug logs enabled. Set DEBUG=rensa:* to see all logs");
});
// app.listen(process.env.PORT || 3003, () =>
//   console.log("Server running at http://localhost:3003")
// );
