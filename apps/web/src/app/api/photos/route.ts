import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/backend/common/backend.error";
import { photoDomain } from "@/backend/domains/photos/module";
import { listPhotosQueryDto } from "@/backend/dtos/photo.dto";

/*
  GET /api/photos?page=1&limit=10&filters=tag1,tag2&sort=recent|popular
*/
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const query = listPhotosQueryDto.parse({
			page: searchParams.get("page") ?? undefined,
			limit: searchParams.get("limit") ?? undefined,
			sort: searchParams.get("sort") ?? undefined,
			filters: searchParams.get("filters") ?? undefined,
		});

		const result = await photoDomain.photosApplication.list(query);
		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: "Invalid request",
					details: error.flatten(),
				},
				{ status: 400 }
			);
		}

		if (error instanceof BackendError) {
			return NextResponse.json(
				{
					error: error.message,
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
