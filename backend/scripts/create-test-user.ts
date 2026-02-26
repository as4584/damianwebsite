/**
 * Create Test User Script
 * Creates a test user with specific credentials for E2E testing
 */

import { hashPassword } from '../../frontend/lib/auth/password';
import { db } from '../../frontend/lib/db/mock-db';

async function createTestUser() {
  const email = 'test@innovation.com';
  const password = 'King1000$';
  const businessName = 'Innovation Test Business';

  console.log('Creating test user...');
  console.log('Email:', email);
  console.log('Password: King1000$');

  // Hash the password
  const passwordHash = await hashPassword(password);

  // Create business first
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const business = await db.businesses.create({
    name: businessName,
    domain: 'innovation-test.com',
    subdomain: 'test-dashboard',
    settings: {
      allowSignups: true,
      maxUsers: 10,
      features: ['leads', 'analytics', 'chatbot']
    }
  });
  console.log('✅ Created business:', business.name, '(ID:', business.id, ')');

  // Create user
  const user = await db.users.create({
    email,
    passwordHash,
    businessId: business.id,
    role: 'OWNER'
  });
  console.log('✅ Created user:', user.email, '(ID:', user.id, ')');

  console.log('\n🎉 Test user created successfully!');
  console.log('\nLogin credentials:');
  console.log('  Email:', email);
  console.log('  Password: King1000$');
  console.log('  Business ID:', business.id);
}

createTestUser().catch(console.error);
