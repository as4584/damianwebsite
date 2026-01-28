/**
 * Metrics API Route
 * GET /dashboard/api/metrics - Get dashboard metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics, getLeadCounts } from '../../../services/leadService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'counts') {
      const result = await getLeadCounts();
      return NextResponse.json(result);
    }
    
    const result = await getDashboardMetrics();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
