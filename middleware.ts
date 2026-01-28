/**
 * Next.js Middleware
 * Handles access control for dashboard routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public dashboard routes (no auth required for now - MVP)
const PUBLIC_DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/leads'
];

// Check if route is a protected dashboard route
function isProtectedDashboardRoute(pathname: string): boolean {
  // For MVP, allow all dashboard routes
  // In production, check actual auth here
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only handle dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }
  
  // For MVP: Allow all dashboard access
  // In production: Implement proper auth check here
  
  // Check for protected routes
  if (isProtectedDashboardRoute(pathname)) {
    // Check for auth cookie or header
    const authToken = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('dashboard_session');
    
    if (!authToken && !sessionCookie) {
      // Redirect to login (when implemented)
      // return NextResponse.redirect(new URL('/dashboard/login', request.url));
      
      // For now, allow access
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all dashboard routes
    '/dashboard/:path*'
  ]
};
