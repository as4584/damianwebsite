/**
 * Leads API Route
 * GET /dashboard/api/leads - List all leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLeads, getLeadPreviews } from '../../services/leadService';
import { LeadHotness } from '../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const view = searchParams.get('view'); // 'full' or 'preview'
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') as 'createdAt' | 'hotness' | null;
    const filter = searchParams.get('filter') as 'all' | LeadHotness | null;
    
    if (view === 'preview') {
      const result = await getLeadPreviews();
      return NextResponse.json(result);
    }
    
    const result = await getLeads({
      page,
      limit,
      sortBy: sortBy || 'createdAt',
      filter: filter || 'all'
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
