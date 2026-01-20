import { authOptions } from "@/lib/auth";
import Photo from "@/models/Photo";
import User from "@/models/User";
import { ObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/*
  POST /api/photos/[id]/bookmark
  Add or remove bookmark for a photo
*/

//TODO: update bookmark count based on user id that likes on a post
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const { action, userId } = await request.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 404 },
      );
    }

    const isBookmarked = user.bookmarks.some(
      (pid: ObjectId) => pid.toString() === id,
    );

    if (action === "increment" && !isBookmarked) {
      user.bookmarks.push(photo._id);
      photo.bookmarks += 1;
    }

    if (action === "decrement" && isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (pid: ObjectId) => pid.toString() !== id,
      );
      photo.bookmarks = Math.max(0, photo.bookmarks - 1);
    }

    await Promise.all([user.save(), photo.save()]);

    return NextResponse.json({
      success: true,
      bookmarks: user.bookmarks.map((id: ObjectId) => id.toString()),
      isBookmarked:
        action === "increment"
          ? true
          : action === "decrement"
            ? false
            : isBookmarked,
      message: "Bookmark updated",
    });
  } catch (err) {
    console.error("Error updating bookmark:", err);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 },
    );
  }
}
