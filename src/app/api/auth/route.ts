import { NextRequest, NextResponse } from "next/server";

const APP_PASSWORD = process.env.APP_PASSWORD || "kyle2026";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === APP_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
