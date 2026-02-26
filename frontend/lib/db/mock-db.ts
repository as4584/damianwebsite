/**
 * In-Memory Data Store (Development)
 * 
 * PRODUCTION NOTE: This is a mock database for development.
 * In production, replace with:
 * - PostgreSQL via Prisma
 * - MongoDB via Mongoose
 * - Supabase
 * - Firebase
 * 
 * The interface is designed to match what a real database adapter would provide.
 */

import { User, Business } from '../types/auth';

/**
 * In-memory storage
 * SECURITY: In production, this would be actual database tables
 */
const users: Map<string, User> = new Map();
const businesses: Map<string, Business> = new Map();

// Seed initial business for development
const defaultBusiness: Business = {
  id: 'biz_innovation_001',
  name: 'Innovation Development Solutions',
  domain: 'innovationdevelopmentsolutions.com',
  subdomain: 'dashboard',
  createdAt: new Date(),
  settings: {
    allowSignups: true,
    maxUsers: 10,
    features: ['leads', 'analytics', 'chatbot'],
  },
};

businesses.set(defaultBusiness.id, defaultBusiness);

// Seed test users for E2E testing
// These are created synchronously so they're available immediately

// Test User 1: King1000$ password (pre-hashed with bcryptjs)
const testUser: User = {
  id: 'user_test_001',
  email: 'test@innovation.com',
  passwordHash: '$2b$10$7aMkJH5cf.oODTKPIVhiw.j0dBtBeU5HKLFU5DIpnFnqQVTWHoesq', // King1000$
  name: 'Test User',
  businessId: defaultBusiness.id,
  role: 'OWNER',
  createdAt: new Date(),
  isActive: true,
};
users.set(testUser.id, testUser);

// Test User 2: demo1234 password (pre-hashed with bcryptjs)
const demoUser: User = {
  id: 'user_demo_001',
  email: 'demo@innovationdevelopmentsolutions.com',
  passwordHash: '$2b$10$HLsZrYVpKoGXmbKcd1Sype4tQ7M/BlzvmN7sYr7lxij9IZmSqpwV2', // demo1234
  name: 'Demo User',
  businessId: defaultBusiness.id,
  role: 'OWNER',
  createdAt: new Date(),
  isActive: true,
};
users.set(demoUser.id, demoUser);

console.log('✅ Test users seeded:');
console.log('   - test@innovation.com / King1000$');
console.log('   - demo@innovationdevelopmentsolutions.com / demo1234');

/**
 * Database adapter interface
 * This structure makes it easy to swap in a real database
 */
export const db = {
  /**
   * User operations
   */
  users: {
    /**
     * Find user by email
     * SECURITY: This is used during login to fetch password hash
     * 
     * @param email User's email address
     * @returns User object or null if not found
     */
    findByEmail: async (email: string): Promise<User | null> => {
      const user = Array.from(users.values()).find(u => u.email === email);
      return user || null;
    },

    /**
     * Find user by ID
     * 
     * @param id User ID
     * @returns User object or null if not found
     */
    findById: async (id: string): Promise<User | null> => {
      return users.get(id) || null;
    },

    /**
     * Create new user
     * SECURITY: Password must already be hashed before calling this
     * 
     * @param data User data including passwordHash
     * @returns Created user
     */
    create: async (data: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<User> => {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user: User = {
        ...data,
        id,
        createdAt: new Date(),
        isActive: true,
      };
      users.set(id, user);
      return user;
    },

    /**
     * Update user's last login timestamp
     * 
     * @param id User ID
     */
    updateLastLogin: async (id: string): Promise<void> => {
      const user = users.get(id);
      if (user) {
        user.lastLoginAt = new Date();
        users.set(id, user);
      }
    },

    /**
     * Find all users in a business
     * SECURITY: Always scoped by businessId
     * 
     * @param businessId Business ID to filter by
     * @returns Array of users in that business
     */
    findByBusinessId: async (businessId: string): Promise<User[]> => {
      return Array.from(users.values()).filter(u => u.businessId === businessId);
    },
  },

  /**
   * Business operations
   */
  businesses: {
    /**
     * Find business by ID
     * 
     * @param id Business ID
     * @returns Business object or null if not found
     */
    findById: async (id: string): Promise<Business | null> => {
      return businesses.get(id) || null;
    },

    /**
     * Find business by subdomain
     * Used during subdomain routing to validate access
     * 
     * @param subdomain Subdomain (e.g., "dashboard")
     * @returns Business object or null if not found
     */
    findBySubdomain: async (subdomain: string): Promise<Business | null> => {
      const business = Array.from(businesses.values()).find(b => b.subdomain === subdomain);
      return business || null;
    },

    /**
     * Create new business
     * Used during signup when provisioning a new organization
     * 
     * @param data Business data
     * @returns Created business
     */
    create: async (data: Omit<Business, 'id' | 'createdAt'>): Promise<Business> => {
      const id = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const business: Business = {
        ...data,
        id,
        createdAt: new Date(),
      };
      businesses.set(id, business);
      return business;
    },
  },
};

/**
 * Utility: Get default business for development
 * In production, users would be directed to the correct business based on subdomain
 */
export const getDefaultBusiness = (): Business => {
  return defaultBusiness;
};
