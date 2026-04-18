import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import {
	BackendError,
	UnauthorizedError,
} from "@/backend/common/backend.error";
import { bookmarkDomain } from "@/backend/domains/bookmarks/module";
import { bookmarkActionDto } from "@/backend/dtos/bookmark.dto";
import { photoIdParamDto } from "@/backend/dtos/photo.dto";
import { authOptions } from "@/lib/auth";

/*
  POST /api/photos/bookmark/[id]
*/
export async function POST(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const params = photoIdParamDto.parse(await context.params);
		const body = bookmarkActionDto.parse(await request.json());
		const session = await getServerSession(authOptions);
		const actorId = session?.user?.id;
		if (!actorId) {
			throw new UnauthorizedError();
		}

		const result = await bookmarkDomain.bookmarksApplication.updateBookmark({
			photoId: params.id,
			userId: body.userId,
			action: body.action,
			actorId,
		});

		return NextResponse.json({
			success: true,
			bookmarks: result.bookmarks,
			isBookmarked: result.isBookmarked,
			message: "Bookmark updated",
		});
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
			{ error: "Failed to update bookmark" },
			{ status: 500 }
		);
	}
}
