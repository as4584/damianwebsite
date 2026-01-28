/**
 * Gatekeeper Logic
 * Determines when to escalate to consultation vs. continue conversation
 */

import { internalKB } from '../kb/internal';
import { SessionData } from './state';

export type EscalationType = 
  | 'LICENSED_PROFESSION'
  | 'MULTI_STATE'
  | 'TAX_QUESTION'
  | 'PARTNERSHIP'
  | 'UNCERTAINTY'
  | 'EXISTING_BUSINESS'
  | 'FUNDING'
  | 'NONPROFIT'
  | 'GENERIC'
  | null;

interface EscalationResult {
  shouldEscalate: boolean;
  escalationType: EscalationType;
  reason?: string;
}

/**
 * Main gatekeeper function
 * Evaluates if the conversation should escalate to consultation
 */
export function evaluateEscalation(
  userInput: string,
  sessionData: SessionData
): EscalationResult {
  const normalized = userInput.toLowerCase().trim();
  
  // Check for licensed profession keywords
  if (containsAny(normalized, internalKB.escalationTriggers.licensedProfessions)) {
    return {
      shouldEscalate: true,
      escalationType: 'LICENSED_PROFESSION',
      reason: 'User mentioned a licensed profession'
    };
  }
  
  // Check for multi-state flags
  if (containsAny(normalized, internalKB.escalationTriggers.multiStateFlags)) {
    return {
      shouldEscalate: true,
      escalationType: 'MULTI_STATE',
      reason: 'User indicated multi-state operations'
    };
  }
  
  // Check for tax structure questions
  if (containsAny(normalized, internalKB.escalationTriggers.taxQuestions)) {
    return {
      shouldEscalate: true,
      escalationType: 'TAX_QUESTION',
      reason: 'User asked about tax structure'
    };
  }
  
  // Check for partnership complexity
  if (containsAny(normalized, internalKB.escalationTriggers.partnershipFlags)) {
    return {
      shouldEscalate: true,
      escalationType: 'PARTNERSHIP',
      reason: 'User indicated partnership or multiple owners'
    };
  }
  
  // Check for uncertainty signals
  if (containsAny(normalized, internalKB.escalationTriggers.uncertaintySignals)) {
    // Only escalate on uncertainty if we've asked a few questions
    if (sessionData.conversationHistory.length > 4) {
      return {
        shouldEscalate: true,
        escalationType: 'UNCERTAINTY',
        reason: 'User expressed uncertainty'
      };
    }
  }
  
  // Check for existing business flags
  if (containsAny(normalized, internalKB.escalationTriggers.existingBusinessFlags)) {
    return {
      shouldEscalate: true,
      escalationType: 'EXISTING_BUSINESS',
      reason: 'User mentioned existing or acquired business'
    };
  }
  
  // Check for funding/investor flags
  if (containsAny(normalized, internalKB.escalationTriggers.fundingFlags)) {
    return {
      shouldEscalate: true,
      escalationType: 'FUNDING',
      reason: 'User mentioned investors or funding'
    };
  }
  
  // Check for nonprofit complexity
  if (containsAny(normalized, internalKB.escalationTriggers.nonprofitFlags)) {
    return {
      shouldEscalate: true,
      escalationType: 'NONPROFIT',
      reason: 'User indicated nonprofit formation'
    };
  }
  
  // Check session data for escalation triggers
  if (sessionData.hasPartners === true) {
    return {
      shouldEscalate: true,
      escalationType: 'PARTNERSHIP',
      reason: 'Partnership structure requires consultation'
    };
  }
  
  if (sessionData.multiState === true) {
    return {
      shouldEscalate: true,
      escalationType: 'MULTI_STATE',
      reason: 'Multi-state operations require consultation'
    };
  }
  
  // No escalation needed
  return {
    shouldEscalate: false,
    escalationType: null
  };
}

/**
 * Get escalation message based on escalation type
 */
export function getEscalationMessage(escalationType: EscalationType): {
  acknowledge: string;
  explain: string;
  cta: string;
} {
  const routing = internalKB.escalationRouting;
  
  switch (escalationType) {
    case 'LICENSED_PROFESSION':
      return routing.licensedProfession;
    case 'MULTI_STATE':
      return routing.multiState;
    case 'TAX_QUESTION':
      return routing.taxStructure;
    case 'PARTNERSHIP':
      return routing.partnership;
    case 'UNCERTAINTY':
      return routing.uncertainty;
    case 'EXISTING_BUSINESS':
      return routing.existingBusiness;
    case 'FUNDING':
      return routing.funding;
    case 'NONPROFIT':
      return routing.generic; // Use generic for nonprofit (we can provide some info first)
    case 'GENERIC':
    default:
      return routing.generic;
  }
}

/**
 * Check if we should auto-escalate based on conversation progress
 */
export function shouldAutoEscalate(sessionData: SessionData): boolean {
  // After collecting enough information, naturally transition to consultation
  const hasBusinessType = !!sessionData.businessType;
  const hasLocation = !!sessionData.location;
  const hasOwnership = sessionData.hasPartners !== undefined;
  const hasLicensing = !!sessionData.licensing;
  
  // If we have most of the basic info, it's time for consultation
  const infoCount = [hasBusinessType, hasLocation, hasOwnership, hasLicensing].filter(Boolean).length;
  
  return infoCount >= 3;
}

/**
 * Helper function to check if text contains any of the trigger words/phrases
 */
function containsAny(text: string, triggers: readonly string[]): boolean {
  return triggers.some(trigger => text.includes(trigger.toLowerCase()));
}

/**
 * Validate that response is appropriate (not providing restricted advice)
 */
export function validateResponse(response: string): {
  isValid: boolean;
  reason?: string;
} {
  const normalized = response.toLowerCase();
  
  // Check for prohibited advice patterns
  const prohibited = [
    'you should choose',
    'you should form',
    'the best option is',
    'i recommend',
    'you need to',
    'you must',
    'file as an s-corp',
    'elect s-corp',
    'this will save you',
    'for tax purposes'
  ];
  
  for (const phrase of prohibited) {
    if (normalized.includes(phrase)) {
      return {
        isValid: false,
        reason: `Response contains prohibited advice: "${phrase}"`
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Check if question is answerable from public KB only
 */
export function isAnswerableFromPublicKB(input: string): boolean {
  const normalized = input.toLowerCase();
  
  // General informational questions are OK
  const safePatterns = [
    'what is',
    'what do you do',
    'how long',
    'what services',
    'do you provide',
    'tell me about',
    'explain'
  ];
  
  // Questions requiring consultation
  const unsafePatterns = [
    'which should i',
    'which is better',
    'should i choose',
    'what do you recommend',
    'in my state',
    'for my business',
    'best for me'
  ];
  
  // Check for safe patterns
  const hasSafePattern = safePatterns.some(pattern => normalized.includes(pattern));
  
  // Check for unsafe patterns
  const hasUnsafePattern = unsafePatterns.some(pattern => normalized.includes(pattern));
  
  // Answerable if it has safe patterns and no unsafe patterns
  return hasSafePattern && !hasUnsafePattern;
}
