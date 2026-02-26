/**
 * NextAuth Type Declarations
 * Extends default types to include custom session data
 */

import 'next-auth';
import { UserRole } from '@/lib/types/auth';

declare module 'next-auth' {
  /**
   * Extended session to include businessId and role
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      businessId: string;
      role: UserRole;
    };
  }

  /**
   * Extended user object returned from authorize()
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
    businessId: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT token to include businessId and role
   */
  interface JWT {
    id: string;
    businessId: string;
    role: UserRole;
  }
}
