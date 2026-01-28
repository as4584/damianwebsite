/**
 * Session Utilities
 * 
 * These helpers validate sessions and enforce business ownership
 * SECURITY: Use these in every server component and API route that accesses data
 */

import { getServerSession } from 'next-auth';
import { authConfig } from './config';
import type { ExtendedSession, SessionUser, PermissionCheck, UserRole } from '../types/auth';
import { db } from '../db/mock-db';

/**
 * Get current session (server-side only)
 * 
 * USAGE:
 * ```typescript
 * const session = await getCurrentSession();
 * if (!session) {
 *   return redirect('/login');
 * }
 * ```
 * 
 * @returns Session with user data or null if not authenticated
 */
export async function getCurrentSession(): Promise<ExtendedSession | null> {
  const session = await getServerSession(authConfig);
  return session as ExtendedSession | null;
}

/**
 * Require authentication - throws if not logged in
 * 
 * USAGE:
 * ```typescript
 * const session = await requireAuth();
 * // Now you have a guaranteed authenticated session
 * ```
 * 
 * @returns Session with user data
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<ExtendedSession> {
  const session = await getCurrentSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized - authentication required');
  }
  return session;
}

/**
 * Get current user from session
 * 
 * USAGE:
 * ```typescript
 * const user = await getCurrentUser();
 * if (!user) {
 *   return redirect('/login');
 * }
 * ```
 * 
 * @returns SessionUser or null if not authenticated
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getCurrentSession();
  return session?.user || null;
}

/**
 * Require authentication and return user
 * 
 * @returns SessionUser
 * @throws Error if not authenticated
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await requireAuth();
  return session.user;
}

/**
 * Get business ID from current session
 * 
 * SECURITY: This is the CRITICAL value for data isolation
 * Every query MUST filter by this businessId
 * 
 * @returns Business ID or null if not authenticated
 */
export async function getBusinessId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.businessId || null;
}

/**
 * Require business ID - throws if not authenticated
 * 
 * USAGE:
 * ```typescript
 * const businessId = await requireBusinessId();
 * const leads = await db.leads.findByBusinessId(businessId);
 * ```
 * 
 * @returns Business ID
 * @throws Error if not authenticated
 */
export async function requireBusinessId(): Promise<string> {
  const businessId = await getBusinessId();
  if (!businessId) {
    throw new Error('Unauthorized - business context required');
  }
  return businessId;
}

/**
 * Check if current user has a specific role
 * 
 * @param allowedRoles Array of roles that are allowed
 * @returns True if user has one of the allowed roles
 */
export async function hasRole(allowedRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Require specific role - throws if user doesn't have it
 * 
 * USAGE:
 * ```typescript
 * await requireRole(['OWNER', 'ADMIN']);
 * // Now you know user has OWNER or ADMIN role
 * ```
 * 
 * @param allowedRoles Array of roles that are allowed
 * @throws Error if user doesn't have required role
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<void> {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized - requires one of: ${allowedRoles.join(', ')}`);
  }
}

/**
 * Check if current user can access a specific resource
 * 
 * SECURITY: This validates that resource belongs to user's business
 * 
 * @param resourceBusinessId Business ID that owns the resource
 * @returns Permission check result
 */
export async function canAccessResource(resourceBusinessId: string): Promise<PermissionCheck> {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      allowed: false,
      reason: 'Not authenticated',
    };
  }

  if (user.businessId !== resourceBusinessId) {
    return {
      allowed: false,
      reason: 'Resource belongs to different business',
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Validate business ownership and throw if invalid
 * 
 * SECURITY: Use this before returning any data to client
 * 
 * @param resourceBusinessId Business ID that owns the resource
 * @throws Error if user cannot access resource
 */
export async function requireBusinessOwnership(resourceBusinessId: string): Promise<void> {
  const check = await canAccessResource(resourceBusinessId);
  if (!check.allowed) {
    throw new Error(`Unauthorized - ${check.reason}`);
  }
}

/**
 * Check if user can perform an action based on role
 * 
 * ROLE PERMISSIONS:
 * - OWNER: Full access to everything including billing
 * - ADMIN: Full operational access (leads, settings, users)
 * - MEMBER: Read/write leads and conversations
 * - VIEWER: Read-only access
 */
export async function canPerformAction(action: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Define permission matrix
  const permissions: Record<UserRole, string[]> = {
    OWNER: ['*'], // All actions
    ADMIN: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
    MEMBER: ['read', 'write', 'create_lead', 'update_lead'],
    VIEWER: ['read'],
  };

  const userPermissions = permissions[user.role];
  
  // OWNER has all permissions
  if (userPermissions.includes('*')) return true;
  
  // Check if user has specific permission
  return userPermissions.includes(action);
}

/**
 * Get business details for current user
 * 
 * @returns Business object or null if not authenticated
 */
export async function getCurrentBusiness() {
  const businessId = await getBusinessId();
  if (!businessId) return null;
  
  return await db.businesses.findById(businessId);
}
