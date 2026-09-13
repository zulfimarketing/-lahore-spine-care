import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Change these before going live (or move to environment variables).
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "reception";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "spinecare2024";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies().set("lsc_admin_session", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
  cookies().delete("lsc_admin_session");
  return NextResponse.json({ ok: true });
}
