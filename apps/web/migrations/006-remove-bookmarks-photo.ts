import mongoose from "mongoose";
import Photo from "../src/models/Photo.ts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function up() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const result = await Photo.updateMany(
      { bookmarks: { $exists: true } },
      { $unset: { bookmarks: "" } },
    );
    console.log(
      `Migration complete: removed bookmarks from ${result.modifiedCount} photos`,
    );
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

up();
