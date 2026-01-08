import { NextRequest, NextResponse } from "next/server";
import { sendContactToAdminDirect } from "@/services/EmailServices";

export async function POST(req: NextRequest) {
  try {
    const { senderEmail, senderName, subject, message } = await req.json();
    if (!senderEmail || typeof senderEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "senderEmail is required" },
        { status: 400 }
      );
    }
    if (!senderName || typeof senderName !== "string") {
      return NextResponse.json(
        { success: false, message: "senderName is required" },
        { status: 400 }
      );
    }
    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        { success: false, message: "subject is required" },
        { status: 400 }
      );
    }

    const success = await sendContactToAdminDirect(
      senderEmail,
      senderName,
      subject,
      typeof message === "string" ? message : ""
    );
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Failed to send contact admin email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Email:contact-admin] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
