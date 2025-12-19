import mongoose from "mongoose";
import Photo from "../src/models/Photo";
import dotenv from "dotenv";

dotenv.config();

async function up() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const result = await Photo.updateMany(
      { bookmarkedBy: { $exists: true } },
      { $unset: { bookmarkedBy: "" } }
    );
    console.log(
      `Migration complete: removed bookmarkedBy from ${result.modifiedCount} photos`
    );
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

up();
