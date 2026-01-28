/**
 * Enhanced Router with Task-Based Architecture
 * ENFORCES MONOTONIC PROGRESSION: ORIENT → DISCOVERY → INTAKE → SCHEDULING → CONFIRMED
 * NO ESCALATION, NO HANDOFF - END-TO-END TASK OWNERSHIP
 */

import { ChatResponse, routeConversation as routeQualification } from './router';
import { ConversationState, SessionData, TaskPhase } from './state';
import {
  detectGoldenFrame,
  executeGoldenFrame,
  GoldenFrameId
} from './goldenFrames';
import { generateMetadata, isIntakeModeActive } from './intakeMode';
import { applyIntelligence } from './intelligentRouter';
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
 * HARD CONSTRAINT: TaskPhase-based monotonic progression
 * - ORIENT phase: Show intro message (once)
 * - DISCOVERY phase: GPT asks max 3 diagnostic questions
 * - INTAKE phase: Collect 4 required fields deterministically
 * - SCHEDULING phase: Display time slots, capture selection
 * - CONFIRMED phase: TERMINAL - task complete, input disabled
 */
export async function routeConversationEnhanced(
  userInput: string,
  currentState: ConversationState,
  sessionData: SessionData
): Promise<EnhancedChatResponse> {
  // Initialize required session data structures
  if (!sessionData.intakeMode) {
    const { initializeIntakeMode } = require('./intakeMode');
    sessionData.intakeMode = initializeIntakeMode();
  }
  
  if (sessionData.bootstrapCompleted === undefined) {
    sessionData.bootstrapCompleted = false;
  }
  
  if (!sessionData.conversationHistory || !Array.isArray(sessionData.conversationHistory)) {
    sessionData.conversationHistory = [];
  }

  // CRITICAL: Initialize to ORIENT phase
  if (!sessionData.phase) {
    sessionData.phase = 'ORIENT';
    sessionData.orientCompleted = false;
    sessionData.discoveryTurns = 0;
    console.log('[Router] Initialized to ORIENT phase');
  }

  // LEGACY: Initialize mode for backwards compatibility
  if (!sessionData.mode) {
    sessionData.mode = 'DIAGNOSTIC';
  }

  // 🛑 TERMINAL STATE: CONFIRMED phase blocks ALL execution
  if (sessionData.phase === 'CONFIRMED') {
    console.log('[Router] CONFIRMED phase - task complete, blocking all execution');
    
    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );
    
    return {
      message: "Your consultation is confirmed. We'll meet at your scheduled time. Thank you!",
      nextState: 'CLOSED',
      sessionData,
      requiresInput: false, // Disable input
      metadata
    };
  }

  // 🔄 Evaluate task transition (Shadow AI logic)
  const taskEvaluation = evaluateTaskTransition(
    sessionData.phase,
    sessionData,
    userInput
  );

  console.log(`[Router] Task evaluation: phase=${sessionData.phase}, action=${taskEvaluation.action}, nextPhase=${taskEvaluation.nextPhase}`);

  // Handle SCHEDULING phase
  if (sessionData.phase === 'SCHEDULING') {
    console.log('[Router] SCHEDULING phase - handling time slot selection');
    
    const schedulingResult = await handleScheduling(sessionData, userInput);
    
    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );
    
    if (schedulingResult.success) {
      // Slot confirmed - transition to CONFIRMED
      schedulingResult.updatedSessionData.phase = 'CONFIRMED';
      
      return {
        message: schedulingResult.message,
        nextState: 'CLOSED',
        sessionData: schedulingResult.updatedSessionData,
        requiresInput: false,
        metadata
      };
    } else {
      // Invalid selection - show slots again
      return {
        message: schedulingResult.message,
        nextState: 'INFO_PROVIDED',
        sessionData: schedulingResult.updatedSessionData,
        requiresInput: true,
        metadata
      };
    }
  }

  // Handle phase transition actions
  if (taskEvaluation.action === 'schedule') {
    // Transition to SCHEDULING - show time slots
    console.log('[Router] Transitioning to SCHEDULING phase');
    sessionData.phase = 'SCHEDULING';
    
    const slots = generateAvailableSlots();
    const slotsMessage = formatTimeSlotsMessage(slots);
    
    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );
    
    return {
      message: slotsMessage,
      nextState: 'INFO_PROVIDED',
      sessionData,
      requiresInput: true,
      metadata
    };
  }

  if (taskEvaluation.action === 'transition') {
    // Force phase transition (e.g., DISCOVERY → INTAKE)
    console.log(`[Router] Forcing transition: ${sessionData.phase} → ${taskEvaluation.nextPhase}`);
    sessionData.phase = taskEvaluation.nextPhase;
    
    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );
    
    return {
      message: taskEvaluation.message || "Let's move forward.",
      nextState: 'INFO_PROVIDED',
      sessionData,
      requiresInput: true,
      metadata
    };
  }

  // Update phase if changed
  if (taskEvaluation.nextPhase !== sessionData.phase) {
    if (validatePhaseTransition(sessionData.phase!, taskEvaluation.nextPhase)) {
      console.log(`[Router] Phase transition: ${sessionData.phase} → ${taskEvaluation.nextPhase}`);
      sessionData.phase = taskEvaluation.nextPhase;
    } else {
      console.warn(`[Router] Rejected invalid phase regression: ${sessionData.phase} → ${taskEvaluation.nextPhase}`);
    }
  }

  // ORIENT phase: Show intro message (once)
  if (sessionData.phase === 'ORIENT' && !sessionData.orientCompleted) {
    console.log('[Router] ORIENT phase - showing intro message');
    sessionData.orientCompleted = true;
    sessionData.phase = 'DISCOVERY'; // Auto-transition to DISCOVERY
    
    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );
    
    return {
      message: "I'll ask a few questions to get you set up and schedule your consultation. What brings you here today?",
      nextState: 'INFO_PROVIDED',
      sessionData,
      requiresInput: true,
      metadata
    };
  }

  // DISCOVERY phase: GPT-driven diagnostic questions (max 3 turns)
  if (sessionData.phase === 'DISCOVERY') {
    console.log(`[Router] DISCOVERY phase - turn ${sessionData.discoveryTurns || 0}/3`);
    
    // Try intelligence layer (GPT)
    const intelligentResponse = await applyIntelligence(
      userInput,
      currentState,
      sessionData
    );
    
    if (intelligentResponse) {
      // Increment discovery turn counter
      sessionData.discoveryTurns = (sessionData.discoveryTurns || 0) + 1;
      
      // Check if we've hit max turns
      if (sessionData.discoveryTurns >= 3) {
        console.log('[Router] Discovery limit reached - forcing INTAKE');
        sessionData.phase = 'INTAKE';
      }
      
      const metadata = generateMetadata(
        sessionData.intakeMode,
        null,
        false
      );
      
      return {
        ...intelligentResponse,
        sessionData, // Include updated session with counter
        metadata
      };
    }
    
    // Fallback if GPT fails
    sessionData.phase = 'INTAKE';
    console.log('[Router] Intelligence layer failed - forcing INTAKE');
  }

  // INTAKE phase: Deterministic field collection (NO GPT)
  // INTAKE phase: Deterministic field collection (NO GPT)
  if (sessionData.phase === 'INTAKE') {
    console.log('[Router] INTAKE phase - Golden Frames enabled for field collection');

    // Try to detect applicable Golden Frame
    const detectedFrame = detectGoldenFrame(
      userInput,
      sessionData.intakeMode,
      sessionData
    );

    // If Golden Frame applies, execute it
    if (detectedFrame !== null) {
      try {
        // Validate state before execution
        const { validateIntakeState } = require('./intakeMode');
        try {
          validateIntakeState(sessionData.intakeMode);
        } catch (validationError) {
          // State corruption detected - roll back
          console.error('State validation failed before frame execution:', validationError);
          sessionData.intakeMode = {
            ...sessionData.intakeMode,
            mode: 'QUALIFICATION',
            currentField: null,
            userConsent: null
          };
          throw validationError;
        }

        const frameResult = executeGoldenFrame(
          detectedFrame,
          userInput,
          sessionData.intakeMode,
          sessionData
        );

        // Update session data
        sessionData = frameResult.updatedSessionData;
        sessionData.intakeMode = frameResult.updatedIntakeState;

        // Validate state after execution
        try {
          validateIntakeState(sessionData.intakeMode);
        } catch (validationError) {
          console.error('State validation failed after frame execution:', validationError);
          sessionData.intakeMode = {
            ...sessionData.intakeMode,
            mode: 'QUALIFICATION',
            currentField: null,
            userConsent: null
          };
          throw validationError;
        }

        // Determine next state
        let nextState: ConversationState = currentState;
        
        if (detectedFrame === 0) {
          nextState = currentState;
        } else if (detectedFrame === 61) {
          if (frameResult.updatedIntakeState.userConsent === 'confirmed') {
            nextState = 'INTAKE_COLLECTION';
          } else if (frameResult.updatedIntakeState.userConsent === 'declined') {
            nextState = 'SUMMARY';
          } else {
            nextState = 'INTAKE_TRANSITION';
          }
        } else if (detectedFrame === 62) {
          if (frameResult.response.nextAction === 'complete_field') {
            nextState = 'SUMMARY';
          } else if (frameResult.response.nextAction === 'escalate') {
            nextState = 'ESCALATION';
          } else {
            nextState = 'INTAKE_COLLECTION';
          }
        }

        const metadata = generateMetadata(
          frameResult.updatedIntakeState,
          detectedFrame === 0 ? null : detectedFrame,
          frameResult.response.nextAction === 'escalate'
        );

        return {
          message: frameResult.response.message,
          nextState,
          sessionData,
          requiresInput: frameResult.response.requiresInput,
          metadata
        };
      } catch (error) {
        console.error('Golden Frame execution failed:', error);
        throw new Error(`Golden Frame ${detectedFrame} execution failed: ${(error as Error).message}`);
      }
    }

    // No Golden Frame - fallback to standard routing
    const qualificationResponse = routeQualification(
      userInput,
      currentState,
      sessionData
    );

    const metadata = generateMetadata(
      sessionData.intakeMode,
      null,
      false
    );

    return {
      ...qualificationResponse,
      metadata
    };
  }

  // Fallback: Should not reach here
  console.warn('[Router] Unexpected state - falling back to qualification flow');
  const qualificationResponse = routeQualification(
    userInput,
    currentState,
    sessionData
  );

  const metadata = generateMetadata(
    sessionData.intakeMode,
    null,
    false
  );

  return {
    ...qualificationResponse,
    metadata
  };
}

/**
 * Get initial welcome message with task-based intro
 */
export function getWelcomeMessageEnhanced(): EnhancedChatResponse {
  const { initializeIntakeMode } = require('./intakeMode');
  
  const sessionData: SessionData = {
    phase: 'ORIENT',
    orientCompleted: false,
    discoveryTurns: 0,
    mode: 'DIAGNOSTIC',
    intakeMode: initializeIntakeMode(),
    bootstrapCompleted: false,
    conversationHistory: [],
    consultation: {}
  };

  const metadata = generateMetadata(
    sessionData.intakeMode,
    null,
    false
  );

  return {
    message: "I'll ask a few questions to get you set up and schedule your consultation. What brings you here today?",
    nextState: 'WELCOME',
    sessionData,
    requiresInput: true,
    metadata
  };
}
