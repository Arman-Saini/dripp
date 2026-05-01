import { NextResponse } from "next/server";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dripp123";

export async function GET() {
  return NextResponse.json({
    username: ADMIN_USERNAME,
    note: "Development admin access is open. Change ADMIN_USERNAME and ADMIN_PASSWORD in environment variables before real deployment."
  });
}

export async function POST(request) {
  const { username, password } = await request.json();
  const valid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  return NextResponse.json({
    ok: valid,
    admin: true,
    message: valid
      ? "Admin login accepted."
      : "Admin access is currently open for development, but these credentials did not match."
  });
}
