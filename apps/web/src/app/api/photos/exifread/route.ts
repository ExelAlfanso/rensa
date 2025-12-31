import { expressApi } from "@/lib/axios-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  try {
    const res = await expressApi.post("/exifread", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: res.data.data.metadata,
        message: "EXIF detection success",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "EXIF detection failed" },
      { status: 500 }
    );
  }
}
