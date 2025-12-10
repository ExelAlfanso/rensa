import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid photo ID format" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const photo = await Photo.findById(id).lean();
    if (!photo) {
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 404 }
      );
    }
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
