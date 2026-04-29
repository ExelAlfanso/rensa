import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/backend/common/backend.error";
import { photoBookmarkQueryDto } from "@/backend/dtos/photo.dto";
import { photoController } from "@/backend/services/photos/controller";

/*
  GET /api/photos/bookmark?page=1&limit=10&userId=...
*/
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const query = photoBookmarkQueryDto.parse({
			userId: searchParams.get("userId") ?? undefined,
			page: searchParams.get("page") ?? undefined,
			limit: searchParams.get("limit") ?? undefined,
		});

		const result = await photoController.listBookmarkedByUser(
			query.userId,
			query.page,
			query.limit
		);

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Validation failed",
					details: error.flatten(),
				},
				{ status: 400 }
			);
		}

		if (error instanceof BackendError) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
					code: error.code,
				},
				{ status: error.statusCode }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to fetch photos",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
