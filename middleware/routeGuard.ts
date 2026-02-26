/**
 * Route Guard Middleware
 * Controls access to dashboard routes
 * 
 * Responsibilities:
 * - Intercepts requests to /dashboard/*
 * - Validates authentication
 * - Determines tenant and access level
 * - Routes authorized users appropriately
 * - Blocks/redirects unauthorized access
 */

import { AccessContext } from '../frontend/app/dashboard/types';

interface RequestInfo {
  headers: Record<string, string | undefined>;
  cookies: Record<string, string | undefined>;
}

interface HostInfo {
  host: string;
}

// Valid token patterns (in production, verify against actual auth service)
const VALID_TOKEN_PATTERNS = {
  owner: /^(owner_token|valid_token_\w+|session_owner_\w+)$/,
  admin: /^(admin_token|session_admin_\w+)$/,
  viewer: /^(viewer_token|session_viewer_\w+)$/
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/dashboard', '/dashboard/login', '/dashboard/signup'];

// Routes that require authentication
const PROTECTED_ROUTE_PATTERNS = [
  /^\/dashboard\/leads\/.+/,
  /^\/dashboard\/api\/.+/,
  /^\/dashboard\/settings/,
  /^\/dashboard\/export/
];

/**
 * Validate access based on request credentials
 */
export function validateAccess(request: RequestInfo): AccessContext {
  const authHeader = request.headers.authorization;
  const sessionCookie = request.cookies['dashboard_session'];

  // Check for auth token
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    return validateToken(token);
  }

  // Check for session cookie
  if (sessionCookie) {
    return validateSession(sessionCookie);
  }

  // No authentication
  return {
    isAuthorized: false,
    tenantId: null,
    accessLevel: 'none',
    dataScope: 'none',
    reason: 'No authentication credentials provided'
  };
}

/**
 * Validate a bearer token
 */
function validateToken(token: string): AccessContext {
  // Check owner token
  if (VALID_TOKEN_PATTERNS.owner.test(token)) {
    return {
      isAuthorized: true,
      tenantId: 'tenant_from_token',
      accessLevel: 'owner',
      dataScope: 'all'
    };
  }

  // Check admin token
  if (VALID_TOKEN_PATTERNS.admin.test(token)) {
    return {
      isAuthorized: true,
      tenantId: 'tenant_from_token',
      accessLevel: 'admin',
      dataScope: 'all'
    };
  }

  // Check viewer token
  if (VALID_TOKEN_PATTERNS.viewer.test(token)) {
    return {
      isAuthorized: true,
      tenantId: 'tenant_from_token',
      accessLevel: 'viewer',
      dataScope: 'assigned'
    };
  }

  // Invalid token
  return {
    isAuthorized: false,
    tenantId: null,
    accessLevel: 'none',
    dataScope: 'none',
    reason: 'Invalid authentication token'
  };
}

/**
 * Validate a session cookie
 */
function validateSession(session: string): AccessContext {
  // In production, verify against session store
  if (session.startsWith('valid_session_') || session.startsWith('session_')) {
    // Extract role from session if present
    if (session.includes('owner')) {
      return {
        isAuthorized: true,
        tenantId: 'tenant_from_session',
        accessLevel: 'owner',
        dataScope: 'all'
      };
    }
    
    return {
      isAuthorized: true,
      tenantId: 'tenant_from_session',
      accessLevel: 'viewer',
      dataScope: 'assigned'
    };
  }

  return {
    isAuthorized: false,
    tenantId: null,
    accessLevel: 'none',
    dataScope: 'none',
    reason: 'Invalid session'
  };
}

/**
 * Get full access context for a request
 */
export function getAccessContext(request: RequestInfo): AccessContext {
  return validateAccess(request);
}

/**
 * Check if a route is authorized for the given context
 */
export function isAuthorizedRoute(path: string, context: AccessContext): boolean {
  // Public routes are always accessible
  if (PUBLIC_ROUTES.includes(path)) {
    return true;
  }

  // Check if route requires authentication
  const isProtected = PROTECTED_ROUTE_PATTERNS.some(pattern => pattern.test(path));
  
  if (isProtected) {
    return context.isAuthorized;
  }

  // Default: allow access
  return true;
}

/**
 * Extract tenant ID from request host
 */
export function extractTenantFromRequest(hostInfo: HostInfo): string {
  const { host } = hostInfo;

  // Handle localhost
  if (host.includes('localhost')) {
    return 'development';
  }

  // Extract subdomain from dashboard.innovationdevelopmentsolutions.com
  const parts = host.split('.');
  
  // If subdomain exists before 'dashboard'
  if (parts.length > 3 && parts[0] !== 'dashboard') {
    return parts[0];
  }

  return 'default';
}

/**
 * Middleware handler for dashboard routes
 */
export function dashboardMiddleware(request: {
  path: string;
  headers: Record<string, string | undefined>;
  cookies: Record<string, string | undefined>;
  host: string;
}): {
  allowed: boolean;
  redirect?: string;
  context: AccessContext;
} {
  const accessContext = getAccessContext({
    headers: request.headers,
    cookies: request.cookies
  });

  const isAllowed = isAuthorizedRoute(request.path, accessContext);
  const tenant = extractTenantFromRequest({ host: request.host });

  // Add tenant to context
  if (accessContext.isAuthorized) {
    accessContext.tenantId = tenant;
  }

  if (!isAllowed) {
    return {
      allowed: false,
      redirect: '/dashboard/login',
      context: accessContext
    };
  }

  return {
    allowed: true,
    context: accessContext
  };
}
