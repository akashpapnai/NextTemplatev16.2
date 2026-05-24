import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

const PUBLIC_PATHS = ["/login", "/verify-otp", "/_next", "/favicon.ico", "/api/authorization"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function getJwtExpiry(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

const EXPIRY_BUFFER_SECONDS = 30;

function isTokenExpiredOrExpiring(token: string | undefined): boolean {
  if (!token) return true;
  const exp = getJwtExpiry(token);
  if (exp === null) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp - nowSeconds <= EXPIRY_BUFFER_SECONDS;
}

function parseSetCookie(raw: string): { name: string; value: string } | null {
  const [nameValue] = raw.split(";");
  const eq = nameValue.indexOf("=");
  if (eq === -1) return null;
  return {
    name: nameValue.slice(0, eq).trim(),
    value: nameValue.slice(eq + 1).trim(),
  };
}

async function attemptRefresh(request: NextRequest): Promise<NextResponse | null> {
  try {
    const refreshRes = await fetch(`${BACKEND_URL}/Authorization/RefreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!refreshRes.ok) return null;

    const newSetCookies = refreshRes.headers.getSetCookie();

    const parsedNew = newSetCookies
      .map(parseSetCookie)
      .filter((c): c is { name: string; value: string } => c !== null);

    const cookieMap = new Map<string, string>();
    for (const pair of (request.headers.get("cookie") ?? "").split(";")) {
      const eq = pair.indexOf("=");
      if (eq === -1) continue;
      cookieMap.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
    }
    for (const { name, value } of parsedNew) {
      cookieMap.set(name, value);
    }

    const updatedCookieHeader = Array.from(cookieMap.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("cookie", updatedCookieHeader);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    for (const cookie of newSetCookies) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (err) {
    console.error("[proxy] Refresh failed:", err);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const authTokenValue = request.cookies.get("AuthToken")?.value;
  const refTokenValue = request.cookies.get("RefToken")?.value;

  if (authTokenValue && !isTokenExpiredOrExpiring(authTokenValue)) {
    return NextResponse.next();
  }

  if (refTokenValue) {
    const refreshed = await attemptRefresh(request);
    if (refreshed) return refreshed;

    // RefToken also dead — clear both cookies and send to login
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("AuthToken");
    response.cookies.delete("RefToken");
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};