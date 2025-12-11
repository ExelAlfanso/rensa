import { NextResponse } from "next/server";
import Roll from "@/models/Roll";
import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";
import { SortOrder } from "mongoose";
import { create } from "domain";

/*
  GET /api/rolls?userId=...&sort=recent||mostPopular||oldest||leastPopular
  Fetch rolls for a specific user
  Returns { success: boolean, message: string, data: rolls[] }
*/
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("userId");
  const sort = searchParams.get("sort") || "latest" || "oldest";

  const sortOptions: Record<string, SortOrder> =
    sort === "latest" ? { createdAt: -1 } : { createdAt: 1 };
  try {
    const rolls = await Roll.find({ userId: id }).sort(sortOptions).lean();
    const rollsWithPreviews = await Promise.all(
      rolls.map(async (roll) => {
        const randomPhotos = await Photo.aggregate([
          { $match: { _id: { $in: roll.photos } } },
          { $sample: { size: 4 } },
          { $project: { url: 1, _id: 1 } },
        ]);
        return {
          ...roll,
          previewPhotos: randomPhotos.map((p) => p.url),
        };
      })
    );
    return NextResponse.json(
      {
        success: true,
        message: "Fetched rolls successfully",
        data: { rolls: rollsWithPreviews },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
  POST /api/rolls
  Create a new roll
*/

export async function POST(req: Request) {
  await connectDB();
  const { name, imageUrl, userId } = await req.json();
  try {
    const newRoll = new Roll({
      name: name,
      userId: userId,
      photos: [],
      imageUrl: imageUrl || "/images/image6.JPG",
    });
    await newRoll.save();
    return NextResponse.json(
      {
        success: true,
        message: "Roll created successfully",
        data: {
          _id: newRoll._id.toString(),
          name: newRoll.name,
          userId: newRoll.userId,
          imageUrl: newRoll.imageUrl,
          photos: newRoll.photos,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create roll" },
      { status: 500 }
    );
  }
}
