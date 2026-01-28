/**
 * Intent Detection
 * Rule-based intent classification (no LLM required)
 */

export type Intent = 
  | 'ENTITY_HELP'
  | 'NOT_SURE'
  | 'PRICING'
  | 'CONSULTATION'
  | 'GENERAL_INFO'
  | 'ENTITY_QUESTION'
  | 'TIMELINE'
  | 'SERVICES'
  | 'UNKNOWN';

interface IntentPattern {
  keywords: string[];
  phrases: string[];
}

const intentPatterns: Record<Intent, IntentPattern> = {
  ENTITY_HELP: {
    keywords: ['llc', 'corporation', 'corp', 'nonprofit', 'entity', 'form', 'formation', 'structure', 'business type'],
    phrases: ['start a business', 'start an llc', 'form an llc', 'which entity', 'what structure']
  },
  
  NOT_SURE: {
    keywords: ['unsure', 'confused', 'help', 'don\'t know', 'not sure', 'uncertain'],
    phrases: ['don\'t know where', 'not sure what', 'help me decide', 'which one', 'what should i']
  },
  
  PRICING: {
    keywords: ['price', 'cost', 'pricing', 'fee', 'charge', 'expensive', 'cheap', 'affordable', 'how much'],
    phrases: ['how much does', 'what does it cost', 'what are your prices', 'cost to form']
  },
  
  CONSULTATION: {
    keywords: ['consult', 'consultation', 'talk', 'speak', 'meet', 'discuss', 'appointment', 'schedule', 'call'],
    phrases: ['schedule a consultation', 'book a call', 'talk to someone', 'speak with', 'set up a meeting']
  },
  
  GENERAL_INFO: {
    keywords: ['about', 'who', 'what do you', 'services', 'offer', 'provide', 'help with'],
    phrases: ['what do you do', 'who are you', 'tell me about', 'what services']
  },
  
  ENTITY_QUESTION: {
    keywords: ['difference', 'compare', 'versus', 'vs', 'better', 'best'],
    phrases: ['llc vs', 'corp vs', 'difference between', 'which is better']
  },
  
  TIMELINE: {
    keywords: ['timeline', 'how long', 'when', 'duration', 'time', 'fast', 'quick'],
    phrases: ['how long does', 'how fast', 'how quickly', 'timeline to', 'when can i']
  },
  
  SERVICES: {
    keywords: ['services', 'offer', 'provide', 'do', 'website', 'compliance', 'licensing'],
    phrases: ['what services', 'what do you offer', 'what can you help', 'do you provide']
  },
  
  UNKNOWN: {
    keywords: [],
    phrases: []
  }
};

/**
 * Detect intent from user input using rule-based pattern matching
 */
export function detectIntent(input: string): Intent {
  const normalized = input.toLowerCase().trim();
  
  // Score each intent
  const scores: Record<Intent, number> = {
    ENTITY_HELP: 0,
    NOT_SURE: 0,
    PRICING: 0,
    CONSULTATION: 0,
    GENERAL_INFO: 0,
    ENTITY_QUESTION: 0,
    TIMELINE: 0,
    SERVICES: 0,
    UNKNOWN: 0
  };
  
  // Check each intent's patterns
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    if (intent === 'UNKNOWN') continue;
    
    // Check keywords
    for (const keyword of patterns.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        scores[intent as Intent] += 1;
      }
    }
    
    // Check phrases (higher weight)
    for (const phrase of patterns.phrases) {
      if (normalized.includes(phrase.toLowerCase())) {
        scores[intent as Intent] += 2;
      }
    }
  }
  
  // Find highest scoring intent
  let maxScore = 0;
  let detectedIntent: Intent = 'UNKNOWN';
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent as Intent;
    }
  }
  
  // Return detected intent or UNKNOWN if no strong match
  return maxScore > 0 ? detectedIntent : 'UNKNOWN';
}

/**
 * Extract business type from user input
 */
export function extractBusinessType(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  
  // Common business types
  const businessTypes = [
    'consulting', 'consultant', 'coach', 'coaching',
    'ecommerce', 'e-commerce', 'online store', 'shop',
    'restaurant', 'cafe', 'coffee shop', 'food',
    'real estate', 'realtor', 'property',
    'construction', 'contractor', 'building',
    'tech', 'software', 'app', 'saas',
    'marketing', 'agency', 'digital marketing',
    'healthcare', 'medical', 'clinic', 'practice',
    'legal', 'law', 'attorney',
    'accounting', 'bookkeeping', 'tax',
    'retail', 'store', 'boutique',
    'service', 'services',
    'nonprofit', 'charity', 'foundation'
  ];
  
  for (const type of businessTypes) {
    if (normalized.includes(type)) {
      return type;
    }
  }
  
  // If no specific type found, return the full input if it's reasonable
  if (input.length > 2 && input.length < 100) {
    return input;
  }
  
  return null;
}

/**
 * Check if input indicates yes/positive response
 */
export function isPositiveResponse(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  const positivePatterns = ['yes', 'yep', 'yeah', 'sure', 'ok', 'okay', 'y', 'correct', 'right', 'absolutely'];
  return positivePatterns.some(pattern => normalized === pattern || normalized.startsWith(pattern));
}

/**
 * Check if input indicates no/negative response
 */
export function isNegativeResponse(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  const negativePatterns = ['no', 'nope', 'nah', 'n', 'not', 'don\'t', 'wrong'];
  return negativePatterns.some(pattern => normalized === pattern || normalized.startsWith(pattern));
}

/**
 * Extract location (state or city) from input
 */
export function extractLocation(input: string): string | null {
  const normalized = input.trim();
  
  // US State abbreviations and names
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  
  const upperInput = normalized.toUpperCase();
  
  // Check for state abbreviation
  for (const state of states) {
    if (upperInput.includes(state.toUpperCase())) {
      return state;
    }
  }
  
  // Return full input if it seems like a location
  if (input.length > 2 && input.length < 100) {
    return input;
  }
  
  return null;
}
