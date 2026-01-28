/**
 * Chat API Route
 * Handles chat interactions via POST /api/chat
 * WITH Golden Frame support AND GPT-4o-mini Intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { routeConversationEnhanced, getWelcomeMessageEnhanced } from '../../../chatbot/logic/routerEnhanced';
import { initializeIntelligentRouter } from '../../../chatbot/logic/intelligentRouter';
import { ConversationState, SessionData } from '../../../chatbot/logic/state';

export const runtime = 'edge'; // Use edge runtime for better performance

// GPT initialization flag
let gptInitialized = false;

interface ChatRequest {
  message: string;
  currentState: ConversationState;
  sessionData: SessionData;
}

/**
 * Ensure GPT is initialized (lazy initialization)
 */
function ensureGPTInitialized() {
  if (!gptInitialized) {
    const OPENAI_API_KEY = process.env.OPENAI_KEY || '';
    if (OPENAI_API_KEY) {
      initializeIntelligentRouter(OPENAI_API_KEY);
      console.log('[Chat API] GPT-4o-mini initialized with key');
      gptInitialized = true;
    } else {
      console.warn('[Chat API] OPENAI_KEY not found - intelligence features disabled');
    }
  }
}

export async function POST(request: NextRequest) {
  // Initialize GPT on first request
  ensureGPTInitialized();
  
  try {
    const body: ChatRequest = await request.json();
    
    // Validate request
    if (!body.message && body.currentState !== 'WELCOME') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Handle initial session (Frame 00: Bootstrap)
    if (!body.currentState || body.currentState === 'WELCOME') {
      // Ensure session data is initialized properly
      if (!body.sessionData) {
        const { initializeIntakeMode } = require('../../../chatbot/logic/intakeMode');
        body.sessionData = { 
          conversationHistory: [],
          bootstrapCompleted: false,
          intakeMode: initializeIntakeMode()
        } as SessionData;
      }
      
      // Ensure bootstrapCompleted flag exists
      if (body.sessionData.bootstrapCompleted === undefined) {
        body.sessionData.bootstrapCompleted = false;
      }
      
      // If bootstrap not completed, route through enhanced router (triggers Frame 00)
      if (!body.sessionData.bootstrapCompleted) {
        const response = await routeConversationEnhanced(
          body.message || '',
          body.currentState || 'WELCOME',
          body.sessionData
        );
        
        return NextResponse.json(response);
      }
      
      // Bootstrap already completed, use welcome message
      const welcomeResponse = getWelcomeMessageEnhanced();
      return NextResponse.json(welcomeResponse);
    }
    
    // Route the conversation with Golden Frame support AND intelligent routing
    const response = await routeConversationEnhanced(
      body.message,
      body.currentState,
      body.sessionData
    );
    
    // Log metadata for Shadow AI and Form Stress Test observability
    console.log('Conversation metadata:', {
      mode: response.metadata.mode,
      frame_id: response.metadata.frame_id,
      currentField: response.metadata.currentField,
      fieldStatus: response.metadata.fieldStatus,
      escalation: response.metadata.escalation,
      userConsent: response.metadata.userConsent,
      timestamp: new Date().toISOString()
    });
    
    // Log intake field collection
    if (response.sessionData.intakeMode?.fieldsCollected) {
      console.log('Intake fields collected:', response.sessionData.intakeMode.fieldsCollected);
    }
    
    // Log lead capture for backend processing (in production, save to database)
    if (response.nextState === 'CONFIRMATION' && response.sessionData.email) {
      console.log('Lead captured:', {
        name: response.sessionData.name,
        email: response.sessionData.email,
        phone: response.sessionData.phone,
        businessType: response.sessionData.businessType,
        location: response.sessionData.location,
        hasPartners: response.sessionData.hasPartners,
        multiState: response.sessionData.multiState,
        intakeData: response.sessionData.intakeMode?.fieldsCollected || {},
        timestamp: new Date().toISOString()
      });
      
      // In production, you would:
      // 1. Save to database
      // 2. Send to CRM (HubSpot, Salesforce, etc.)
      // 3. Trigger email notification
      // 4. Add to consultation scheduling system
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    // HARD CONSTRAINT: If Golden Frame execution fails, return clear error
    if ((error as Error).message?.includes('Golden Frame')) {
      return NextResponse.json(
        { 
          error: 'Golden Frame execution failed',
          details: (error as Error).message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
