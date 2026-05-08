import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/auth/login";
  const isAdminRoot = pathname === "/admin" || pathname === "/admin/";
  const isAdminPath = pathname.startsWith("/admin");

  // 1. Handle root /admin - redirect to dashboard or login
  if (isAdminRoot) {
    const target = sessionCookie ? "/admin/dashboard" : "/auth/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. Protect /admin subpaths (except login page)
  if (isAdminPath && !isLoginPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Redirect already logged-in users away from the login page
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth/login"],
};
