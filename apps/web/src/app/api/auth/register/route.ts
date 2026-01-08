import { api } from "@/lib/axios-client";
import { connectDB } from "@/lib/mongodb";
import { registerLimiter } from "@/lib/rateLimiter";
import Roll from "@/models/Roll";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { startSession } from "mongoose";
import { NextResponse } from "next/server";

/*
  POST /api/auth/register
  User registration endpoint
*/
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { success, remaining, limit, reset } = await registerLimiter.limit(
      ip
    );
    if (!success) {
      return NextResponse.json(
        { message: "Too many registration attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
    const { username, email, password, confirmPassword } = await req.json();
    if (password != confirmPassword)
      return NextResponse.json(
        { message: "Invalid Password" },
        { status: 400 }
      );
    await connectDB();

    const userExists = await User.findOne({ email });
    if (userExists)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const defaultRoll = new Roll({
      userId: user._id,
      name: "All Photos",
      description: "This is your default roll.",
    });
    try {
      const response = await api.post("/auth/send-verification", { email });
      console.log("✅ Verification email sent to:", email, response.data);
    } catch (err) {
      console.error("Error sending verification email:", err);
    }
    const session = await startSession();
    session.startTransaction();
    try {
      await user.save({ session });
      await defaultRoll.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Error registering user: ${err}` },
      { status: 500 }
    );
  }
}
