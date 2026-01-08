import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, sendEmail } from "@/services/EmailServices";

const SeverityColor = {
  critical: "#d32f2f",
  high: "#f57c00",
  medium: "#fbc02d",
  low: "#388e3c",
};

export async function POST(req: Request) {
  try {
    const { title, email, description, severity, reportId, stepsToReproduce } =
      await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, message: "title is required" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "email is required" },
        { status: 400 }
      );
    }

    const devEmail =
      process.env.DEV_TEAM_EMAIL || process.env.ADMIN_EMAIL || "";

    if (!devEmail) {
      console.warn("DEV_TEAM_EMAIL or ADMIN_EMAIL not configured");
      return NextResponse.json(
        { success: false, message: "Server email configuration error" },
        { status: 500 }
      );
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { success: false, message: "description is required" },
        { status: 400 }
      );
    }
    if (!severity || typeof severity !== "string") {
      return NextResponse.json(
        { success: false, message: "severity is required" },
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
    <h2>🐛 New Bug Report</h2>
    <p><strong style="color: ${
      SeverityColor[severity as keyof typeof SeverityColor]
    }">Severity: ${escapeHtml((severity as string).toUpperCase())}</strong></p>
    <p><strong>Title:</strong> ${escapeHtml(title)}</p>
    <p><strong>Reporter Email:</strong> <a href="mailto:${escapeHtml(
      email
    )}">${escapeHtml(email)}</a></p>
    <p><strong>Report ID:</strong> <code>${escapeHtml(reportId)}</code></p>
    <hr>
    <h3>Description:</h3>
    <p>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
    ${
      stepsToReproduce
        ? `<h3>Steps to Reproduce:</h3><p>${escapeHtml(
            stepsToReproduce
          ).replace(/\n/g, "<br>")}</p>`
        : ""
    }
    <hr>
    <p style="color: #666; font-size: 12px;">
      Submitted at: ${new Date().toISOString()}
    </p>
  `;

    const success = sendEmail({
      to: devEmail,
      subject: `[BUG - ${severity.toUpperCase()}] ${title}`,
      html,
      serviceType: "bug-report-team",
    });
    return NextResponse.json(
      { success, message: "Bug report email sent to team" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Email:bug-report-team] Error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
