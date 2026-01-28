/**
 * Confidence Scoring System
 * Deterministic scoring based on intent, clarity, and validation
 * NO LLM CALLS - completely free
 */

import { Intent } from './gptService';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number;
  factors: string[];
  recommendation: 'educate' | 'soft_consultation' | 'offer_intake';
}

// Intent weights (higher = clearer intent)
const INTENT_WEIGHTS: Record<Intent, number> = {
  READY_FOR_INTAKE: 4,
  CONSULTATION: 3,
  ENTITY_HELP: 2,
  PRICING: 2,
  TIMELINE: 2,
  SERVICES: 1,
  GENERAL_INFO: 1,
  OFF_TOPIC: 0
};

// Clarity signals (business-specific terms)
const CLARITY_SIGNALS = [
  'llc', 's-corp', 'c-corp', 'corporation', 'entity',
  'register', 'formation', 'start a business', 'form a company',
  'multi-state', 'compliance', 'registered agent',
  'ein', 'tax id', 'operating agreement',
  'ready to start', 'want to form', 'need to register',
  'looking to set up', 'interested in forming'
];

/**
 * Calculate confidence score
 * Score range: 0-10
 * LOW: 0-3, MEDIUM: 4-6, HIGH: 7-10
 */
export function calculateConfidence(
  userInput: string,
  intent: Intent,
  validationViolations: string[] = []
): ConfidenceResult {
  const factors: string[] = [];
  let score = 0;
  
  // Factor 1: Intent weight (0-4 points)
  const intentWeight = INTENT_WEIGHTS[intent];
  score += intentWeight;
  factors.push(`Intent: ${intent} (${intentWeight} points)`);
  
  // Factor 2: Clarity signals (0-3 points)
  const lower = userInput.toLowerCase();
  const matchedSignals = CLARITY_SIGNALS.filter(signal => 
    lower.includes(signal)
  );
  const clarityPoints = Math.min(matchedSignals.length, 3);
  score += clarityPoints;
  if (clarityPoints > 0) {
    factors.push(`Clarity signals: ${matchedSignals.length} matched (${clarityPoints} points)`);
  }
  
  // Factor 3: Engagement signals (FIX #3: reward engagement, not certainty)
  // User is engaging if they:
  // - Use any business-related words (even vague ones)
  // - Stay on topic (not off-topic)
  // - Respond to questions (any input length > 5)
  const engagementWords = ['business', 'company', 'entity', 'start', 'help', 'need', 'want', 'idk', 'not sure', 'unsure'];
  const hasEngagement = engagementWords.some(word => lower.includes(word));
  if (hasEngagement || userInput.length > 5) {
    score += 2;
    factors.push('User is engaging (2 points)');
  }
  
  // Factor 4: Input length (0-1 point)
  if (userInput.length >= 10 && userInput.length <= 200) {
    score += 1;
    factors.push('Input length appropriate (1 point)');
  }
  
  // Factor 5: Question marks (0-1 point)
  const hasQuestion = userInput.includes('?');
  if (hasQuestion) {
    score += 1;
    factors.push('Asks clear question (1 point)');
  }
  
  // Penalties: Validation violations
  const violationPenalty = validationViolations.length;
  if (violationPenalty > 0) {
    score -= violationPenalty;
    factors.push(`Validation violations: -${violationPenalty} points`);
  }
  
  // Normalize score to 0-10 range
  score = Math.max(0, Math.min(10, score));
  
  // Determine confidence level
  let level: ConfidenceLevel;
  let recommendation: 'educate' | 'soft_consultation' | 'offer_intake';
  
  if (score <= 3) {
    level = 'LOW';
    recommendation = 'educate';
    factors.push('→ LOW confidence: Educate and clarify needs');
  } else if (score <= 6) {
    level = 'MEDIUM';
    recommendation = 'soft_consultation';
    factors.push('→ MEDIUM confidence: Soft consultation suggestion');
  } else {
    level = 'HIGH';
    recommendation = 'offer_intake';
    factors.push('→ HIGH confidence: Offer Frame 61 intake directly');
  }
  
  return {
    level,
    score,
    factors,
    recommendation
  };
}

/**
 * Check if user is ready for intake based on confidence
 */
export function isReadyForIntake(confidence: ConfidenceResult): boolean {
  return confidence.level === 'HIGH' && confidence.score >= 7;
}

/**
 * Get confidence-based behavior modifier
 */
export function getConfidenceBehavior(confidence: ConfidenceResult): {
  shouldOfferIntake: boolean;
  shouldSuggestConsultation: boolean;
  shouldEducate: boolean;
} {
  return {
    shouldOfferIntake: confidence.recommendation === 'offer_intake',
    shouldSuggestConsultation: confidence.recommendation === 'soft_consultation',
    shouldEducate: confidence.recommendation === 'educate'
  };
}

/**
 * Enhance response based on confidence
 */
export function enhanceResponseWithConfidence(
  baseResponse: string,
  confidence: ConfidenceResult,
  qaExchangeCount: number
): string {
  let response = baseResponse;
  
  // After 2 Q&A exchanges, always suggest consultation regardless of confidence
  if (qaExchangeCount >= 2) {
    if (!response.includes('consultation') && !response.includes('schedule') && !response.includes('call')) {
      response += '\n\nWant to dive deeper into your specific situation? I can get you scheduled with our team for personalized guidance.';
    }
    return response;
  }
  
  // High confidence: Offer to start intake
  if (confidence.level === 'HIGH' && !response.includes('ready to begin')) {
    response += '\n\nReady to get started? I can walk you through what we\'ll need.';
  }
  
  // Medium confidence: Soft consultation nudge
  else if (confidence.level === 'MEDIUM' && qaExchangeCount >= 1) {
    if (!response.includes('consultation')) {
      response += '\n\nWant to discuss your specific needs? We can set up a quick consultation.';
    }
  }
  
  // Low confidence: Just educate, no pressure
  // (no modification needed)
  
  return response;
}
