import { NextResponse, type NextRequest } from "next/server";
import { isRole, ROLE_HOME } from "@/lib/auth/roles";

const ROLE_PREFIXES: { prefix: string; role: string }[] = [
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

  const authed = request.cookies.get("ks_auth")?.value === "1";
  const role = request.cookies.get("ks_role")?.value;

  if (!authed || !isRole(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (role !== match.role) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_HOME[role];
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/farmer/:path*", "/consumer/:path*", "/delivery/:path*", "/admin/:path*", "/buyer/:path*"],
};
