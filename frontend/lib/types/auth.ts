/**
 * Authentication & Authorization Types
 * 
 * This file defines the data structures for users, businesses, and sessions.
 * All types are designed to be shared between web and future mobile apps.
 */

/**
 * User role within a business
 * - OWNER: Full access, billing, can invite users
 * - ADMIN: Full operational access, cannot manage billing
 * - MEMBER: Read/write access to leads and conversations
 * - VIEWER: Read-only access
 */
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

/**
 * Business entity
 * Represents a customer organization using the platform
 */
export interface Business {
  id: string;
  name: string;
  domain: string; // e.g., "innovationdevelopmentsolutions.com"
  subdomain: string; // e.g., "dashboard"
  createdAt: Date;
  settings?: {
    allowSignups?: boolean;
    maxUsers?: number;
    features?: string[];
  };
}

/**
 * User entity
 * A user belongs to one business and has a role within it
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string; // NEVER expose to client - server-only
  name?: string;
  businessId: string; // Foreign key to Business
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

/**
 * Session data structure
 * This is stored in JWT or database and sent to client in secure HTTP-only cookie
 * 
 * SECURITY: Only include non-sensitive data here
 * Never include password hashes or tokens that could escalate privileges
 */
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  businessId: string; // CRITICAL: Used to scope all queries
  role: UserRole;
}

/**
 * Extended session with business information
 * This is what server components receive from getServerSession()
 */
export interface ExtendedSession {
  user: SessionUser;
  expires: string;
}

/**
 * Signup request payload
 * Used by both web and mobile apps
 */
export interface SignupRequest {
  email: string;
  password: string; // Plaintext - will be hashed server-side
  name?: string;
  businessName?: string; // For new business creation
}

/**
 * Login request payload
 * Used by both web and mobile apps
 */
export interface LoginRequest {
  email: string;
  password: string; // Plaintext - will be compared against hash
}

/**
 * Auth response
 * Returned to client after successful login/signup
 */
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Permission check result
 * Used internally by server-side authorization helpers
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}
