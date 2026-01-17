import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

interface VerifyTokenPayload extends JwtPayload {
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 },
      );
    }

    let payload: VerifyTokenPayload;
    try {
      payload = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET!,
      ) as VerifyTokenPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { success: false, message: "Verification link expired" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { success: false, message: "Invalid verification token" },
        { status: 400 },
      );
    }

    const { email } = payload;

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { success: true, message: "Email already verified" },
        { status: 200 },
      );
    }

    user.verified = true;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error " },
      { status: 500 },
    );
  }
}
