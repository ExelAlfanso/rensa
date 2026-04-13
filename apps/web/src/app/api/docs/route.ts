import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized" },
			{ status: 401 }
		);
	}
	if (session.user.role !== "admin") {
		return NextResponse.json(
			{ success: false, message: "Not found" },
			{ status: 404 }
		);
	}

	return NextResponse.redirect(new URL("/swagger", request.url), 307);
}
