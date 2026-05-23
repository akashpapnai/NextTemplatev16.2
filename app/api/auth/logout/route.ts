import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // Notify backend (optional — fire and forget)
  try {
    await fetch(`${BACKEND_URL}/api/v1/Auth/Logout`, {
      method: "POST",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
  } catch {
    // Continue regardless
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("AuthToken");
  response.cookies.delete("RefreshToken");
  return response;
}