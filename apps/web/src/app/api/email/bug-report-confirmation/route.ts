import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/services/EmailServices";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, title, reportId } = await req.json();

    if (!userEmail || typeof userEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "userEmail is required" },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, message: "title is required" },
        { status: 400 }
      );
    }
    if (!reportId || typeof reportId !== "string") {
      return NextResponse.json(
        { success: false, message: "reportId is required" },
        { status: 400 }
      );
    }

    const html = `
    <h2>Bug Report Received</h2>
    <p>Thank you for reporting this issue!</p>
    <p><strong>Report Title:</strong> ${escapeHtml(title)}</p>
    <p><strong>Report ID:</strong> <code>${escapeHtml(reportId)}</code></p>
    <p>Our development team is looking into this. We'll update you on the status of your report.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">
      This is an automated response. Please do not reply to this email.
    </p>
  `;

    const success = sendEmail({
      to: userEmail,
      subject: `Bug Report Received: ${escapeHtml(title)}`,
      html,
      text: `Bug Report Received. Report ID: ${escapeHtml(reportId)}`,
      serviceType: "bug-report-confirmation",
    });
    return NextResponse.json(
      { success, message: "Confirmation email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Email:bug-report-confirmation] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
