import { NextResponse } from "next/server";
import { adminCookieName, expectedAdminToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string;
  };

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return NextResponse.json(
      { ok: false, error: "Missing ADMIN_PASSWORD." },
      { status: 500 },
    );
  }

  if (!password || password !== expectedPassword) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), expectedAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

