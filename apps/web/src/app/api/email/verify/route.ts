import { sendEmail } from "@/services/EmailServices";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, verificationUrl } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }
    if (!verificationUrl || typeof verificationUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "verificationUrl is required" },
        { status: 400 }
      );
    }
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;background: #f7f8f5; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #333;">Welcome to Rensa! 📸👋</h2>
    <p style="color: #555; font-size: 16px;">
      Thanks for signing up! Please verify your email to activate your Rensa account.
    </p>
    <a href="${verificationUrl}" 
       style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #031602; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Verify Email
    </a>
    <p style="color: #999; font-size: 14px;">
      This verification link will expire in 1 hour. If you didn't create a Rensa account, you can ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="color: #999; font-size: 12px;">
      Rensa 2025.<br>
      <a href="https://rensa.site" style="color: #ff9000; text-decoration: none;">https://rensa.site</a>
    </p>
  </div>
  `;

    return sendEmail({
      to: email,
      subject: "Verify Your Rensa Account",
      html,
      text: `Welcome to Rensa! Please verify your email by visiting: ${verificationUrl}`,
      serviceType: "verify",
    });
  } catch (error) {
    console.error("[Email:verify] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
