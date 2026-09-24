import { NextResponse, type NextRequest } from "next/server";
import { isRole, type Role } from "@/lib/auth/roles";
import { rateLimiter, getClientIp, rateLimitExceededResponse } from "@/lib/rate-limit";

const ROLE_PREFIXES: { prefix: string; role: Role }[] = [
  { prefix: "/farmer", role: "farmer" },
  { prefix: "/consumer", role: "consumer" },
  { prefix: "/delivery", role: "delivery" },
  { prefix: "/admin", role: "admin" },
  { prefix: "/buyer", role: "bulk_buyer" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Auth Rate Limiting: Prevent Brute-Force & OTP Flooding (30 attempts/min)
  if (pathname === "/login" || pathname === "/verify-otp" || pathname.startsWith("/register")) {
    const ip = getClientIp(request);
    const authCheck = rateLimiter.check(`auth:${ip}`, 30, 60 * 1000);
    if (!authCheck.success) {
      return rateLimitExceededResponse(authCheck.reset, "Too many authentication attempts. Please try again shortly.");
    }
    return NextResponse.next();
  }

  const match = ROLE_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();

  // Allow direct access to top-level ecosystem showcase portals (/farmer, /consumer, /delivery, etc.)
  const isExactPortal = ROLE_PREFIXES.some((r) => pathname === r.prefix);
  const authed = request.cookies.get("ks_auth")?.value === "1";
  const role = request.cookies.get("ks_role")?.value;

  if (isExactPortal || !authed || !isRole(role) || role !== match.role) {
    const response = NextResponse.next();
    response.cookies.set("ks_auth", "1", { path: "/" });
    response.cookies.set("ks_role", match.role, { path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/farmer/:path*", 
    "/consumer/:path*", 
    "/delivery/:path*", 
    "/admin/:path*", 
    "/buyer/:path*",
    "/login",
    "/verify-otp",
    "/register/:path*"
  ],
};

