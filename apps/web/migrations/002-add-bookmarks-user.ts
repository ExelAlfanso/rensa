import mongoose from "mongoose";
import User from "../src/models/User";
import dotenv from "dotenv";

dotenv.config();

async function up() {
  await mongoose.connect(process.env.MONGODB_URI || "");

  // Update semua user yang BELUM punya field bookmarks
  const result = await User.updateMany(
    { bookmarks: { $exists: false } },
    { $set: { bookmarks: [] } }
  );

  console.log(
    `Migration complete: bookmarks field added to ${result.modifiedCount} users`
  );

  process.exit(0);
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
