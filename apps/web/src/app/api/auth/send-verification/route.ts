import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { verificationEmailLimiter } from "@/lib/rateLimiter";
import { sendVerificationEmail } from "@/services/EmailServices";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const rateLimitResult = await verificationEmailLimiter.limit(email);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        message: "Too many verification requests. Please try again later.",
      },
      { status: 429 }
    );
  }
  if (!process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      { message: "Email verification is not configured." },
      { status: 500 }
    );
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      { message: "Application URL is not configured." },
      { status: 500 }
    );
  }
  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    const isEmailAvailable = await User.findOne({ email });
    if (isEmailAvailable) {
      const emailSent = await sendVerificationEmail(email, verificationUrl);
      if (!emailSent) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Failed to send verification email. Email service not configured." +
              emailSent,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
