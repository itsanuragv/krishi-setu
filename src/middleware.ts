import { NextResponse, type NextRequest } from "next/server";
import { isRole, type Role } from "@/lib/auth/roles";

const ROLE_PREFIXES: { prefix: string; role: Role }[] = [
  { prefix: "/farmer", role: "farmer" },
  { prefix: "/consumer", role: "consumer" },
  { prefix: "/delivery", role: "delivery" },
  { prefix: "/admin", role: "admin" },
  { prefix: "/buyer", role: "bulk_buyer" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: ["/farmer/:path*", "/consumer/:path*", "/delivery/:path*", "/admin/:path*", "/buyer/:path*"],
};

