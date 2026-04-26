import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, expectedAdminToken } from "@/lib/adminAuth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  try {
    const token = req.cookies.get(adminCookieName())?.value;
    if (token && token === expectedAdminToken()) return NextResponse.next();
  } catch {
    // fallthrough to redirect
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};

