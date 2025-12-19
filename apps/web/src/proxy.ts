import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;

export async function proxy(req: NextRequest) {
  // const { pathname } = req.nextUrl;

  // if (pathname.startsWith("/api/users")) {
  //   const token = await getToken({ req, secret });
  //   if (!token) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/api/users/:path*", "/api/comments/:path*"], // includes /api/users/[id]
// };
