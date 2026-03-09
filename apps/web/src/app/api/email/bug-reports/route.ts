import { connectDB } from "@/lib/mongodb";
import BugReport from "@/models/BugReport";
import { NextResponse } from "next/server";
import { bugReportLimiter } from "@/lib/rateLimiter";
import { validateBugReportData } from "@/lib/validation";
import { BugReportTeamEmail } from "@/frontend/components/emailTemplates/BugReportTeamEmail";
import getResend from "@/lib/resend";
import { BugReportConfirmationEmail } from "@/frontend/components/emailTemplates/BugReportConfirmationEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/bug-reports
 * Submit a bug report
 *
 * Security measures:
 * - Input validation and sanitization
 * - Rate limiting (3 requests per 24 hours per IP)
 * - MongoDB validation schemas
 * - IP tracking for abuse detection
 * - Error messages don't leak sensitive info
 */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { success } = await bugReportLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "You've submitted too many bug reports. Please try again in 24 hours.",
      },
      { status: 429 },
    );
  }

  const {
    title,
    email,
    description,
    stepsToReproduce,
    actualBehavior,
    expectedBehavior,
  } = await req.json();

  const validation = validateBugReportData({
    title,
    email,
    description,
    stepsToReproduce,
    expectedBehavior,
    actualBehavior,
  });
  if (!validation.isValid) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  await connectDB();

  let severity: "low" | "medium" | "high" | "critical" = "medium";
  const reportText = (
    validation.data.title +
    " " +
    validation.data.description
  ).toLowerCase();

  const criticalKeywords = [
    "crash",
    "broken",
    "can't",
    "cannot",
    "not working",
    "data loss",
  ];
  const highKeywords = ["error", "bug", "issue", "fail", "slow"];

  if (criticalKeywords.some((keyword) => reportText.includes(keyword))) {
    severity = "critical";
  } else if (highKeywords.some((keyword) => reportText.includes(keyword))) {
    severity = "high";
  }
  const bugReport = new BugReport({
    ...validation.data,
    severity,
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") || "",
  });
  const reportId = bugReport._id.toString();
  const validationError = bugReport.validateSync();
  if (validationError) {
    const errors: Record<string, string> = {};
    Object.entries(validationError.errors).forEach(([key, error]: any) => {
      errors[key] = error.message;
    });

    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors,
      },
      { status: 400 },
    );
  }

  await bugReport.save();

  try {
    const resend = await getResend();
    await resend.emails.send({
      from: "bug_reports@rensa.site",
      to: process.env.DEV_TEAM_EMAIL || process.env.ADMIN_EMAIL || "",
      subject: `New Bug Report: ${bugReport.title}`,
      react: BugReportTeamEmail({
        title,
        email,
        description,
        stepsToReproduce,
        actualBehavior,
        expectedBehavior,
        severity,
        reportId,
        submittedAt: bugReport.createdAt.toISOString(),
      }),
    });
    await resend.emails.send({
      from: process.env.NO_REPLY_EMAIL || "",
      to: bugReport.email,
      subject: `Bug Report Received: ${bugReport.title}`,
      react: BugReportConfirmationEmail({
        title: bugReport.title,
        reportId,
      }),
    });
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reporting this bug! We appreciate your help.",
        data: {
          id: bugReport._id,
          severity,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error sending bug report to team:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "There was an error processing your bug report. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/bug-reports
 * Retrieve bug reports (admin only)
 *
 * Query parameters:
 * - status: new, investigating, acknowledged, resolved, closed
 * - severity: low, medium, high, critical
 * - page: pagination page number
 * - limit: results per page
 * - sortBy: field to sort by (default: createdAt)
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "-createdAt";

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const bugReports = await BugReport.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await BugReport.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: bugReports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Bug Report GET API Error]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve bug reports",
      },
      { status: 500 },
    );
  }
}
