import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { BackendError } from "@/backend/common/backend.error";
import { photoDomain } from "@/backend/domains/photos/module";
import { photoIdParamDto } from "@/backend/dtos/photo.dto";

/*
  GET /api/photos/[id]/owner
*/
export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const params = photoIdParamDto.parse(await context.params);
		const ownerId = await photoDomain.photosApplication.getOwnerId(params.id);
		return NextResponse.json({
			success: true,
			message: "Successfully fetched photo's owner.",
			data: { ownerId },
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid photo ID format",
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
			{ success: false, message: "Failed to fetch photo owner" },
			{ status: 500 }
		);
	}
}
