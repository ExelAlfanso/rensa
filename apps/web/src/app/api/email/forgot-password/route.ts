import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordLimiter } from "@/lib/rateLimiter";
import jwt from "jsonwebtoken";
import PasswordResetEmail from "@/components/emailTemplates/PasswordResetEmail";
import getResend from "@/lib/resend";
/*
  POST /api/auth/forgot-password
  Send password reset email endpoint
*/
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { success, remaining, limit, reset } =
      await forgotPasswordLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many password reset attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 },
      );
    }
    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: "1h",
    });

    if (!token) {
      console.error("Failed to generate password reset token.");
      return NextResponse.json(
        { success: false, message: "Could not generate reset token" },
        { status: 500 },
      );
    }
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    try {
      const resend = await getResend();
      await resend.emails.send({
        from: process.env.NO_REPLY_EMAIL!,
        to: email,
        subject: "Password Reset Request",
        react: PasswordResetEmail({ resetLink }),
      });
    } catch (err) {
      console.error("Error sending password reset email:", err);
    }
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset email has been sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
