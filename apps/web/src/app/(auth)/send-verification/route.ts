import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await User.findOne({ email });

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  const token = jwt.sign({}, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1h",
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}&email=${email}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify your email by clicking the link below:</p>
               <a href="${verificationUrl}">Verify Email</a>
               <p>This link will expire in 1 hour.</p>`,
    });
    return NextResponse.json(
      { success: true, message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
