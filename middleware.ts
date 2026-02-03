import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * PRODUCTION-READY MIDDLEWARE
 * Enforces authentication and route protection using next-auth
 * 
 * PROTECTED_ROUTES:
 * - /dashboard/:path*
 * - /api/dashboard/:path*
 */

export const PROTECTED_ROUTES = ["/dashboard", "/api/dashboard"];

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
};
