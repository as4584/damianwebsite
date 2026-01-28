/**
 * Intent Extraction Utility
 * Extracts intent and key information from conversations
 */

import { ConversationMessage, LeadIntent, ExtractedInfo } from '../types';

// Intent detection patterns
const INTENT_PATTERNS: Record<LeadIntent, RegExp[]> = {
  sales: [
    /want to (start|form|create|register|buy|purchase)/i,
    /need (an?|to) (llc|corporation|business|entity)/i,
    /help me (start|form|create)/i,
    /looking to (start|form|create|buy|purchase)/i,
    /interested in (starting|forming|buying|purchasing)/i,
    /ready to (start|begin|proceed|buy|purchase)/i,
    /how (do i|can i) (start|form|create)/i,
    /want to buy/i,
    /i want to buy/i,
    /purchase your services/i,
    /buy your services/i
  ],
  booking: [
    /schedule (a |an )?(consultation|meeting|call|appointment)/i,
    /book (a |an )?(consultation|meeting|call|appointment)/i,
    /set up (a |an )?(consultation|meeting|call)/i,
    /when (are you|can we) (available|meet)/i,
    /available (times?|slots?)/i,
    /let's (talk|meet|schedule)/i
  ],
  question: [
    /what (is|are|does)/i,
    /how (does|do|much|long)/i,
    /can you (explain|tell me)/i,
    /difference between/i,
    /\?$/,
    /wondering (about|if)/i
  ],
  support: [
    /problem (with|regarding)/i,
    /issue (with|regarding)/i,
    /help (me )?(fix|resolve|with)/i,
    /not working/i,
    /existing (filing|account|business)/i,
    /already (filed|registered)/i
  ],
  unknown: []
};

// Business type patterns
const BUSINESS_TYPE_PATTERNS = [
  { pattern: /consulting|consultant/i, type: 'Consulting' },
  { pattern: /restaurant|food|catering/i, type: 'Food & Restaurant' },
  { pattern: /e-?commerce|online (store|shop)|retail/i, type: 'E-commerce/Retail' },
  { pattern: /tech|software|app|saas/i, type: 'Technology' },
  { pattern: /real estate|property|realty/i, type: 'Real Estate' },
  { pattern: /construction|contractor|building/i, type: 'Construction' },
  { pattern: /healthcare|medical|clinic|health/i, type: 'Healthcare' },
  { pattern: /marketing|advertising|agency/i, type: 'Marketing/Agency' },
  { pattern: /freelance|creative|design/i, type: 'Creative/Freelance' },
  { pattern: /coaching|training|education/i, type: 'Coaching/Education' }
];

// US States for location detection
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

// Timeline patterns
const TIMELINE_PATTERNS = [
  { pattern: /today|immediately|asap|urgent/i, value: 'Urgent (Today)' },
  { pattern: /tomorrow/i, value: 'Tomorrow' },
  { pattern: /this week/i, value: 'This Week' },
  { pattern: /next week/i, value: 'Next Week' },
  { pattern: /this month/i, value: 'This Month' },
  { pattern: /next month/i, value: 'Next Month' },
  { pattern: /(\d+)\s*(days?|weeks?|months?)/i, value: 'Specific Timeline' }
];

/**
 * Extract primary intent from conversation
 */
export function extractIntent(conversation: ConversationMessage[]): LeadIntent {
  const userMessages = conversation
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  // Check each intent type
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'unknown') continue;
    
    for (const pattern of patterns) {
      if (pattern.test(userMessages)) {
        return intent as LeadIntent;
      }
    }
  }

  return 'unknown';
}

/**
 * Extract key information from conversation
 */
export function extractKeyInfo(conversation: ConversationMessage[]): ExtractedInfo {
  const userMessages = conversation
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  const info: ExtractedInfo = {};

  // Extract business type
  for (const { pattern, type } of BUSINESS_TYPE_PATTERNS) {
    if (pattern.test(userMessages)) {
      info.businessType = type;
      break;
    }
  }

  // Extract location (state)
  for (const state of US_STATES) {
    if (userMessages.toLowerCase().includes(state.toLowerCase())) {
      info.location = state;
      break;
    }
  }

  // Extract timeline
  for (const { pattern, value } of TIMELINE_PATTERNS) {
    if (pattern.test(userMessages)) {
      info.timeline = value;
      break;
    }
  }

  // Extract budget mentions
  const budgetMatch = userMessages.match(/\$[\d,]+|\d+\s*(dollars?|k|thousand)/i);
  if (budgetMatch) {
    info.budget = budgetMatch[0];
  }

  return info;
}

/**
 * Get highlights from a message
 */
export function getMessageHighlights(content: string): string[] {
  const highlights: string[] = [];

  // Check for business type mentions
  for (const { pattern, type } of BUSINESS_TYPE_PATTERNS) {
    if (pattern.test(content)) {
      highlights.push(type);
    }
  }

  // Check for state mentions
  for (const state of US_STATES) {
    if (content.toLowerCase().includes(state.toLowerCase())) {
      highlights.push(state);
    }
  }

  // Check for timeline mentions
  for (const { pattern, value } of TIMELINE_PATTERNS) {
    if (pattern.test(content)) {
      highlights.push(value);
    }
  }

  return highlights;
}

/**
 * Create a business-friendly conversation summary
 * CRITICAL: No technical jargon (sessions, logs, transcripts)
 */
export function summarizeConversation(conversation: ConversationMessage[]): string {
  const userMessages = conversation.filter(m => m.role === 'user');
  
  if (userMessages.length === 0) {
    return 'No messages from this person yet.';
  }

  const intent = extractIntent(conversation);
  const info = extractKeyInfo(conversation);

  let summary = '';

  // Start with intent-based summary
  switch (intent) {
    case 'sales':
      summary = 'This person is interested in starting a business';
      break;
    case 'booking':
      summary = 'This person wants to schedule a consultation';
      break;
    case 'question':
      summary = 'This person has questions';
      break;
    case 'support':
      summary = 'This person needs help with an existing matter';
      break;
    default:
      summary = 'This person reached out';
  }

  // Add extracted details
  const details: string[] = [];
  
  if (info.businessType) {
    details.push(`business type: ${info.businessType}`);
  }
  if (info.location) {
    details.push(`location: ${info.location}`);
  }
  if (info.timeline) {
    details.push(`timeline: ${info.timeline}`);
  }

  if (details.length > 0) {
    summary += ` (${details.join(', ')})`;
  }

  summary += '.';

  // Add first user message as context
  const firstMessage = userMessages[0].content;
  if (firstMessage.length > 10) {
    const truncated = firstMessage.length > 100 
      ? firstMessage.substring(0, 100) + '...'
      : firstMessage;
    summary += ` They said: "${truncated}"`;
  }

  return summary;
}
