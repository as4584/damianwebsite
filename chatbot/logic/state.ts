/**
 * Conversation State Machine
 * Manages progression through conversation states
 */

import { IntakeModeState, initializeIntakeMode } from './intakeMode';

export type ConversationState =
  | 'WELCOME'
  | 'INTENT_DETECTION'
  | 'BUSINESS_TYPE'
  | 'ALREADY_OPERATING'
  | 'HAS_PARTNERS'
  | 'LOCATION'
  | 'MULTI_STATE'
  | 'LICENSING'
  | 'MISSION_DRIVEN'
  | 'SUMMARY'
  | 'LEAD_CAPTURE_NAME'
  | 'LEAD_CAPTURE_EMAIL'
  | 'LEAD_CAPTURE_PHONE'
  | 'CONFIRMATION'
  | 'ESCALATION'
  | 'INFO_PROVIDED'
  | 'CLOSED'
  | 'INTAKE_TRANSITION'  // New: Golden Frame 61
  | 'INTAKE_COLLECTION'; // New: Golden Frame 62

/**
 * Chat Mode - HARD separation between diagnostic and intake
 * DIAGNOSTIC: GPT-driven clarifying questions (default)
 * INTAKE: Golden Frames-driven data collection (explicit consent required)
 */
export type ChatMode = 'DIAGNOSTIC' | 'INTAKE';

/**
 * Task Phase - Strict monotonic progression, no regression
 * ORIENT: One-line intro (runs once, never repeats)
 * DISCOVERY: GPT diagnostic (max 3 questions, then force INTAKE)
 * INTAKE: Deterministic consultation questions (no GPT)
 * SCHEDULING: Time slot selection within business hours
 * CONFIRMED: Task complete, input locked, no further execution
 */
export type TaskPhase = 'ORIENT' | 'DISCOVERY' | 'INTAKE' | 'SCHEDULING' | 'CONFIRMED' | 'BUSINESS_INTAKE';

export type IntakeStep =
  | 'FULL_LEGAL_NAME'
  | 'PREFERRED_NAME'
  | 'EMAIL'
  | 'PHONE'
  | 'BUSINESS_NAME_CHECK'
  | 'BUSINESS_NAME_OPTIONS'
  | 'BUSINESS_TYPE'
  | 'EIN_STATUS'
  | 'READINESS'
  | 'COMPLETED';

export interface BusinessIntakeData {
  fullLegalName?: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  hasBusinessName?: boolean;
  businessNameOptions?: string[];
  businessType?: string;
  hasEIN?: 'Yes' | 'No' | 'Not sure';
  readiness?: 'Yes' | 'No' | 'Just exploring';
}

export interface SessionData {
  // CRITICAL: New intake flow data
  businessIntake?: {
    step: IntakeStep;
    data: BusinessIntakeData;
    lastQuestionAsked?: string;
  };

  // CRITICAL: Chat mode controls frame execution
  // DIAGNOSTIC (default) = GPT asks questions, NO frames fire
  // INTAKE = Golden Frames execute, formal data collection
  mode?: ChatMode;
  
  // CRITICAL: Task phase controls conversation lifecycle
  // CONFIRMED phase blocks ALL further execution
  phase?: TaskPhase;
  
  // Discovery turn counter (max 3 before forcing INTAKE)
  discoveryTurns?: number;
  
  // ORIENT flag (ensures one-time execution)
  orientCompleted?: boolean;
  
  // Consultation data (collected during INTAKE phase)
  consultation?: {
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    businessType?: string;
    businessGoal?: string;
    preferredDate?: string;  // ISO date string
    preferredTime?: string;  // HH:MM format
    scheduledSlot?: string;  // Full ISO timestamp
    confirmedAt?: number;    // Unix timestamp
  };
  
  // User information
  name?: string;
  email?: string;
  phone?: string;
  
  // Business details
  businessType?: string;
  isOperating?: boolean;
  hasPartners?: boolean;
  location?: string;
  multiState?: boolean;
  licensing?: string;
  missionDriven?: string;
  
  // Metadata
  intent?: string;
  escalationReason?: string;
  conversationHistory: Array<{
    role: 'user' | 'bot';
    message: string;
    timestamp: number;
  }>;
  
  // Session control
  bootstrapCompleted?: boolean; // Golden Frame 00 executed
  
  // Intake Mode State
  intakeMode?: IntakeModeState;
}

export interface ConversationStateData {
  currentState: ConversationState;
  sessionData: SessionData;
}

/**
 * Initialize new conversation state
 */
export function initializeState(): ConversationStateData {
  return {
    currentState: 'WELCOME',
    sessionData: {
      conversationHistory: [],
      intakeMode: initializeIntakeMode(),
      bootstrapCompleted: false
    }
  };
}

/**
 * Get next state based on current state and user input
 */
export function getNextState(
  currentState: ConversationState,
  sessionData: SessionData,
  shouldEscalate: boolean
): ConversationState {
  // If escalation is triggered, go to escalation
  if (shouldEscalate) {
    return 'ESCALATION';
  }
  
  // State progression logic
  switch (currentState) {
    case 'WELCOME':
      return 'INTENT_DETECTION';
      
    case 'INTENT_DETECTION':
      // Based on intent, determine next step
      if (sessionData.intent === 'CONSULTATION') {
        return 'SUMMARY';
      }
      if (sessionData.intent === 'PRICING' || sessionData.intent === 'ENTITY_HELP' || sessionData.intent === 'NOT_SURE') {
        return 'BUSINESS_TYPE';
      }
      if (sessionData.intent === 'GENERAL_INFO' || sessionData.intent === 'TIMELINE' || sessionData.intent === 'SERVICES') {
        return 'INFO_PROVIDED';
      }
      return 'BUSINESS_TYPE';
      
    case 'BUSINESS_TYPE':
      return 'ALREADY_OPERATING';
      
    case 'ALREADY_OPERATING':
      return 'HAS_PARTNERS';
      
    case 'HAS_PARTNERS':
      return 'LOCATION';
      
    case 'LOCATION':
      return 'MULTI_STATE';
      
    case 'MULTI_STATE':
      return 'LICENSING';
      
    case 'LICENSING':
      return 'MISSION_DRIVEN';
      
    case 'MISSION_DRIVEN':
      return 'SUMMARY';
      
    case 'SUMMARY':
      return 'LEAD_CAPTURE_NAME';
      
    case 'LEAD_CAPTURE_NAME':
      return 'LEAD_CAPTURE_EMAIL';
      
    case 'LEAD_CAPTURE_EMAIL':
      return 'LEAD_CAPTURE_PHONE';
      
    case 'LEAD_CAPTURE_PHONE':
      return 'CONFIRMATION';
      
    case 'ESCALATION':
      // After escalation explanation, go to lead capture
      return 'LEAD_CAPTURE_NAME';
      
    case 'INFO_PROVIDED':
      // After providing info, ask if they want to proceed
      return 'INTENT_DETECTION';
      
    case 'CONFIRMATION':
      return 'CLOSED';
      
    case 'CLOSED':
      return 'CLOSED';
      
    default:
      return currentState;
  }
}

/**
 * Check if we have enough data to skip certain questions
 */
export function shouldSkipQuestion(
  state: ConversationState,
  sessionData: SessionData
): boolean {
  switch (state) {
    case 'BUSINESS_TYPE':
      return !!sessionData.businessType;
    case 'LOCATION':
      return !!sessionData.location;
    case 'HAS_PARTNERS':
      return sessionData.hasPartners !== undefined;
    default:
      return false;
  }
}

/**
 * Check if we have minimum required data for escalation
 */
export function hasMinimumDataForEscalation(sessionData: SessionData): boolean {
  return !!(sessionData.businessType || sessionData.location);
}

/**
 * Check if lead capture is complete
 */
export function isLeadCaptureComplete(sessionData: SessionData): boolean {
  return !!(sessionData.name && sessionData.email);
}

/**
 * Save user message to conversation history
 */
export function saveUserMessage(
  sessionData: SessionData,
  message: string
): SessionData {
  return {
    ...sessionData,
    conversationHistory: [
      ...sessionData.conversationHistory,
      {
        role: 'user',
        message,
        timestamp: Date.now()
      }
    ]
  };
}

/**
 * Save bot message to conversation history
 */
export function saveBotMessage(
  sessionData: SessionData,
  message: string
): SessionData {
  return {
    ...sessionData,
    conversationHistory: [
      ...sessionData.conversationHistory,
      {
        role: 'bot',
        message,
        timestamp: Date.now()
      }
    ]
  };
}
