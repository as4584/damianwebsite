import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

/**
 * PRODUCTION-READY MIDDLEWARE WITH SUBDOMAIN ROUTING
 * 
 * SUBDOMAIN ROUTING:
 * - dashboard.* subdomain → redirect to /login (if unauthenticated) or /dashboard (if authenticated)
 * - All other subdomains → normal routing
 * 
 * PROTECTED_ROUTES:
 * - /dashboard/:path*
 * - /api/dashboard/:path*
 */

export const PROTECTED_ROUTES = ["/dashboard", "/api/dashboard"];

/**
 * Check if request is for the dashboard subdomain
 */
function isDashboardSubdomain(req: NextRequest): boolean {
  const host = req.headers.get("host") || "";
  // Match dashboard.* subdomain (production or any custom domain)
  return host.startsWith("dashboard.");
}

/**
 * Main middleware with subdomain awareness
 */
async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // SUBDOMAIN ROUTING: Handle dashboard.* subdomain
  if (isDashboardSubdomain(req)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // If on dashboard subdomain and visiting root, redirect appropriately
    if (pathname === "/" || pathname === "") {
      if (token) {
        // Authenticated → go to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        // Not authenticated → go to login
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
    
    // Block marketing pages on dashboard subdomain
    const marketingPages = ["/about", "/services", "/contact", "/who-we-serve", "/starting-a-business", "/industries"];
    if (marketingPages.some(page => pathname.startsWith(page))) {
      // Redirect marketing pages to login on dashboard subdomain
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  // Normal routing for non-dashboard subdomains
  return NextResponse.next();
}

// Wrap with auth for protected routes
export default withAuth(
  middleware,
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Dashboard routes require authentication
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard")) {
          return !!token;
        }
        
        // All other routes are public
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Match all paths except static files and API routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/health|api/chat|api/leads|api/auth).*)",
  ],
};
