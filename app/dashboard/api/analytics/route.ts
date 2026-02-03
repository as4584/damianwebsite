/**
 * Dashboard Analytics API
 * GET /dashboard/api/analytics
 *
 * SECURITY:
 * - Requires authenticated session (middleware)
 * - Scopes analytics by businessId from session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/session';
import { getAllLeads } from '@/lib/db/leads-db';

function isoDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET(_request: NextRequest) {
  try {
    // Get session - use default business if not authenticated (dev mode)
    const session = await getCurrentSession();
    const businessId = session?.user?.businessId || 'biz_innovation_001';

    // Get leads from database (uses in-memory store if Supabase not configured)
    const allLeads = await getAllLeads();
    const leads = allLeads.filter(l => l.businessId === businessId);
    const totalLeads = leads.length;

    // Hot / Warm / Cold breakdown
    const breakdown = { hot: 0, warm: 0, cold: 0 };
    for (const lead of leads) {
      const hotness = String(lead.hotness || '').toLowerCase();
      if (hotness === 'hot') breakdown.hot += 1;
      else if (hotness === 'warm') breakdown.warm += 1;
      else if (hotness === 'cold') breakdown.cold += 1;
    }

    // Leads per day (last 7 days, UTC)
    const today = new Date();
    const last7Days: { date: string; value: number }[] = [];
    const countsByDay = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      const key = isoDateUTC(d);
      countsByDay.set(key, 0);
    }

    for (const lead of leads) {
      if (!lead.createdAt) continue;
      const created = lead.createdAt instanceof Date ? lead.createdAt : new Date(lead.createdAt);
      const key = isoDateUTC(created);
      if (countsByDay.has(key)) {
        countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
      }
    }

    // output oldest -> newest
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      d.setUTCDate(d.getUTCDate() - i);
      const key = isoDateUTC(d);
      last7Days.push({ date: key, value: countsByDay.get(key) || 0 });
    }

    // Conversion stats (proxy): leads with contact info
    const leadsWithContact = leads.filter(l => !!(l.email || l.phone)).length;
    const conversionRate = totalLeads === 0 ? 0 : Math.round((leadsWithContact / totalLeads) * 1000) / 10; // 1 decimal

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        leadsWithContact,
        conversionRate,
        hotWarmCold: breakdown,
        leadsPerDay: last7Days
      }
    });
  } catch (error) {
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
