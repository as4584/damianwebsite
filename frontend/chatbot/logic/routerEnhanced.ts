/**
 * Enhanced Router with Task-Based Architecture
 * ENFORCES MONOTONIC PROGRESSION: ORIENT → DISCOVERY → INTAKE → SCHEDULING → CONFIRMED
 * NO ESCALATION, NO HANDOFF - END-TO-END TASK OWNERSHIP
 */

import { ChatResponse, routeConversation as routeQualification } from './router';
import { ConversationState, SessionData, TaskPhase, ChatMode } from './state';
import {
  detectGoldenFrame,
  executeGoldenFrame,
  GoldenFrameId
} from './goldenFrames';
import { generateMetadata, isIntakeModeActive, initializeIntakeMode } from './intakeMode';
import { applyIntelligence } from './intelligentRouter';
import { processIntake, getIntakeQuestion } from './intakeAssistant';
import { detectIntentGPT, generateResponseGPT, initializeGPT } from './gptService';
import { SITE_CONTEXT } from '../kb/siteContext';
import {
  evaluateTaskTransition,
  handleScheduling,
  validatePhaseTransition
} from './shadowAI';
import {
  generateAvailableSlots,
  formatTimeSlotsMessage
} from './scheduling';

export interface EnhancedChatResponse extends ChatResponse {
  metadata: ReturnType<typeof generateMetadata>;
}

/**
 * Main routing function with task-based architecture
 * HARD RESET: Human-Centered Deterministic Intake Assistant
 */
export async function routeConversationEnhanced(
  userInput: string,
  currentState: ConversationState,
  sessionData: SessionData
): Promise<EnhancedChatResponse> {
  const apiKey = process.env.OPENAI_KEY || '';
  if (apiKey) initializeGPT(apiKey);

  // Initialize required structures
  if (!sessionData.intakeMode) {
    sessionData.intakeMode = initializeIntakeMode();
  }

  if (!sessionData.mode) {
    sessionData.mode = 'DIAGNOSTIC';
    sessionData.phase = 'DISCOVERY';
  }

  if (sessionData.discoveryTurns === undefined) {
    sessionData.discoveryTurns = 0;
  }

  // Handle bootstrap / first message (if no input or just a greeting)
  const isGreeting = !userInput || /^(hi|hello|hey|greetings|start|get started)$/i.test(userInput.trim());
  
  if (!sessionData.bootstrapCompleted && isGreeting) {
    sessionData.bootstrapCompleted = true;
    sessionData.phase = 'ORIENT';
    
    const welcome = `Hello! I'm here to help you guide your business formation journey. We can discuss your ideas, or if you're ready, I can help you schedule a consultation. How can I help you today?`;
    
    return {
      message: welcome,
      nextState: 'INTENT_DETECTION',
      sessionData,
      requiresInput: true,
      metadata: generateMetadata(sessionData.intakeMode!, null, false, sessionData.businessIntake)
    };
  }

  // Ensure bootstrap is marked if we are processing real input
  if (!sessionData.bootstrapCompleted) {
    sessionData.bootstrapCompleted = true;
  }

  // PHASE 1: DIAGNOSTIC MODE (Discovery)
  if (sessionData.mode === 'DIAGNOSTIC') {
    const intent = await detectIntentGPT(userInput);
    sessionData.intent = intent;

    // Transition to INTAKE if user is ready
    if (intent === 'READY_FOR_INTAKE' || intent === 'CONSULTATION') {
      sessionData.mode = 'INTAKE';
      sessionData.phase = 'INTAKE';
      sessionData.businessIntake = {
        step: 'FULL_LEGAL_NAME',
        data: {}
      };
      
      const firstQuestion = getIntakeQuestion('FULL_LEGAL_NAME', {});
      const transitionMessage = `I'd be happy to help you with that. To get everything ready for a consultation, I have a few quick questions to collect your details. ${firstQuestion}`;
      
      return {
        message: transitionMessage,
        nextState: 'INTAKE_COLLECTION',
        sessionData,
        requiresInput: true,
        metadata: generateMetadata(sessionData.intakeMode!, null, false, sessionData.businessIntake)
      };
    }

    // Otherwise, generate a helpful response and stay in diagnostic
    let response = await generateResponseGPT(userInput, intent, sessionData, SITE_CONTEXT);
    sessionData.discoveryTurns++;

    // If we've had 2-3 turns, append a nudge to move to intake/consultation
    if (sessionData.discoveryTurns >= 3 && !response.toLowerCase().includes('consultation')) {
      response += " Since we've been chatting for a bit, would you like to move forward with a consultation so we can get into the specifics of your business?";
    }
    
    return {
      message: response,
      nextState: 'INTENT_DETECTION',
      sessionData,
      requiresInput: true,
      metadata: generateMetadata(sessionData.intakeMode!, null, false, sessionData.businessIntake)
    };
  }

  // PHASE 2: INTAKE MODE (Deterministic)
  const { message, updatedSessionData } = await processIntake(
    userInput,
    sessionData,
    apiKey
  );

  // Check if lead should be saved (terminal step)
  const isCompleted = updatedSessionData.businessIntake?.step === 'COMPLETED';
  const nameExists = !!updatedSessionData.businessIntake?.data.fullLegalName;

  let nextState: ConversationState = 'INTAKE_COLLECTION';
  let requiresInput = true;

  if (isCompleted) {
    nextState = nameExists ? 'CONFIRMATION' : 'CLOSED';
    requiresInput = false;
  }

  return {
    message,
    nextState,
    sessionData: updatedSessionData,
    requiresInput,
    metadata: generateMetadata(updatedSessionData.intakeMode!, null, false, updatedSessionData.businessIntake)
  };
}

/**
 * Get initial welcome message
 */
export function getWelcomeMessageEnhanced(): EnhancedChatResponse {
  const sessionData: SessionData = {
    bootstrapCompleted: false,
    conversationHistory: [],
    intakeMode: initializeIntakeMode(),
    mode: 'DIAGNOSTIC',
    discoveryTurns: 0
  };

  const metadata = generateMetadata(
    sessionData.intakeMode!,
    null,
    false,
    sessionData.businessIntake
  );

  const welcome = `Hello! I'm here to help you guide your business formation journey. We can discuss your ideas, or if you're ready, I can help you schedule a consultation. How can I help you today?`;

  return {
    message: welcome,
    nextState: 'WELCOME',
    sessionData,
    requiresInput: true,
    metadata
  };
}
