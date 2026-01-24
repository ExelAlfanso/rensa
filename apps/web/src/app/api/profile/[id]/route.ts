import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { compressImageUnder10MB } from "../../photos/upload/route";
import cloudinary from "@/lib/cloudinary";

/*
  GET /api/profile/[id]
  Fetch user profile by ID along with their rolls and preview photos
*/
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    await connectDB();
    const user = await User.findById(id).select("username email avatar").lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched user profile!",
        data: {
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Please login to update profile.",
      },
      { status: 401 },
    );
  }

  try {
    const { id, username, email, avatar } = await req.json();

    await connectDB();

    const user = await User.findById(id).lean<UserDocument>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Delete old avatar from Cloudinary if it exists
    try {
      const idx = user.avatar.indexOf("user_profile/");
      if (idx !== -1) {
        let publicId = user.avatar.slice(idx);
        const q = publicId.search(/[?#]/);
        if (q !== -1) publicId = publicId.slice(0, q);
        const lastDot = publicId.lastIndexOf(".");
        if (lastDot !== -1) publicId = publicId.slice(0, lastDot);
        publicId = decodeURIComponent(publicId);
        if (/^[A-Za-z0-9_\\-\\/]+$/.test(publicId)) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted from Cloudinary: ${publicId}`);
        } else {
          console.warn(
            "Refused to delete Cloudinary id with unsafe characters",
            publicId,
          );
        }
      }
    } catch (err) {
      console.error("⚠️ Failed to delete old avatar from Cloudinary:", err);
    }

    // Upload new avatar to Cloudinary
    try {
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const compressedBuffer = await compressImageUnder10MB(buffer);

      const base64File = `data:${avatar.type};base64,${compressedBuffer.toString(
        "base64",
      )}`;

      const uploadRes = await cloudinary.uploader.upload(base64File, {
        folder: `user_profile/${session.user.id}`,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
        transformation: [{ width: 200, crop: "limit" }],
      });

      await User.findByIdAndUpdate(
        id,
        { username, email, avatar: uploadRes.secure_url },
        { new: true },
      );
    } catch (err) {
      console.error("Error uploading new avatar:", err);
      return NextResponse.json(
        { success: false, message: "Failed to upload new avatar." },
        { status: 500 },
      );
    }
    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: "Username and email are required" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully updated user profile!",
        data: { user },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
