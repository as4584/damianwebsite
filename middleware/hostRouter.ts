/**
 * Subdomain Host Router
 * Detects subdomain and routes to appropriate app section
 * 
 * CRITICAL: This middleware runs on EVERY request
 * - Detects dashboard.* subdomain from Host header
 * - Routes subdomain traffic to /dashboard
 * - Prevents main domain from accessing /dashboard
 * - Prevents dashboard subdomain from accessing main site
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract subdomain from host header
 * Returns null for main domain, subdomain name otherwise
 */
export function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0];
  
  // Check if it's an IP address (IPv4)
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    return null;
  }
  
  // Split by dots
  const parts = hostname.split('.');
  
  // If we have 3+ parts, first part is subdomain
  // e.g., dashboard.innovationdevelopmentsolutions.com → "dashboard"
  // e.g., innovationdevelopmentsolutions.com → null
  if (parts.length >= 3) {
    return parts[0];
  }
  
  // For localhost testing: dashboard.localhost → "dashboard"
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0];
  }
  
  return null;
}

/**
 * Check if host is dashboard subdomain
 */
export function isDashboardSubdomain(host: string): boolean {
  const subdomain = extractSubdomain(host);
  return subdomain === 'dashboard';
}

/**
 * Check if path is a dashboard path
 */
export function isDashboardPath(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

/**
 * Route subdomain requests to dashboard
 * This rewrites the URL internally without changing what user sees
 */
export function routeSubdomainToDashboard(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  
  // If already on /dashboard path, continue normally
  if (url.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }
  
  // Rewrite root to /dashboard
  if (url.pathname === '/' || url.pathname === '') {
    url.pathname = '/dashboard';
    return NextResponse.rewrite(url);
  }
  
  // Rewrite other paths to /dashboard/[path]
  url.pathname = `/dashboard${url.pathname}`;
  return NextResponse.rewrite(url);
}

/**
 * Block main domain from accessing /dashboard paths
 */
export function blockMainDomainDashboardAccess(request: NextRequest): NextResponse {
  // Redirect to main site
  const url = request.nextUrl.clone();
  url.pathname = '/';
  return NextResponse.redirect(url);
}

/**
 * Block dashboard subdomain from accessing non-dashboard paths
 */
export function blockDashboardSubdomainMainSiteAccess(request: NextRequest): NextResponse {
  // Redirect to dashboard root
  const url = request.nextUrl.clone();
  url.pathname = '/dashboard';
  return NextResponse.rewrite(url);
}

/**
 * Main subdomain routing logic
 */
export function handleSubdomainRouting(request: NextRequest): NextResponse {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  
  const isOnDashboardSubdomain = isDashboardSubdomain(host);
  const isAccessingDashboardPath = isDashboardPath(pathname);
  
  // DEVELOPMENT MODE: Allow direct access to /dashboard on localhost
  // In production, dashboard must be on dashboard.* subdomain
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // CASE 1: Dashboard subdomain accessing non-dashboard path
  // dashboard.example.com/ → rewrite to /dashboard
  if (isOnDashboardSubdomain && !isAccessingDashboardPath) {
    return routeSubdomainToDashboard(request);
  }
  
  // CASE 2: Main domain trying to access /dashboard (PRODUCTION ONLY)
  // example.com/dashboard → redirect to /
  // SKIP THIS CHECK FOR LOCALHOST to allow E2E tests and local development
  if (!isOnDashboardSubdomain && isAccessingDashboardPath && !isLocalhost) {
    return blockMainDomainDashboardAccess(request);
  }
  
  // CASE 3: Dashboard subdomain accessing dashboard path
  // dashboard.example.com/dashboard → allow
  if (isOnDashboardSubdomain && isAccessingDashboardPath) {
    return NextResponse.next();
  }
  
  // CASE 4: Main domain accessing main site OR localhost accessing /dashboard
  // example.com/ → allow
  // localhost:3001/dashboard → allow (development mode)
  return NextResponse.next();
}
