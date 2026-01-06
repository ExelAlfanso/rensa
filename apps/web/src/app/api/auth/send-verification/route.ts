import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT as unknown as number,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "TLSv1.2",
    },
  });
  try {
    await transporter.sendMail({
      from: "no-reply@rensa.site",
      to: email,
      subject: "Verify Your Rensa Account",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #333;">Welcome to Rensa! 📸👋</h2>
    <p style="color: #555; font-size: 16px;">
      Thanks for signing up! Please verify your email to activate your Rensa account.
    </p>
    <a href="${verificationUrl}" 
       style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #031602; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Verify Email
    </a>
    <p style="color: #999; font-size: 14px;">
      This verification link will expire in 1 hour. If you didn’t create a Rensa account, you can ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">
      Rensa 2025.<br>
      <a href="https://rensa.site" style="color: #ff9000; text-decoration: none;">https://rensa.site</a>
    </p>
  </div>
  `,
    });
    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" + err },
      { status: 500 }
    );
  }
}
