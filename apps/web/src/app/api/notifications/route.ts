import { elysiaApi } from "@/lib/axios-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { recipientId, page, limit } = Object.fromEntries(
    searchParams.entries()
  );

  try {
    const res = await elysiaApi.get(`/notifications`, {
      params: { recipientId, page, limit },
    });
    return NextResponse.json(
      {
        success: true,
        data: res.data.data.notifications,
        message: "Notifications fetched successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { actorId, recipientId, photoId, type } = await req.json();
  try {
    const res = await elysiaApi.post(`/notifications`, {
      actorId,
      recipientId,
      photoId,
      type,
    });
    return NextResponse.json(
      {
        success: true,
        data: res.data,
        message: "Notification created successfully",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create notification" },
      { status: 500 }
    );
  }
}
