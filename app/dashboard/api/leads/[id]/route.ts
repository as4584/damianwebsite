/**
 * Single Lead API Route
 * GET /dashboard/api/leads/[id] - Get single lead
 * PATCH /dashboard/api/leads/[id] - Update lead
 * 
 * SECURITY:
 * - Validates session exists (middleware enforces this)
 * - Extracts businessId from session
 * - Validates ownership before returning or updating data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLeadById, updateLead } from '../../../services/leadService';
import { requireBusinessId } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // SECURITY: Get businessId from authenticated session
    const businessId = await requireBusinessId();
    
    // SECURITY: Service validates ownership before returning data
    const result = await getLeadById(id, businessId);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // SECURITY: Get businessId from authenticated session
    const businessId = await requireBusinessId();
    
    const body = await request.json();
    
    // SECURITY: Service validates ownership before allowing update
    const result = await updateLead(id, businessId, body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
