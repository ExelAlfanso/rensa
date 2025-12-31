import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/*
  GET /api/photos/[id]
  Fetch a specific photo by ID
*/
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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 404 }
      );
    }

    if (photo.userId?.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You don't own this photo" },
        { status: 403 }
      );
    }

    await Photo.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete photo " + error },
      { status: 500 }
    );
  }
}
