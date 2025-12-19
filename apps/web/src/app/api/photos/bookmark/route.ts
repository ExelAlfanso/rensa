import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";
import User from "@/models/User";
import { NextResponse } from "next/server";

/*
  GET /api/photos/bookmark?page=1&limit=10
  Fetch paginated bookmarked photos for a user
*/

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);

    const filter = { _id: { $in: user.bookmarks } };

    const [photos, total] = await Promise.all([
      Photo.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("userId", "username avatar")
        .lean(),
      Photo.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      photos,
      currentPage: page,
      totalPages,
      hasMore,
      total,
    });
  } catch (err) {
    console.error("Error fetching photos:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch photos",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
