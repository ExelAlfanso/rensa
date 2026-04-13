import { NextResponse } from "next/server";
import { openApiSpec } from "@/backend/shared/openapi/spec";

export async function GET() {
	return NextResponse.json(openApiSpec, {
		status: 200,
		headers: {
			"Cache-Control": "public, max-age=300",
		},
	});
}
