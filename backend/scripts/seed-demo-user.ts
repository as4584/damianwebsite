/**
 * Database Seed Script
 * Creates demo user for development/testing
 * 
 * USAGE:
 * ts-node backend/scripts/seed-demo-user.ts
 * 
 * OR manually seed by running signup:
 * curl -X POST http://localhost:3000/api/auth/signup \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"demo@innovationdevelopmentsolutions.com","password":"demo1234","name":"Demo User"}'
 */

import { db, getDefaultBusiness } from '../../frontend/lib/db/mock-db';
import { hashPassword } from '../../frontend/lib/auth/password';

async function seedDemoUser() {
  console.log('🌱 Seeding demo user...\n');

  const business = getDefaultBusiness();
  console.log(`📊 Business: ${business.name} (${business.id})`);

  // Check if demo user already exists
  const existing = await db.users.findByEmail('demo@innovationdevelopmentsolutions.com');
  if (existing) {
    console.log('✅ Demo user already exists!');
    console.log(`   Email: ${existing.email}`);
    console.log(`   Password: demo1234`);
    console.log(`   Role: ${existing.role}\n`);
    return;
  }

  // Create demo user
  const passwordHash = await hashPassword('demo1234');
  
  const user = await db.users.create({
    email: 'demo@innovationdevelopmentsolutions.com',
    passwordHash,
    name: 'Demo User',
    businessId: business.id,
    role: 'OWNER',
  });

  console.log('✅ Demo user created successfully!\n');
  console.log('📧 Login credentials:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: demo1234`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Business: ${business.name}\n`);
  console.log('🔗 Login at: http://localhost:3000/login\n');
}

// Auto-run when imported or executed
if (require.main === module) {
  seedDemoUser().catch(console.error);
}

export { seedDemoUser };
