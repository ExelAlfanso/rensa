import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Roll, { RollDocument } from "@/models/Roll";
import Photo from "@/models/Photo";
import cloudinary from "@/lib/cloudinary";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

/*
  POST /api/rolls/[rollId]/photos/[photoId]
  Add a photo to selected roll
*/
export async function POST(
  req: Request,
  context: { params: Promise<{ rollId: string; photoId: string }> },
) {
  try {
    await connectDB();

    const { rollId, photoId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const roll = await Roll.findById(rollId).lean<RollDocument>();
    if (!roll || roll.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }
    if (!rollId?.length || !photoId) {
      return NextResponse.json(
        { success: false, message: "Missing rollId or photoId" },
        { status: 400 },
      );
    }

    const result = await Roll.updateOne(
      {
        _id: rollId,
      },
      {
        $addToSet: { photos: photoId },
      },
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Forbidden or roll not found" },
        { status: 403 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Photo added to selected roll",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Failed to add photo to roll:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add photo to roll" },
      { status: 500 },
    );
  }
}

/*
  DELETE /api/rolls/[rollId]/photos/[photoId] 
  Remove a photo from selected roll
*/

const secret = process.env.NEXTAUTH_SECRET!;

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ rollId: string; photoId: string }> },
) {
  const { rollId, photoId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await getToken({ req, secret });

    const roll = await Roll.findById(rollId);
    if (!roll) {
      return NextResponse.json(
        { success: false, message: "Roll not found" },
        { status: 404 },
      );
    }

    if (roll.userId.toString() !== user?.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 404 },
      );
    }

    if (photo.userId.toString() !== user?.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You don't own this photo" },
        { status: 403 },
      );
    }
    await Photo.findByIdAndDelete(photoId);
    console.log(`✅ Deleted photo record from database: ${photoId}`);

    roll.photos = roll.photos.filter((id: string) => id.toString() !== photoId);
    await roll.save();

    return NextResponse.json({
      success: true,
      message: "Photo removed from roll and deleted permanently",
    });
  } catch (error) {
    console.error("Failed to remove photo from roll:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove photo" },
      { status: 500 },
    );
  }
}
