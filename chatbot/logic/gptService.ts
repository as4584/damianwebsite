/**
 * GPT-4o-mini Service
 * Handles OpenAI API calls with strict cost controls
 */

import { SessionData } from './state';

// HARD LIMITS
const MAX_LLM_CALLS_PER_MESSAGE = 2;
const MAX_INTENT_TOKENS = 10;
const MAX_RESPONSE_TOKENS = 150;
const MAX_INPUT_LENGTH = 200;

// Monthly budget tracking (in-memory for now, should be Redis/DB in production)
let monthlyCallCount = 0;
let monthlyCost = 0;
const MONTHLY_BUDGET_CAP = 8.0; // $8 hard cap

export type Intent = 
  | 'ENTITY_HELP'
  | 'PRICING'
  | 'CONSULTATION'
  | 'GENERAL_INFO'
  | 'TIMELINE'
  | 'SERVICES'
  | 'READY_FOR_INTAKE'
  | 'OFF_TOPIC';

interface GPTConfig {
  apiKey: string;
  model: string;
  baseURL: string;
}

let gptConfig: GPTConfig | null = null;

export function initializeGPT(apiKey: string) {
  gptConfig = {
    apiKey,
    model: 'gpt-4o-mini',
    baseURL: 'https://api.openai.com/v1'
  };
}

/**
 * Check if we should skip GPT for this input
 */
export function shouldSkipGPT(input: string, currentState: string): boolean {
  // Skip for empty/very short input
  if (input.length < 3) return true;
  
  // Skip for simple greetings
  if (/^(hi|hey|hello|sup|yo)$/i.test(input.trim())) return true;
  
  // Skip for thanks
  if (/^(thanks|thank you|thx|ty)$/i.test(input.trim())) return true;
  
  // Skip for bye
  if (/^(bye|goodbye|later|cya)$/i.test(input.trim())) return true;
  
  // Skip during intake collection (Golden Frames handle this)
  if (currentState === 'INTAKE_COLLECTION' || currentState === 'INTAKE_TRANSITION') return true;
  
  return false;
}

/**
 * Detect intent using GPT-4o-mini
 * Cost: ~$0.000024 per call
 */
export async function detectIntentGPT(
  userInput: string,
  currentPage: string = '/'
): Promise<Intent> {
  if (!gptConfig) {
    throw new Error('GPT not initialized. Call initializeGPT() first.');
  }
  
  // Check budget
  if (monthlyCost >= MONTHLY_BUDGET_CAP) {
    console.warn('Monthly budget cap reached, using fallback');
    return detectIntentFallback(userInput);
  }
  
  // Truncate input
  const truncatedInput = userInput.slice(0, MAX_INPUT_LENGTH);
  
  const systemPrompt = `You are an intent classifier for a business formation company.
Current page: ${currentPage}

Classify user message into ONE intent:
- ENTITY_HELP: Questions about LLC, S-Corp, C-Corp, entity types, structure
- PRICING: Questions about cost, pricing, fees, how much
- CONSULTATION: Ready to book, wants to talk, schedule
- TIMELINE: How long, when, timeframe questions
- SERVICES: What do you do, what services, offerings
- READY_FOR_INTAKE: Wants to fill form, provide info, get started now
- GENERAL_INFO: General questions about the company
- OFF_TOPIC: Not business-related (greetings, personal, etc.)

Respond with ONLY the intent name (e.g., "ENTITY_HELP").`;

  try {
    const response = await fetch(`${gptConfig.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptConfig.apiKey}`
      },
      body: JSON.stringify({
        model: gptConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: truncatedInput }
        ],
        max_tokens: MAX_INTENT_TOKENS,
        temperature: 0.1
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    const tokens = data.usage?.total_tokens || 0;
    const cost = (tokens / 1000000) * 0.15; // Approximate
    monthlyCallCount++;
    monthlyCost += cost;
    
    const intent = data.choices[0]?.message?.content?.trim() as Intent;
    
    // Validate intent
    const validIntents: Intent[] = [
      'ENTITY_HELP', 'PRICING', 'CONSULTATION', 'GENERAL_INFO',
      'TIMELINE', 'SERVICES', 'READY_FOR_INTAKE', 'OFF_TOPIC'
    ];
    
    if (!validIntents.includes(intent)) {
      return 'GENERAL_INFO';
    }
    
    return intent;
  } catch (error) {
    console.error('GPT intent detection failed:', error);
    return detectIntentFallback(userInput);
  }
}

/**
 * Fallback intent detection (keyword-based)
 */
function detectIntentFallback(input: string): Intent {
  const lower = input.toLowerCase();
  
  if (lower.match(/\b(llc|corp|s-corp|c-corp|entity|structure|partnership)\b/)) {
    return 'ENTITY_HELP';
  }
  if (lower.match(/\b(price|cost|fee|how much|pricing|expensive|cheap)\b/)) {
    return 'PRICING';
  }
  if (lower.match(/\b(ready|start|begin|fill|form|intake|get started)\b/)) {
    return 'READY_FOR_INTAKE';
  }
  if (lower.match(/\b(schedule|consult|call|talk|speak|meet|appointment)\b/)) {
    return 'CONSULTATION';
  }
  if (lower.match(/\b(how long|timeline|when|timeframe|duration|takes)\b/)) {
    return 'TIMELINE';
  }
  if (lower.match(/\b(service|offering|what do you|what can|help with)\b/)) {
    return 'SERVICES';
  }
  
  return 'GENERAL_INFO';
}

/**
 * Generate response using GPT-4o-mini
 * Cost: ~$0.000093 per call
 */
export async function generateResponseGPT(
  userInput: string,
  intent: Intent,
  sessionData: SessionData,
  siteContext: string
): Promise<string> {
  if (!gptConfig) {
    throw new Error('GPT not initialized. Call initializeGPT() first.');
  }
  
  // Check budget
  if (monthlyCost >= MONTHLY_BUDGET_CAP) {
    console.warn('Monthly budget cap reached, using fallback');
    return getFallbackResponse(intent);
  }
  
  // Truncate input
  const truncatedInput = userInput.slice(0, MAX_INPUT_LENGTH);
  
  // Count Q&A exchanges
  const qaCount = sessionData.conversationHistory?.filter(msg => {
    const text = msg.message || '';
    return text.toLowerCase().includes('answer') || text.toLowerCase().includes('question');
  }).length || 0;
  
  const shouldNudgeConsultation = qaCount >= 2;
  
  const systemPrompt = `You are a helpful assistant for Innovation Business Development Solutions, a national business formation firm.

COMPANY SERVICES:
- Business formation (LLC, S-Corp, C-Corp, multi-state)
- Compliance (registered agent, annual reports, BOI filing)
- Websites and custom applications
- AI tools integration
- Email infrastructure

${siteContext}

DIAGNOSTIC MODE (you are in this mode now):
Your job is to understand the user's situation through clarifying questions.
You are NOT collecting formal data yet. You are diagnosing needs.

TONE: Warm, patient, conversational. Like a helpful guide.
LENGTH: 1-2 sentences maximum.
GOAL: ${shouldNudgeConsultation ? 'Suggest moving forward after understanding their needs.' : 'Ask ONE clarifying question to understand their situation.'}

YOUR PERMISSION:
- Ask ONE clarifying question per response
- Focus on understanding: Starting vs. expanding? Alone or with partners? What industry?
- Help confused users step by step

YOUR RESTRICTIONS:
- NEVER say "let me connect you with a specialist" or "escalate to a specialist"
- NEVER ask for consent to collect information
- NEVER restart welcome messages
- NEVER give legal or tax advice
- NEVER invent specific prices (say "pricing varies, typically starts around $500-1000 for LLC formation")
- Keep responses under 150 tokens

INSTEAD OF ESCALATION, SAY:
"I can help you figure this out step by step."

Intent: ${intent}${shouldNudgeConsultation ? '\nNOTE: User has answered 2+ questions. Suggest moving forward: "Based on what you\'ve told me, it sounds like we should discuss your specific situation in detail. Want to move forward?"' : ''}`;

  try {
    const response = await fetch(`${gptConfig.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptConfig.apiKey}`
      },
      body: JSON.stringify({
        model: gptConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: truncatedInput }
        ],
        max_tokens: MAX_RESPONSE_TOKENS,
        temperature: 0.7,
        presence_penalty: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Track usage
    const tokens = data.usage?.total_tokens || 0;
    const cost = (tokens / 1000000) * 0.375; // Weighted average
    monthlyCallCount++;
    monthlyCost += cost;
    
    console.log(`GPT call #${monthlyCallCount} | Cost: $${cost.toFixed(6)} | Total: $${monthlyCost.toFixed(4)}`);
    
    return data.choices[0]?.message?.content?.trim() || getFallbackResponse(intent);
  } catch (error) {
    console.error('GPT response generation failed:', error);
    return getFallbackResponse(intent);
  }
}

/**
 * Fallback responses when GPT unavailable
 * DIAGNOSTIC MODE - no escalation, just helpful guidance
 */
function getFallbackResponse(intent: Intent): string {
  const fallbacks: Record<Intent, string> = {
    ENTITY_HELP: "Got it — that's a common question. Are you starting this business on your own, or with partners?",
    PRICING: "Pricing varies based on your needs. LLC formation typically starts around $500-1000. What type of business are you setting up?",
    TIMELINE: "Formation typically takes 24-48 hours, with same-day EIN issuance. Are you ready to start soon?",
    CONSULTATION: "I can help you figure out what you need. Are you starting a new business or expanding an existing one?",
    SERVICES: "We handle formation, compliance, websites, and custom apps. What are you looking to do?",
    READY_FOR_INTAKE: "Great! Let me ask a couple questions first. Are you starting a new business or already operating?",
    GENERAL_INFO: "I can help you figure this out step by step. What's on your mind?",
    OFF_TOPIC: "I'm here to help with business formation questions. What would you like to know?"
  };
  
  return fallbacks[intent] || fallbacks.GENERAL_INFO;
}

/**
 * Get usage stats
 */
export function getUsageStats() {
  return {
    callCount: monthlyCallCount,
    estimatedCost: monthlyCost,
    budgetRemaining: MONTHLY_BUDGET_CAP - monthlyCost
  };
}

/**
 * Reset monthly tracking (call at month start)
 */
export function resetMonthlyTracking() {
  monthlyCallCount = 0;
  monthlyCost = 0;
}
