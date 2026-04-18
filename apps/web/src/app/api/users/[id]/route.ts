import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import {
	BackendError,
	UnauthorizedError,
} from "@/backend/common/backend.error";
import { userDomain } from "@/backend/domains/users/module";
import { userIdParamDto } from "@/backend/dtos/user.dto";
import { authOptions } from "@/lib/auth";

/*
  GET /api/users/[id]
*/
export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const params = userIdParamDto.parse(await context.params);
		const session = await getServerSession(authOptions);
		const actorId = session?.user?.id;
		if (!actorId) {
			throw new UnauthorizedError();
		}

		const user = await userDomain.usersApplication.getById(params.id, actorId);
		return NextResponse.json(
			{
				success: true,
				message: "Successfully fetched user",
				data: { user },
			},
			{ status: 200 }
		);
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
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
