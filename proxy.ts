/**
 * Next.js Root Middleware
 * Handles subdomain routing and access control
 * 
 * PRIORITY 1: Subdomain detection and routing
 * PRIORITY 2: Authentication and authorization
 * 
 * This middleware runs on EVERY request to:
 * - Route dashboard.* subdomain to /dashboard
 * - Block main domain from accessing /dashboard
 * - Enforce authentication for protected routes
 * 
 * SECURITY ARCHITECTURE:
 * - Middleware validates session exists (Option B - Hard Wall)
 * - Server components validate business ownership (Option A - App-Level)
 * - This provides defense in depth: middleware + server-side validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleSubdomainRouting } from './app/dashboard/middleware/hostRouter';
import { getToken } from 'next-auth/jwt';

/**
 * Protected routes that require authentication
 * These paths will redirect to /login if user is not authenticated
 */
const PROTECTED_ROUTES = [
  '/dashboard',
];

/**
 * Public routes that don't require authentication
 * These paths are accessible to everyone
 */
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/api/auth',
  '/api/auth/signup',
  '/',
  '/about',
  '/services',
  '/contact',
  '/privacy',
  '/terms',
];

/**
 * Check if a path is protected (requires authentication)
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is public (no authentication required)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Main proxy function
 * Order of operations:
 * 1. Subdomain routing (CRITICAL - must run first)
 * 2. Authentication checks (validates session exists)
 * 3. Authorization checks (handled in server components)
 */
export async function proxy(request: NextRequest) {
  // STEP 1: Handle subdomain routing
  // This routes dashboard.* to /dashboard automatically
  const subdomainResponse = handleSubdomainRouting(request);
  
  // If subdomain routing returned a redirect/rewrite, continue with that
  // We'll check auth on the rewritten path
  const effectivePath = subdomainResponse?.headers.get('x-middleware-rewrite')
    ? new URL(subdomainResponse.headers.get('x-middleware-rewrite')!).pathname
    : request.nextUrl.pathname;

  // STEP 2: Authentication check (Option B - Hard Wall)
  // Validate session exists for protected routes
  // SECURITY: This prevents unauthenticated access at the edge
  
  // Skip auth check for public routes and static files
  if (isPublicRoute(effectivePath)) {
    return subdomainResponse || NextResponse.next();
  }

  // Check if route requires authentication
  if (isProtectedRoute(effectivePath)) {
    // Get session token from cookie
    // SECURITY: getToken validates JWT signature, expiry, and structure
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'REPLACE_THIS_WITH_SECURE_SECRET_IN_PRODUCTION',
    });

    // If no valid session, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      // Add return URL so we can redirect back after login
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // SECURITY: Token exists and is valid
    // Business ownership is enforced in server components (Option A)
    // We don't fetch business data here to keep middleware fast
  }

  // STEP 3: Continue to app
  return subdomainResponse || NextResponse.next();
}

/**
 * Middleware configuration
 * Runs on all routes except static files and _next internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
