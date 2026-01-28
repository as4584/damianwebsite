/**
 * Signup API Route
 * 
 * POST /api/auth/signup
 * 
 * SECURITY:
 * - Validates all input
 * - Hashes password before storage
 * - Never stores plaintext passwords
 * - Returns generic errors (doesn't leak whether email exists)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, getDefaultBusiness } from '@/lib/db/mock-db';
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth/password';
import type { SignupRequest } from '@/lib/types/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SignupRequest = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    try {
      validateEmail(email);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 }
      );
    }

    // Validate password requirements
    try {
      validatePassword(password);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      // SECURITY: Don't reveal that email exists
      // Return generic error to prevent email enumeration
      return NextResponse.json(
        { success: false, error: 'Unable to create account. Please try again or contact support.' },
        { status: 400 }
      );
    }

    // Hash password
    // SECURITY: This is expensive by design (bcrypt cost factor)
    const passwordHash = await hashPassword(password);

    // Get business context
    // In production, this would be determined by:
    // - Subdomain the user is signing up from
    // - Invitation token
    // - New business creation flow
    const business = getDefaultBusiness();

    // Create user
    const user = await db.users.create({
      email: email.toLowerCase(), // Normalize email
      passwordHash, // Only hash is stored
      name,
      businessId: business.id,
      role: 'MEMBER', // Default role for new signups
    });

    // SECURITY: Never return password hash to client
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please log in.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // SECURITY: Don't leak internal errors to client
    return NextResponse.json(
      { success: false, error: 'An error occurred during signup. Please try again.' },
      { status: 500 }
    );
  }
}
