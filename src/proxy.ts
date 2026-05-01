import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/jwt";

// Paths that require JWT authentication (User portal)
const protectedPaths = ["/dashboard", "/api/v1/api-keys", "/api/v1/usage", "/api/v1/notes"];

// Paths that require Admin role
const adminPaths = ["/api/v1/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p));

  if (isProtected || isAdmin) {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
      }
      // Token invalid or expired
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      return response;
    }

    if (isAdmin && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // Attach user info to headers for backend routes to consume
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Redirect authenticated users away from login/register pages
  if (pathname === "/login" || pathname === "/register") {
    const token = req.cookies.get("accessToken")?.value;
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/v1/api-keys/:path*",
    "/api/v1/usage/:path*",
    "/api/v1/notes/:path*",
    "/api/v1/admin/:path*",
  ],
};
