/**
 * Leads API Route
 * GET /dashboard/api/leads - List all leads
 * 
 * SECURITY:
 * - Validates session exists (middleware enforces this)
 * - Extracts businessId from session
 * - All queries scoped by businessId
 * - Never trusts client input for business ownership
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLeads, getLeadPreviews } from '../../services/leadService';
import { LeadHotness } from '../../types';
import { requireBusinessId } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Get businessId from authenticated session
    // This enforces data isolation - user can only see their business's leads
    const businessId = await requireBusinessId();
    
    const { searchParams } = new URL(request.url);
    
    const view = searchParams.get('view'); // 'full' or 'preview'
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') as 'createdAt' | 'hotness' | null;
    const filter = searchParams.get('filter') as 'all' | LeadHotness | null;
    
    // SECURITY: Pass businessId to service layer
    // Service will filter all database queries by this businessId
    if (view === 'preview') {
      const result = await getLeadPreviews(businessId);
      return NextResponse.json(result);
    }
    
    const result = await getLeads(businessId, {
      page,
      limit,
      sortBy: sortBy || 'createdAt',
      filter: filter || 'all'
    });
    
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
