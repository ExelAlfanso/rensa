import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const isProtectedPage =
    pathname.startsWith("/chat") || pathname.startsWith("/explore");

  // 🔒 Belum login → protected page
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 Sudah login → auth pages (login / register)
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/explore", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/explore/:path*", "/api/:path*"],
};
