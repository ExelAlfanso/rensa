import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/services/EmailServices";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    if (!process.env.NEXTAUTH_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error("Password reset configuration missing.");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "1h",
    });

    if (!token) {
      console.error("Failed to generate password reset token.");
      return NextResponse.json(
        { success: false, message: "Could not generate reset token" },
        { status: 500 }
      );
    }
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background: #f7f8f5; color: #0f1b0f; border: 1px solid #e1e5dc;">
        <div style="font-weight: 700; color: #ff9000; letter-spacing: 0.5px;">Rensa</div>
        <h2 style="margin: 12px 0 8px; font-size: 24px; line-height: 1.3; color: #0f1b0f;">Reset your password</h2>
        <p style="margin: 0 0 12px; line-height: 1.6; color: #2c352c;">We received a request to reset the password for your Rensa account.</p>
        <a href="${resetUrl}" style="display: inline-block; margin: 12px 0; padding: 12px 18px; background: #031602; color: #0f1b0f; text-decoration: none; border-radius: 8px; font-weight: 700;">Reset password</a>
        <p style="margin: 8px 0 0; font-size: 13px; color: #4c554c;">This link is valid for 60 minutes.</p>
        <p style="margin: 16px 0 0; font-size: 13px; color: #4c554c;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e1e5dc; margin: 20px 0;" />
         <p style="color: #999; font-size: 12px;">
          Rensa 2025.<br>
          <a href="https://rensa.site" style="color: #ff9000; text-decoration: none;">https://rensa.site</a>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html,
        text: `Reset your password: ${resetUrl}`,
        serviceType: "password-reset",
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
      { status: 200 }
    );
  } catch (error) {
    console.error("[Email:password-reset] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
