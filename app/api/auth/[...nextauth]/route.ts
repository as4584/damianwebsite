/**
 * Auth.js Route Handler
 * 
 * This is the API endpoint that handles all authentication requests
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/csrf
 * - /api/auth/providers
 * 
 * SECURITY: This uses NextAuth's built-in handlers which include:
 * - CSRF protection
 * - Secure cookie management
 * - Rate limiting (when configured)
 */

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const handler = NextAuth(authConfig);

// Export handlers for Next.js API routes
export { handler as GET, handler as POST };
