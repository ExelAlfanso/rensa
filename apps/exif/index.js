import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import readerRoutes from "./routes/reader.js";
import { exiftool } from "exiftool-vendored";

dotenv.config();
const app = express();

// ✅ Enable CORS for Next.js frontend
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api", readerRoutes);

// Multer error handler (global)
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 50MB." });
    }
  }
  if (error.message === "Only JPEG files are allowed!") {
    return res.status(400).json({ error: "Only JPEG files are allowed!" });
  }
  res.status(500).json({ error: "An unexpected error occurred." });
});

// Gracefully close exiftool when app exits
process.on("exit", () => {
  console.log("Closing exiftool...");
  exiftool.end();
});

const PORT = process.env.PORT || 3001;
app.listen(process.env.PORT || 3003, "0.0.0.0", () =>
  console.log("Server running at http://0.0.0.0:3003")
);
