import { NextRequest, NextResponse } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/customer-display",
  "/self-order",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/display",
  "/api/display/cart",
];

// Exact public paths (not prefix-matched)
const PUBLIC_EXACT = ["/"];

// Role-based access control
const ROLE_ACCESS: Record<string, string[]> = {
  admin: ["*"], // all access
  kasir: ["/", "/cashier", "/orders", "/customers", "/tables", "/products", "/loyalty", "/queue", "/settings"],
  dapur: ["/", "/kitchen", "/queue", "/display", "/orders"],
  pelayan: ["/", "/orders", "/tables", "/queue", "/display"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow exact public paths
  if (PUBLIC_EXACT.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes (they handle their own auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next/") || pathname.startsWith("/icon") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionId = request.cookies.get("session_id")?.value;

  if (!sessionId) {
    // Redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists - allow (role check happens client-side via /api/auth/me)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
