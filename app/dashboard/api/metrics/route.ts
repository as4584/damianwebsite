/**
 * Metrics API Route
 * GET /dashboard/api/metrics - Get dashboard metrics
 * 
 * SECURITY:
 * - Validates session exists (middleware enforces this)
 * - Extracts businessId from session
 * - All queries scoped by businessId
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics, getLeadCounts } from '../../services/leadService';
import { requireBusinessId } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Get businessId from authenticated session
    const businessId = await requireBusinessId();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'counts') {
      const result = await getLeadCounts(businessId);
      return NextResponse.json(result);
    }
    
    const result = await getDashboardMetrics(businessId);
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
