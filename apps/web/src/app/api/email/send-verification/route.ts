import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { verificationEmailLimiter } from "@/lib/rateLimiter";
import getResend from "@/lib/resend";
import EmailVerificationTemplate from "@/components/emailTemplates/EmailVerificationTemplate";

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
      { status: 429 },
    );
  }
  if (!process.env.NEXTAUTH_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      { message: "Email verification is not configured." },
      { status: 500 },
    );
  }
  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verified?token=${token}`;

  try {
    const resend = await getResend();
    await resend.emails.send({
      from: process.env.NO_REPLY_EMAIL!,
      to: email,
      subject: "Verify your email address",
      react: EmailVerificationTemplate({ verificationLink: verificationUrl }),
    });

    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 },
    );
  }
}
