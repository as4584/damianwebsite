/**
 * Lead Scoring Service
 * Calculates lead hotness based on engagement signals
 * 
 * INTERNAL SCORING (never expose numbers to UI):
 * - Pricing inquiry: +30
 * - Availability check: +25
 * - Contact provided: +25
 * - High-intent page: +20
 * - Urgency signal: +15
 * - Repeat visitor: +10
 */

import { LeadHotness, HotnessFactor, ConversationMessage, LeadSource } from '../types';

interface ContactInfo {
  hasEmail: boolean;
  hasPhone: boolean;
}

// Internal scoring weights (NEVER expose these to users)
const SCORING_WEIGHTS = {
  PRICING_INQUIRY: 30,
  AVAILABILITY_CHECK: 25,
  CONTACT_PROVIDED: 25,
  HIGH_INTENT_PAGE: 20,
  URGENCY_SIGNAL: 15,
  REPEAT_VISITOR: 10
};

// High-intent pages
const HIGH_INTENT_PAGES = ['/pricing', '/contact', '/services', '/starting-a-business'];

// Keywords for detection
const PRICING_KEYWORDS = ['price', 'cost', 'pricing', 'how much', 'fee', 'charge', 'rate', 'afford', 'budget', 'investment'];
const AVAILABILITY_KEYWORDS = ['available', 'availability', 'when', 'schedule', 'meeting', 'appointment', 'call', 'time slot', 'book'];
const URGENCY_KEYWORDS = ['urgent', 'asap', 'immediately', 'today', 'tomorrow', 'quickly', 'soon', 'rush', 'deadline'];

/**
 * Calculate lead score based on engagement signals
 * @returns Internal score (never expose to UI)
 */
export function calculateLeadScore(
  conversation: ConversationMessage[],
  source: LeadSource,
  contactInfo: ContactInfo
): number {
  let score = 0;
  
  const allUserMessages = conversation
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  // Check for pricing inquiry
  if (PRICING_KEYWORDS.some(kw => allUserMessages.includes(kw))) {
    score += SCORING_WEIGHTS.PRICING_INQUIRY;
  }

  // Check for availability inquiry
  if (AVAILABILITY_KEYWORDS.some(kw => allUserMessages.includes(kw))) {
    score += SCORING_WEIGHTS.AVAILABILITY_CHECK;
  }

  // Check for contact info provided
  if (contactInfo.hasEmail || contactInfo.hasPhone) {
    score += SCORING_WEIGHTS.CONTACT_PROVIDED;
  }

  // Check for high-intent page
  if (HIGH_INTENT_PAGES.some(page => source.page.includes(page))) {
    score += SCORING_WEIGHTS.HIGH_INTENT_PAGE;
  }

  // Check for urgency signals
  if (URGENCY_KEYWORDS.some(kw => allUserMessages.includes(kw))) {
    score += SCORING_WEIGHTS.URGENCY_SIGNAL;
  }

  return score;
}

/**
 * Determine hotness level from score
 * Thresholds: Cold < 25, Warm 25-54, Hot >= 55
 */
export function determineHotness(score: number): LeadHotness {
  if (score >= 55) return 'hot';
  if (score >= 25) return 'warm';
  return 'cold';
}

/**
 * Get all hotness factors with presence status
 */
export function getHotnessFactors(
  conversation: ConversationMessage[],
  source: LeadSource,
  contactInfo: ContactInfo
): HotnessFactor[] {
  const allUserMessages = conversation
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  return [
    {
      type: 'pricing_inquiry',
      name: 'Pricing Inquiry',
      description: 'Asked about pricing or costs',
      present: PRICING_KEYWORDS.some(kw => allUserMessages.includes(kw))
    },
    {
      type: 'availability_check',
      name: 'Availability Check',
      description: 'Inquired about availability or scheduling',
      present: AVAILABILITY_KEYWORDS.some(kw => allUserMessages.includes(kw))
    },
    {
      type: 'contact_provided',
      name: 'Contact Provided',
      description: 'Provided contact information',
      present: contactInfo.hasEmail || contactInfo.hasPhone
    },
    {
      type: 'high_intent_page',
      name: 'High-Intent Page',
      description: 'Visited from a high-intent page',
      present: HIGH_INTENT_PAGES.some(page => source.page.includes(page))
    },
    {
      type: 'urgency_signal',
      name: 'Urgency Signal',
      description: 'Expressed urgency or time sensitivity',
      present: URGENCY_KEYWORDS.some(kw => allUserMessages.includes(kw))
    }
  ];
}

/**
 * Get human-readable explanation for hotness level
 * CRITICAL: Never include numeric scores - returns string only
 */
export function getHotnessExplanation(
  hotness: LeadHotness,
  factors: HotnessFactor[]
): string {
  const presentFactors = factors.filter(f => f.present);
  
  const explanations = {
    hot: 'This person is highly engaged and showing strong buying signals. They are ready to take action and should be contacted promptly.',
    warm: 'This person is interested and exploring their options. They need a bit more information or nurturing before committing.',
    cold: 'This person is in early research mode or may not be a strong fit. They haven\'t shown strong buying signals yet.'
  };

  let explanation = explanations[hotness];
  
  if (presentFactors.length > 0) {
    const factorNames = presentFactors.map(f => f.name || f.description).join(', ');
    explanation += ` We noticed: ${factorNames}.`;
  }
  
  return explanation;
}

/**
 * Get detailed explanation object (for extended UI)
 */
export function getDetailedHotnessExplanation(
  hotness: LeadHotness,
  factors: HotnessFactor[]
): { title: string; meaning: string; reasons: string[]; recommendations: string } {
  const presentFactors = factors.filter(f => f.present);
  const reasons = presentFactors.map(f => f.description || f.name);

  const explanations = {
    hot: {
      title: '🔥 Hot Lead',
      meaning: 'This person is highly engaged and showing strong buying signals. They are ready to take action and should be contacted promptly.',
      recommendations: 'Reach out within 24 hours. Prepare specific answers to their questions and have availability ready to offer.'
    },
    warm: {
      title: '🟡 Warm Lead',
      meaning: 'This person is interested and exploring their options. They need a bit more information or nurturing before committing.',
      recommendations: 'Follow up with helpful information. Answer their questions thoroughly and offer a no-pressure consultation.'
    },
    cold: {
      title: '⚪ Cold Lead',
      meaning: 'This person is in early research mode or may not be a strong fit. They haven\'t shown strong buying signals yet.',
      recommendations: 'Keep them informed with general updates. Don\'t push for immediate action but stay available.'
    }
  };

  return {
    title: explanations[hotness].title,
    meaning: explanations[hotness].meaning,
    reasons: reasons.length > 0 ? reasons : ['No strong engagement signals detected yet'],
    recommendations: explanations[hotness].recommendations
  };
}

/**
 * Full lead scoring pipeline
 */
export function scoreLead(
  conversation: ConversationMessage[],
  source: LeadSource,
  email: string | null,
  phone: string | null
): { hotness: LeadHotness; factors: HotnessFactor[] } {
  const contactInfo = {
    hasEmail: !!email,
    hasPhone: !!phone
  };

  const factors = getHotnessFactors(conversation, source, contactInfo);
  const score = calculateLeadScore(conversation, source, contactInfo);
  const hotness = determineHotness(score);

  return { hotness, factors };
}
