/**
 * Intelligent Router - GPT-4o-mini Integration Layer
 * Injects AI intelligence while preserving Golden Frames and existing flow
 * 
 * LOCKED CONSTRAINTS:
 * - MAX 2 OpenAI calls per user message
 * - No embeddings, Assistants, Threads, or Tools
 * - Skip GPT for simple inputs (greetings, thanks, intake mode)
 * - Keep costs under $10/month
 * - DISCOVERY phase: max 3 diagnostic questions, then force INTAKE
 */

import { ChatResponse } from './router';
import { ConversationState, SessionData, TaskPhase } from './state';
import {
  initializeGPT,
  shouldSkipGPT,
  detectIntentGPT,
  generateResponseGPT,
  Intent,
  getUsageStats
} from './gptService';
import {
  calculateConfidence,
  enhanceResponseWithConfidence,
  ConfidenceLevel
} from './confidenceScoring';
import siteKnowledgeData from '../kb/siteKnowledge.json';
import { isProfanityOrNonsense } from './smartValidation';

// LLM call counter per message (HARD CAP)
let llmCallsThisMessage = 0;
const MAX_LLM_CALLS_PER_MESSAGE = 2;

/**
 * Initialize GPT with API key
 */
export function initializeIntelligentRouter(apiKey: string) {
  initializeGPT(apiKey);
}

/**
 * Build site context string from knowledge base
 */
function buildSiteContext(currentPage: string = '/'): string {
  const knowledge = siteKnowledgeData as any;
  const pageInfo = knowledge.pages[currentPage] || knowledge.pages['/'];
  
  let context = `Current page: ${pageInfo.title} (${currentPage})\n`;
  context += `Purpose: ${pageInfo.purpose}\n\n`;
  
  context += 'AVAILABLE SITE SECTIONS:\n';
  Object.entries(knowledge.pages).forEach(([path, info]: [string, any]) => {
    context += `- ${info.title}: ${path}\n`;
  });
  
  context += '\nKEY FAQS:\n';
  Object.entries(knowledge.faqs).forEach(([topic, answer]: [string, any]) => {
    context += `- ${topic}: ${answer.substring(0, 100)}...\n`;
  });
  
  return context;
}

/**
 * Count Q&A exchanges in conversation history
 */
function countQAExchanges(sessionData: SessionData): number {
  if (!sessionData.conversationHistory || !Array.isArray(sessionData.conversationHistory)) return 0;
  
  // Count bot responses that contain informational content
  let count = 0;
  for (const msg of sessionData.conversationHistory) {
    const text = msg.message || '';
    if (text.includes('?') || text.includes('LLC') || text.includes('services') || text.includes('formation')) {
      count++;
    }
  }
  
  return Math.floor(count / 2); // Rough estimate of Q&A pairs
}

/**
 * Determine if this message should use GPT intelligence
 * CRITICAL: Respect TaskPhase system (ORIENT/DISCOVERY/INTAKE/SCHEDULING/CONFIRMED)
 */
function shouldUseIntelligence(
  userInput: string,
  currentState: ConversationState,
  sessionData: SessionData
): boolean {
  // SKIP: Empty or very short input
  if (userInput.trim().length < 3) return false;
  
  // SKIP: Not in DISCOVERY phase (only DISCOVERY uses GPT)
  if (sessionData.phase !== 'DISCOVERY') {
    console.log(`[Intelligence] Skipping GPT - not in DISCOVERY phase (current: ${sessionData.phase})`);
    return false;
  }
  
  // SKIP: Already hit max discovery turns
  if ((sessionData.discoveryTurns || 0) >= 3) {
    console.log('[Intelligence] Skipping GPT - max discovery turns reached');
    return false;
  }
  
  // SKIP: Currently in intake collection (Golden Frames handle this)
  if (currentState === 'INTAKE_COLLECTION' || currentState === 'INTAKE_TRANSITION') {
    return false;
  }
  
  // SKIP: Simple greetings, thanks, bye
  if (shouldSkipGPT(userInput, currentState)) return false;
  
  // USE: In DISCOVERY phase with turns remaining
  return true;
}

/**
 * Apply GPT intelligence to enhance response
 * Returns enhanced response or null if GPT should be skipped
 * CRITICAL: Only runs in DISCOVERY phase (max 3 turns)
 */
export async function applyIntelligence(
  userInput: string,
  currentState: ConversationState,
  sessionData: SessionData,
  baseResponse?: ChatResponse
): Promise<ChatResponse | null> {
  // Reset call counter at start of each message
  llmCallsThisMessage = 0;
  
  // Determine if we should use intelligence
  if (!shouldUseIntelligence(userInput, currentState, sessionData)) {
    console.log('[Intelligence] Skipping GPT for this message');
    return null; // Let standard router handle it
  }
  
  try {
    // CALL 1: Intent Detection (low tokens, deterministic)
    console.log('[Intelligence] Call 1/2: Intent detection');
    llmCallsThisMessage++;
    
    const currentPage = '/'; // Could be extracted from sessionData if tracked
    const intent: Intent = await detectIntentGPT(userInput, currentPage);
    
    console.log(`[Intelligence] Detected intent: ${intent}`);
    
    // Check for profanity/nonsense (FREE - no LLM calls)
    const hasProfanity = isProfanityOrNonsense(userInput);
    const violations: string[] = hasProfanity ? ['profanity_or_nonsense'] : [];
    
    // Calculate confidence (FREE - deterministic logic)
    const confidence = calculateConfidence(userInput, intent, violations);
    console.log(`[Intelligence] Confidence: ${confidence.level} (${confidence.score}/10)`);
    console.log(`[Intelligence] Factors: ${confidence.factors.join(', ')}`);
    
    // Get discovery turn count
    const discoveryTurns = sessionData.discoveryTurns || 0;
    console.log(`[Intelligence] Discovery turn ${discoveryTurns}/3`);
    
    // FIX #2: Handle ENTITY_HELP + LOW confidence with diagnostic question
    // This prevents welcome reset loops and advances the conversation
    if (intent === 'ENTITY_HELP' && confidence.level === 'LOW') {
      console.log('[Intelligence] ENTITY_HELP + LOW confidence -> asking diagnostic question via GPT');
      // Let GPT ask the clarifying question (Call #2)
      // GPT now has permission to ask clarifying questions in system prompt
    }
    
    // CALL 2: Response Generation (natural language)
    console.log('[Intelligence] Call 2/2: Response generation');
    llmCallsThisMessage++;
    
    const siteContext = buildSiteContext(currentPage);
    const gptResponse = await generateResponseGPT(userInput, intent, sessionData, siteContext);
    
    // Enhance response with confidence-based behavior
    // Note: using discoveryTurns instead of qaCount
    const enhancedResponse = enhanceResponseWithConfidence(gptResponse, confidence, discoveryTurns);
    
    // Log usage stats
    const stats = getUsageStats();
    console.log(`[Intelligence] Usage: ${stats.callCount} calls, $${stats.estimatedCost.toFixed(4)} spent, $${stats.budgetRemaining.toFixed(2)} remaining`);
    
    // Determine next state based on intent and confidence
    let nextState: ConversationState = currentState;
    
    if (intent === 'CONSULTATION') {
      nextState = 'SUMMARY';
    } else if (intent === 'READY_FOR_INTAKE' && confidence.level === 'HIGH') {
      nextState = 'INTAKE_TRANSITION';
    } else if (intent === 'OFF_TOPIC') {
      nextState = 'INFO_PROVIDED';
    } else {
      nextState = 'INFO_PROVIDED'; // Stay in info mode for follow-up questions
    }
    
    return {
      message: enhancedResponse,
      nextState,
      sessionData,
      requiresInput: true
    };
    
  } catch (error) {
    console.error('[Intelligence] GPT integration failed:', error);
    // Graceful degradation: return null to let standard router handle
    return null;
  } finally {
    // Ensure we never exceed the call limit
    if (llmCallsThisMessage > MAX_LLM_CALLS_PER_MESSAGE) {
      console.error(`[Intelligence] VIOLATION: Made ${llmCallsThisMessage} calls (max ${MAX_LLM_CALLS_PER_MESSAGE})`);
    }
  }
}

/**
 * Get intelligence status for debugging
 */
export function getIntelligenceStatus() {
  const stats = getUsageStats();
  return {
    enabled: true,
    callsThisMessage: llmCallsThisMessage,
    maxCallsPerMessage: MAX_LLM_CALLS_PER_MESSAGE,
    monthlyUsage: stats
  };
}
