/**
 * Shadow AI - Deterministic Task Enforcement Logic
 * NO LLM calls - purely rule-based
 * 
 * PURPOSE: Enforce strict task progression and prevent loops
 * CRITICAL: This chatbot OWNS the task end-to-end, NO handoff
 */

import { SessionData, TaskPhase } from './state';
import {
  shouldEnterScheduling,
  generateAvailableSlots,
  detectTimeSlotSelection,
  confirmTimeSlot,
  formatTimeSlotsMessage,
  persistConsultationWithSchedule,
  getSchedulingConfirmationMessage
} from './scheduling';

/**
 * Required fields for INTAKE phase
 */
const REQUIRED_INTAKE_FIELDS = [
  'userName',
  'userEmail',
  'businessType',
  'businessGoal'
] as const;

/**
 * Check if all required INTAKE fields are collected
 */
export function hasAllIntakeFields(sessionData: SessionData): boolean {
  if (!sessionData.consultation) return false;
  
  return REQUIRED_INTAKE_FIELDS.every(field => {
    const value = sessionData.consultation?.[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Enforce monotonic task phase progression (NO regression)
 * ORIENT → DISCOVERY → INTAKE → SCHEDULING → CONFIRMED
 */
export function evaluateTaskTransition(
  currentPhase: TaskPhase | undefined,
  sessionData: SessionData,
  userInput: string
): {
  nextPhase: TaskPhase;
  action: 'continue' | 'transition' | 'schedule' | 'confirm' | 'block';
  message?: string;
} {
  // Initialize to ORIENT if not set
  const phase = currentPhase || 'ORIENT';
  
  // CONFIRMED is terminal - block all execution
  if (phase === 'CONFIRMED') {
    return {
      nextPhase: 'CONFIRMED',
      action: 'block',
      message: 'Your consultation is confirmed. We\'ll see you at your scheduled time!'
    };
  }
  
  // SCHEDULING phase - waiting for time slot selection
  if (phase === 'SCHEDULING') {
    const slotNumber = detectTimeSlotSelection(userInput);
    
    if (slotNumber !== null) {
      // User selected a slot
      return {
        nextPhase: 'CONFIRMED',
        action: 'confirm'
      };
    }
    
    // Still waiting for slot selection
    return {
      nextPhase: 'SCHEDULING',
      action: 'continue',
      message: 'Please select a time slot by number (e.g., "1" or "slot 2").'
    };
  }
  
  // INTAKE phase - check if all fields collected
  if (phase === 'INTAKE') {
    if (hasAllIntakeFields(sessionData)) {
      // All intake fields collected → move to SCHEDULING
      return {
        nextPhase: 'SCHEDULING',
        action: 'schedule'
      };
    }
    
    // Continue collecting intake fields
    return {
      nextPhase: 'INTAKE',
      action: 'continue'
    };
  }
  
  // DISCOVERY phase - enforce max 3 turns
  if (phase === 'DISCOVERY') {
    const turns = sessionData.discoveryTurns || 0;
    
    if (turns >= 3) {
      // Max discovery turns reached → force INTAKE
      return {
        nextPhase: 'INTAKE',
        action: 'transition',
        message: 'Let\'s get your consultation scheduled. I\'ll need a few details.'
      };
    }
    
    // Continue discovery
    return {
      nextPhase: 'DISCOVERY',
      action: 'continue'
    };
  }
  
  // ORIENT phase - transition to DISCOVERY
  if (phase === 'ORIENT') {
    return {
      nextPhase: 'DISCOVERY',
      action: 'transition'
    };
  }
  
  // Default: stay in current phase
  return {
    nextPhase: phase,
    action: 'continue'
  };
}

/**
 * Handle SCHEDULING phase - present time slots and process selection
 */
export async function handleScheduling(
  sessionData: SessionData,
  userInput: string
): Promise<{
  success: boolean;
  message: string;
  updatedSessionData: SessionData;
}> {
  const slotNumber = detectTimeSlotSelection(userInput);
  
  if (slotNumber === null) {
    // No valid selection - show slots again
    const slots = generateAvailableSlots();
    return {
      success: false,
      message: formatTimeSlotsMessage(slots),
      updatedSessionData: sessionData
    };
  }
  
  // Validate selection
  const slots = generateAvailableSlots();
  const confirmation = confirmTimeSlot(slotNumber, slots);
  
  if (!confirmation.success) {
    return {
      success: false,
      message: confirmation.error || 'Invalid selection. Please try again.',
      updatedSessionData: sessionData
    };
  }
  
  // Save selected slot
  const selectedSlot = confirmation.selectedSlot!;
  sessionData.consultation = sessionData.consultation || {};
  sessionData.consultation.preferredDate = selectedSlot.date;
  sessionData.consultation.preferredTime = selectedSlot.time;
  sessionData.consultation.scheduledSlot = `${selectedSlot.date}T${selectedSlot.time}:00`;
  sessionData.consultation.confirmedAt = Date.now();
  
  // Persist consultation
  await persistConsultationWithSchedule(sessionData);
  
  return {
    success: true,
    message: getSchedulingConfirmationMessage(
      sessionData.consultation.userName || 'there',
      selectedSlot,
      `CONSULT_${sessionData.consultation.confirmedAt}`
    ),
    updatedSessionData: sessionData
  };
}

/**
 * Get diagnostic message about task status
 */
export function getTaskStatus(sessionData: SessionData): {
  phase: TaskPhase;
  isComplete: boolean;
  missingFields: string[];
  nextAction: string;
} {
  const phase = sessionData.phase || 'ORIENT';
  const allFields = hasAllIntakeFields(sessionData);
  const hasSchedule = Boolean(sessionData.consultation?.scheduledSlot);
  
  const missingFields = REQUIRED_INTAKE_FIELDS.filter(field => {
    const value = sessionData.consultation?.[field];
    return !value || value === '';
  });
  
  let nextAction = '';
  if (phase === 'ORIENT') nextAction = 'Show intro';
  else if (phase === 'DISCOVERY') nextAction = 'Ask diagnostic questions';
  else if (phase === 'INTAKE') nextAction = 'Collect intake fields';
  else if (phase === 'SCHEDULING') nextAction = 'Select time slot';
  else if (phase === 'CONFIRMED') nextAction = 'Task complete';
  
  return {
    phase,
    isComplete: phase === 'CONFIRMED',
    missingFields,
    nextAction
  };
}

/**
 * Prevent phase regression - enforce monotonic progression
 */
export function validatePhaseTransition(
  currentPhase: TaskPhase,
  nextPhase: TaskPhase
): boolean {
  const phaseOrder: TaskPhase[] = ['ORIENT', 'DISCOVERY', 'INTAKE', 'SCHEDULING', 'CONFIRMED'];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  const nextIndex = phaseOrder.indexOf(nextPhase);
  
  // Allow staying in same phase or moving forward only
  return nextIndex >= currentIndex;
}
