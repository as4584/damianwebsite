/**
 * Password Security Utilities
 * 
 * SECURITY PRINCIPLES:
 * 1. Never store plaintext passwords
 * 2. Use strong hashing algorithm (bcrypt with 12 rounds)
 * 3. Hash comparison is constant-time to prevent timing attacks
 * 4. This module runs server-side ONLY
 */

import bcrypt from 'bcryptjs';

/**
 * Bcrypt cost factor (number of rounds)
 * 
 * SECURITY: Higher = more secure but slower
 * - 10: Fast, suitable for high-traffic (100ms)
 * - 12: Recommended for production (250ms)
 * - 14: Very secure but slow (1000ms)
 * 
 * We use 12 as the industry standard for SaaS applications
 */
const SALT_ROUNDS = 12;

/**
 * Password validation rules
 */
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Hash a plaintext password
 * 
 * SECURITY: This is expensive by design (bcrypt cost factor)
 * The delay prevents brute force attacks
 * 
 * @param password Plaintext password from user input
 * @returns Hashed password safe for database storage
 * @throws Error if password doesn't meet requirements
 */
export async function hashPassword(password: string): Promise<string> {
  // Validate password before hashing
  validatePassword(password);
  
  // Generate salt and hash in one step
  // bcrypt automatically includes salt in the output
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  
  return hash;
}

/**
 * Verify password against stored hash
 * 
 * SECURITY: Uses constant-time comparison to prevent timing attacks
 * An attacker cannot determine if they're close to the correct password
 * 
 * @param password Plaintext password from login attempt
 * @param hash Stored password hash from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // bcrypt.compare is constant-time
    return await bcrypt.compare(password, hash);
  } catch (error) {
    // If comparison fails (corrupted hash), return false
    // Don't leak information about why it failed
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Validate password meets security requirements
 * 
 * REQUIREMENTS:
 * - Minimum length: 8 characters
 * - Maximum length: 128 characters (prevent DOS via large inputs)
 * - Must not be empty
 * 
 * FUTURE: Add complexity requirements (uppercase, numbers, symbols)
 * 
 * @param password Password to validate
 * @throws Error with user-friendly message if invalid
 */
export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    throw new Error(`Password must be no more than ${PASSWORD_MAX_LENGTH} characters`);
  }

  // FUTURE: Add complexity checks
  // Example:
  // if (!/[A-Z]/.test(password)) {
  //   throw new Error('Password must contain at least one uppercase letter');
  // }
}

/**
 * Validate email format
 * 
 * SECURITY: Basic validation to prevent injection
 * Real validation happens when user confirms email
 * 
 * @param email Email address to validate
 * @throws Error if email is invalid
 */
export function validateEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }

  // Basic email regex - not perfect but good enough
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Prevent excessively long emails (DOS protection)
  if (email.length > 254) {
    throw new Error('Email is too long');
  }
}

/**
 * Generate secure random token
 * Used for password reset, email verification, etc.
 * 
 * @param length Token length in bytes (will be hex encoded, so output is 2x)
 * @returns Cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  // Use Node.js crypto for cryptographically secure random bytes
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}
