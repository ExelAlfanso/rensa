import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Roll, { RollDocument } from "@/models/Roll";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/*
    GET /api/rolls/[rollId]
    Fetch a specific roll by ID
    Returns { success: boolean, message: string, data: roll }
*/
export async function GET(
  req: Request,
  context: { params: Promise<{ rollId: string }> }
) {
  const { rollId } = await context.params;

  try {
    await connectDB();
    const roll = await Roll.findById(rollId).lean();
    if (!roll) {
      return NextResponse.json(
        { success: false, message: "Roll not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Fetched roll successfully", data: roll },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching roll:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
  PATCH /api/rolls/[rollId]
  Update roll details (name)
  🔒 REQUIRES AUTHENTICATION & OWNERSHIP
*/

export async function PATCH(
  req: Request,
  context: { params: Promise<{ rollId: string }> }
) {
  const { rollId } = await context.params;
  const { name } = await req.json();

  // ✅ SECURITY: Verify user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please login to update rolls.",
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // 🔒 SECURITY FIX: First verify the roll exists and user owns it
    const rollOwner = await Roll.findById(rollId).select("userId").lean();

    if (!rollOwner) {
      return NextResponse.json(
        { success: false, message: "Roll not found" },
        { status: 404 }
      );
    }

    // ✅ SECURITY: Verify ownership - only the owner can update their roll
    if (rollOwner.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden. You don't own this roll." },
        { status: 403 }
      );
    }

    // ✅ SECURITY: Only update the name field, NEVER overwrite userId
    const updatedRoll = await Roll.findByIdAndUpdate(
      rollId,
      { name }, // Only update name, not userId!
      { new: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        message: "Roll updated successfully",
        data: updatedRoll,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating roll:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
  DELETE /api/rolls/[rollId]
  Delete a specific roll by ID
*/

export async function DELETE(
  req: Request,
  context: { params: Promise<{ rollId: string }> }
) {
  const { rollId } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const roll = await Roll.findById(rollId).lean<RollDocument>();
  if (!roll) {
    return NextResponse.json(
      { success: false, message: "Roll not found" },
      { status: 404 }
    );
  }
  if (roll.userId?.toString() !== session.user.id) {
    return NextResponse.json(
      { success: false, message: "Forbidden: You don't own this roll" },
      { status: 403 }
    );
  }
  try {
    await connectDB();
    const deletedRoll = await Roll.findByIdAndDelete(rollId).lean();
    if (!deletedRoll) {
      return NextResponse.json(
        { success: false, message: "Roll not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Roll deleted successfully",
        data: deletedRoll,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting roll:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
