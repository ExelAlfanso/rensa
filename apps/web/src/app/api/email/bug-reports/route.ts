import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { bugReports } from "@/backend/db/schema";
import { BugReportConfirmationEmail } from "@/frontend/components/emailTemplates/BugReportConfirmationEmail";
import { BugReportTeamEmail } from "@/frontend/components/emailTemplates/BugReportTeamEmail";
import { authOptions } from "@/lib/auth";
import db from "@/lib/drizzle";
import { bugReportLimiter } from "@/lib/rateLimiter";
import getResend from "@/lib/resend";
import { validateBugReportData } from "@/lib/validation";

/**
 * POST /api/bug-reports
 * Submit a bug report
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
			{ status: 429 }
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
			{ status: 400 }
		);
	}

	let severity: "low" | "medium" | "high" | "critical" = "medium";
	const validatedTitle = validation.data.title;
	const validatedEmail = validation.data.email;
	const validatedDescription = validation.data.description;
	const validatedSteps = validation.data.stepsToReproduce;
	const validatedActual = validation.data.actualBehavior;
	const validatedExpected = validation.data.expectedBehavior;
	const reportText = (
		validatedTitle +
		" " +
		validatedDescription
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

	const [bugReport] = await db
		.insert(bugReports)
		.values({
			title: validatedTitle,
			email: validatedEmail,
			description: validatedDescription,
			steps: validatedSteps ?? null,
			expectedBehavior: validatedExpected ?? null,
			actualBehavior: validatedActual ?? null,
			severity,
			ipAddress: ip,
			userAgent: req.headers.get("user-agent") || "",
		})
		.returning({
			bugReportId: bugReports.bugReportId,
			createdAt: bugReports.createdAt,
			email: bugReports.email,
			title: bugReports.title,
		});

	if (!bugReport) {
		return NextResponse.json(
			{
				success: false,
				message: "Validation failed",
				errors: {
					database: "Failed to save bug report",
				},
			},
			{ status: 400 }
		);
	}

	const reportId = bugReport.bugReportId;

	try {
		const resend = await getResend();
		await resend.emails.send({
			from: "bug_reports@rensa.site",
			to: process.env.DEV_TEAM_EMAIL || process.env.ADMIN_EMAIL || "",
			subject: `New Bug Report: ${bugReport.title}`,
			react: BugReportTeamEmail({
				title: validatedTitle,
				email: validatedEmail,
				description: validatedDescription,
				stepsToReproduce: validatedSteps,
				actualBehavior: validatedActual,
				expectedBehavior: validatedExpected,
				severity,
				reportId,
				submittedAt:
					bugReport.createdAt?.toISOString() ?? new Date().toISOString(),
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
					id: reportId,
					severity,
				},
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error sending bug report to team:", err);
		return NextResponse.json(
			{
				success: false,
				message:
					"There was an error processing your bug report. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

/**
 * GET /api/bug-reports
 * Retrieve bug reports (admin only)
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
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(req.url);
		const status = searchParams.get("status");
		const severity = searchParams.get("severity");
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const sortBy = searchParams.get("sortBy") || "-createdAt";

		const descending = sortBy.startsWith("-");
		const sortField = descending ? sortBy.slice(1) : sortBy;
		const from = (page - 1) * limit;
		type BugStatus = NonNullable<typeof bugReports.$inferInsert.status>;
		type BugSeverity = NonNullable<typeof bugReports.$inferInsert.severity>;
		const validStatuses: BugStatus[] = [
			"new",
			"investigating",
			"acknowledged",
			"resolved",
			"closed",
		];
		const validSeverities: BugSeverity[] = [
			"low",
			"medium",
			"high",
			"critical",
		];
		let whereClause: SQL<unknown> | undefined;
		if (status) {
			if (validStatuses.includes(status as BugStatus)) {
				whereClause = eq(bugReports.status, status as BugStatus);
			}
		}
		if (severity) {
			if (validSeverities.includes(severity as BugSeverity)) {
				const severityWhere = eq(bugReports.severity, severity as BugSeverity);
				whereClause = whereClause
					? and(whereClause, severityWhere)
					: severityWhere;
			}
		}
		const orderByClause =
			sortField === "updatedAt"
				? descending
					? desc(bugReports.updatedAt)
					: bugReports.updatedAt
				: descending
					? desc(bugReports.createdAt)
					: bugReports.createdAt;

		const data = await db
			.select()
			.from(bugReports)
			.where(whereClause)
			.orderBy(orderByClause)
			.limit(limit)
			.offset(from);
		const [countRow] = await db
			.select({ total: count() })
			.from(bugReports)
			.where(whereClause);
		const total = Number(countRow?.total ?? 0);

		return NextResponse.json({
			success: true,
			data,
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
			{ status: 500 }
		);
	}
}
