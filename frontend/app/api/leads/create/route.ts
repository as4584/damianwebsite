/**
 * Lead Creation API
 * POST /api/leads/create
 * 
 * Called by the chatbot when a user completes the intake flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLeadFromChat, ChatLeadData } from '@/lib/db/leads-db';

export async function POST(request: NextRequest) {
  try {
    const data: ChatLeadData = await request.json();
    
    // Validate required data
    if (!data.email && !data.name) {
      return NextResponse.json(
        { error: 'At least email or name is required' },
        { status: 400 }
      );
    }
    
    // Create the lead
    const lead = await createLeadFromChat(data);
    
    console.log('Lead created via API:', {
      id: lead.id,
      name: lead.fullName,
      email: lead.email,
      hotness: lead.hotness
    });
    
    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        hotness: lead.hotness,
        intent: lead.intent
      }
    });
    
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
