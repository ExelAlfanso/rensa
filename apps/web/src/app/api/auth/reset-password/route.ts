import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { resetPasswordLimiter } from "@/lib/rateLimiter";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/*
  POST /api/auth/reset-password
  Reset password using token from email
*/
export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESET_PASSWORD_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { success, remaining, limit, reset } =
      await resetPasswordLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
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

    const { token, password, confirmPassword } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid or missing token" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }
    if (password.trim().length < 8 || password.trim().length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be between 8 and 128 characters",
        },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    let payload: { id: string; email: string };
    try {
      payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET) as {
        id: string;
        email: string;
      };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(payload.id);
    if (!user || user.email !== payload.email) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
