import { escapeHtml, sendEmail } from "@/services/EmailServices";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName, subject } = await req.json();
    if (!userEmail || typeof userEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "userEmail is required" },
        { status: 400 }
      );
    }
    if (!userName || typeof userName !== "string") {
      return NextResponse.json(
        { success: false, message: "userName is required" },
        { status: 400 }
      );
    }
    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        { success: false, message: "subject is required" },
        { status: 400 }
      );
    }

    const html = `
      <h2>Thank you for contacting us!</h2>
      <p>Hi ${escapeHtml(userName)},</p>
      <p>We've received your message regarding: <strong>${escapeHtml(
        subject
      )}</strong></p>
      <p>Our team will review your inquiry and get back to you as soon as possible.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated response. Please do not reply to this email.
      </p>
    `;

    return sendEmail({
      to: userEmail,
      subject: `Re: ${subject}`,
      html,
      text: `Thank you for contacting us! We've received your message and will respond soon.`,
      serviceType: "contact-confirmation",
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Email:contact-confirmation] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
