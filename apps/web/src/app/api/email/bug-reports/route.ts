import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { BugReportConfirmationEmail } from "@/frontend/components/emailTemplates/BugReportConfirmationEmail";
import { BugReportTeamEmail } from "@/frontend/components/emailTemplates/BugReportTeamEmail";
import { authOptions } from "@/lib/auth";
import { bugReportLimiter } from "@/lib/rateLimiter";
import getResend from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";
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

	const { data: bugReport, error } = await supabaseAdmin
		.from("bug_reports")
		.insert({
			title: validation.data.title,
			email: validation.data.email,
			description: validation.data.description,
			steps: validation.data.stepsToReproduce,
			expected_behavior: validation.data.expectedBehavior,
			actual_behavior: validation.data.actualBehavior,
			severity,
			ip_address: ip,
			user_agent: req.headers.get("user-agent") || "",
		})
		.select("bug_report_id,title,email,created_at")
		.single();

	if (error || !bugReport) {
		return NextResponse.json(
			{
				success: false,
				message: "Validation failed",
				errors: {
					database: error?.message ?? "Failed to save bug report",
				},
			},
			{ status: 400 }
		);
	}

	const reportId = bugReport.bug_report_id;

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
				submittedAt: bugReport.created_at,
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
		const column =
			sortField === "createdAt"
				? "created_at"
				: sortField === "updatedAt"
					? "updated_at"
					: "created_at";
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		let query = supabaseAdmin
			.from("bug_reports")
			.select("*", { count: "exact" });
		if (status) {
			query = query.eq("status", status);
		}
		if (severity) {
			query = query.eq("severity", severity);
		}

		const { data, error, count } = await query
			.order(column, { ascending: !descending })
			.range(from, to);

		if (error) {
			throw error;
		}

		return NextResponse.json({
			success: true,
			data,
			pagination: {
				page,
				limit,
				total: count ?? 0,
				pages: Math.ceil((count ?? 0) / limit),
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
