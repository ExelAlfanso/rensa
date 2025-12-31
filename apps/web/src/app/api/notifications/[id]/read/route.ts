import { elysiaApi } from "@/lib/axios-server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: notificationId } = await context.params;
  try {
    await elysiaApi.put(`/notifications/${notificationId}/read`);
    return NextResponse.json(
      {
        success: true,
        message: "Notification marked as read successfully",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await context.params;
  try {
    await elysiaApi.delete(`/notifications/${userId}`);
    return NextResponse.json(
      {
        success: true,
        message: "Notifications cleared successfully",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to clear notifications" },
      { status: 500 }
    );
  }
}
