import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await connectDB();
    console.log("photoId", id);
    const photo = await Photo.findById(id).lean();
    return NextResponse.json({
      success: true,
      message: "Successfully fetched photo.",
      data: photo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch photo " + error },
      { status: 500 }
    );
  }
}
