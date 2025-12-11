import Roll from "@/models/Roll";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ rollId: string }> }
) {
  const { rollId } = await context.params;
  const userId = await Roll.findById(rollId).select("userId").lean();
  if (userId === null) {
    return NextResponse.json(
      {
        success: false,
        message: "Roll not found",
        data: null,
      },
      { status: 404 }
    );
  }
  return NextResponse.json({
    success: true,
    message: "Successfully fetched profile data from roll id",
    data: userId,
  });
}
