/**
 * Auth.js Configuration
 * 
 * ARCHITECTURE DECISION: We use JWT session strategy for scalability
 * 
 * WHY JWT?
 * - Stateless: No database lookup on every request
 * - Scalable: Works across multiple servers/regions
 * - Mobile-friendly: Token can be sent to native apps
 * - Fast: No database round-trip for session validation
 * 
 * TRADE-OFFS:
 * - Cannot instantly revoke sessions (must wait for expiry)
 * - Token size is larger than session ID
 * - Sensitive data must not be in JWT (we only store user ID, email, businessId, role)
 * 
 * ALTERNATIVE (Database sessions):
 * - Use if you need instant session revocation
 * - Use if you need to track active sessions
 * - Requires database round-trip on every request
 * - See NextAuth docs for database session configuration
 */

import type { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '../db/mock-db';
import { verifyPassword, validateEmail, validatePassword } from './password';
import type { SessionUser } from '../types/auth';

/**
 * Session token lifetime
 * After this expires, user must login again
 */
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Auth.js configuration
 * This is the core of our authentication system
 */
export const authConfig: AuthOptions = {
  /**
   * Session strategy: JWT
   * 
   * SECURITY: JWT is signed with secret, cannot be tampered with
   * JWT is stored in HTTP-only secure cookie
   */
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },

  /**
   * Authentication providers
   * Currently: Credentials (email + password)
   * 
   * FUTURE: Add OAuth providers (Google, GitHub, Microsoft)
   */
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Authorize function - validates credentials and returns user
       * 
       * SECURITY: This is where we:
       * 1. Validate input
       * 2. Look up user by email
       * 3. Verify password against hash
       * 4. Return user data for session
       * 
       * @param credentials Email and password from login form
       * @returns User object if valid, null if invalid
       */
      async authorize(credentials) {
        try {
          // Extract and validate credentials
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            return null;
          }

          // Validate format (prevents injection)
          validateEmail(email);
          validatePassword(password);

          // Look up user in database
          const user = await db.users.findByEmail(email);
          if (!user) {
            // User not found
            // SECURITY: Don't reveal whether email exists
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          // Verify password against stored hash
          const isValid = await verifyPassword(password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          // Update last login timestamp (async, don't await)
          db.users.updateLastLogin(user.id).catch(console.error);

          // Return user data for session
          // SECURITY: Never include passwordHash in return value
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            businessId: user.businessId,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  /**
   * Callbacks - customize session and JWT behavior
   */
  callbacks: {
    /**
     * JWT callback - runs when JWT is created or updated
     * 
     * SECURITY: This is where we add custom claims to JWT
     * Only add non-sensitive data that's needed for authorization
     * 
     * @param token JWT token object
     * @param user User object (only present on signin)
     * @returns Modified token with custom claims
     */
    async jwt({ token, user }) {
      // On signin, user object is provided by authorize()
      if (user) {
        // Add custom claims to JWT
        token.id = user.id;
        token.businessId = (user as SessionUser).businessId;
        token.role = (user as SessionUser).role;
      }
      return token;
    },

    /**
     * Session callback - runs when session is accessed via getServerSession()
     * 
     * SECURITY: This shapes what's available in session object
     * This is what your app sees when checking authentication
     * 
     * @param session Session object
     * @param token JWT token with custom claims
     * @returns Modified session with user data
     */
    async session({ session, token }) {
      if (session.user) {
        // Add custom claims from JWT to session
        session.user.id = token.id as string;
        session.user.businessId = token.businessId as string;
        session.user.role = token.role as any; // JWT token.role is already UserRole from jwt callback
      }
      return session;
    },

    /**
     * Redirect callback - controls navigation after sign in/out
     * 
     * CRITICAL: This fixes the issue where login succeeds but redirects to "/" instead of "/dashboard"
     * 
     * @param url URL to redirect to
     * @param baseUrl Base URL of the application
     * @returns URL to redirect to
     */
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect to dashboard
      // This handles the case where signIn() is called with redirect: false
      // and the client-side router.push('/dashboard') is racing with NextAuth redirect
      if (url === baseUrl || url === `${baseUrl}/` || url.startsWith(`${baseUrl}/api/auth`)) {
        return `${baseUrl}/dashboard`;
      }
      
      // If a callbackUrl was provided (e.g., from middleware), use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // External URLs - redirect to base URL for security
      return baseUrl;
    },
  },

  /**
   * Pages - custom auth pages
   */
  pages: {
    signIn: '/login',
    error: '/login',
    // signOut: '/logout', // Custom signout page if needed
  },

  /**
   * Security options
   */
  secret: process.env.NEXTAUTH_SECRET || 'REPLACE_THIS_WITH_SECURE_SECRET_IN_PRODUCTION',
  
  /**
   * Cookie configuration
   * 
   * SECURITY:
   * - httpOnly: Cookie cannot be accessed by JavaScript (XSS protection)
   * - secure: Cookie only sent over HTTPS in production
   * - sameSite: CSRF protection
   */
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      },
    },
  },
};
