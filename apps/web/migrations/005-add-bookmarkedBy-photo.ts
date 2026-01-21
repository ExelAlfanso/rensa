import mongoose from "mongoose";
import dotenv from "dotenv";
import Photo from "../src/models/Photo.ts";

dotenv.config({ path: ".env.local" });

async function up() {
  const uri = process.env.MONGODB_URI;
  if (
    !uri ||
    (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))
  ) {
    throw new Error(
      "MONGODB_URI is missing or invalid. It must start with mongodb:// or mongodb+srv://",
    );
  }

  await mongoose.connect(uri);

  // Update all photos that don't have a bookmarkedBy field yet
  const result = await Photo.updateMany(
    { bookmarkedBy: { $exists: false } },
    { $set: { bookmarkedBy: [] } },
  );

  console.log(
    `Migration complete: bookmarkedBy field added to ${result.modifiedCount} photos`,
  );

  process.exit(0);
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
