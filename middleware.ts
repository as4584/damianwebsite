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
 * - Enforce authentication (future)
 */

import { NextRequest } from 'next/server';
import { handleSubdomainRouting } from './app/dashboard/middleware/hostRouter';

/**
 * Main middleware function
 * Order of operations:
 * 1. Subdomain routing (CRITICAL - must run first)
 * 2. Authentication checks (future)
 * 3. Authorization checks (future)
 */
export function middleware(request: NextRequest) {
  // STEP 1: Handle subdomain routing
  // This routes dashboard.* to /dashboard automatically
  const subdomainResponse = handleSubdomainRouting(request);
  
  // If subdomain routing returned a redirect/rewrite, use it
  if (subdomainResponse) {
    return subdomainResponse;
  }
  
  // STEP 2: Future authentication checks would go here
  // Example:
  // if (isDashboardRequest && !isAuthenticated) {
  //   return redirectToLogin();
  // }
  
  // STEP 3: Continue to app
  return subdomainResponse;
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
