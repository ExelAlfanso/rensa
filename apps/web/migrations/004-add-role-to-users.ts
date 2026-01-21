import mongoose from "mongoose";
import User from "../src/models/User.ts";
import dotenv from "dotenv";

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

  // Update all users that don't have a role field yet
  const result = await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: "user" } },
  );

  console.log(
    `Migration complete: role field added to ${result.modifiedCount} users`,
  );

  process.exit(0);
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
