/**
 * Golden Frame Dispatcher
 * HARD CONSTRAINT: All responses MUST come from Golden Frames
 * NO fallback responses allowed
 */

import { IntakeModeState, initializeIntakeMode } from './intakeMode';
import { SessionData } from './state';

export type GoldenFrameId = 0 | 61 | 62;

export interface GoldenFrameResponse {
  message: string;
  frameId: GoldenFrameId;
  nextAction: 'await_consent' | 'collect_field' | 'escalate' | 'complete_field' | 'bootstrap_complete';
  requiresInput: boolean;
}

export interface GoldenFrameExecutionResult {
  response: GoldenFrameResponse;
  updatedIntakeState: IntakeModeState;
  updatedSessionData: SessionData;
}

/**
 * Golden Frame 00: Conversation Bootstrap
 * Executes ONCE per session at session start
 * Establishes business identity, assistant role, and no-pressure tone
 * HARD CONSTRAINT: Must NOT collect data, ask questions, or transition to intake
 */
export function executeFrame00(
  sessionData: SessionData
): GoldenFrameExecutionResult {
  // HARD CONSTRAINT: Frame 00 can only execute if bootstrap is NOT already completed
  if (sessionData.bootstrapCompleted) {
    throw new Error('Frame 00 cannot execute: bootstrap already completed');
  }

  // Website/Business Context (injected once)
  const businessName = 'Innovation Business Development Solutions';
  
  const bootstrapMessage = `I'll ask a few questions to get you set up and schedule your consultation. What brings you here today?`;

  return {
    response: {
      message: bootstrapMessage,
      frameId: 0,
      nextAction: 'bootstrap_complete',
      requiresInput: true
    },
    updatedIntakeState: sessionData.intakeMode || initializeIntakeMode(),
    updatedSessionData: {
      ...sessionData,
      bootstrapCompleted: true
    }
  };
}

/**
 * Golden Frame 61: Qualification → Intake Transition
 * Triggers when user signals INTENT TO PROCEED (not curiosity)
 * HARD CONSTRAINT: Must distinguish readiness from procedural questions
 */
export function executeFrame61(
  intakeState: IntakeModeState,
  sessionData: SessionData,
  userInput: string
): GoldenFrameExecutionResult {
  const lowerInput = userInput.toLowerCase();

  // CURIOSITY SIGNALS (questions about process, not intent to start)
  const curiositySignals = [
    'what information do you need',
    'what do you need from me',
    'how does this work',
    'how does the intake work',
    'how long does',
    'what happens after',
    'can i stop',
    'what\'s the intake process',
    'tell me about intake'
  ];

  // READINESS SIGNALS (clear intent to proceed)
  const readinessSignals = [
    "i'm ready",
    'ready to fill out',
    'ready to start',
    'ready to move forward',
    'ready to begin',
    "let's do the paperwork",
    "let's fill out",
    "let's get started",
    "let's do it",
    "let's start",
    'ready to proceed'
  ];

  const isCuriosity = curiositySignals.some(signal => lowerInput.includes(signal));
  const isReadySignal = readinessSignals.some(signal => lowerInput.includes(signal));

  // If curiosity signal detected and no pending consent, reject Frame 61
  if (isCuriosity && intakeState.userConsent !== 'pending') {
    throw new Error('Frame 61 triggered on curiosity signal (not readiness)');
  }

  if (!isReadySignal && intakeState.userConsent === null) {
    // No clear readiness signal - should not trigger Frame 61
    throw new Error('Frame 61 triggered without readiness signal');
  }

  // Check if this is consent response
  if (intakeState.userConsent === 'pending') {
    // User is responding to consent request
    
    // AMBIGUOUS RESPONSES (uncertainty signals) - must clarify, never infer consent
    const ambiguousResponses = [
      'i guess',
      'i think',
      'maybe',
      'i suppose',
      'sure...',
      'ok...',
      'i think so',
      'probably',
      'can we try'
    ];

    const isAmbiguous = ambiguousResponses.some(resp => lowerInput.includes(resp));
    
    if (isAmbiguous) {
      // Ambiguous - re-ask for explicit consent without pressure
      return {
        response: {
          message: "I want to make sure you feel ready. There's no pressure at all — we can start whenever works for you. Should we begin the intake process now?",
          frameId: 61,
          nextAction: 'await_consent',
          requiresInput: true
        },
        updatedIntakeState: {
          ...intakeState,
          userConsent: 'pending'
        },
        updatedSessionData: sessionData
      };
    }

    // NEGATIVE RESPONSES
    const negativeResponses = [
      'no', 
      'not yet', 
      'maybe later', 
      'not ready', 
      'wait',
      'do i have to',
      'not now'
    ];
    
    const isNegative = negativeResponses.some(resp => lowerInput.includes(resp));

    if (isNegative) {
      // User declined consent
      return {
        response: {
          message: "No problem at all. Take your time, and feel free to reach out when you're ready. Is there anything else I can help you with today?",
          frameId: 61,
          nextAction: 'complete_field',
          requiresInput: true
        },
        updatedIntakeState: {
          ...intakeState,
          userConsent: 'declined',
          mode: 'QUALIFICATION'
        },
        updatedSessionData: sessionData
      };
    }

    // AFFIRMATIVE RESPONSES (clear and unambiguous)
    const affirmativeResponses = [
      'yes', 
      'yeah',
      'sure', 
      'okay', 
      'ok', 
      'ready', 
      "let's go", 
      'proceed', 
      'continue',
      'yep',
      'yup',
      'absolutely'
    ];
    
    const isAffirmative = affirmativeResponses.some(resp => {
      // Exact match or word boundary match (not partial)
      const pattern = new RegExp(`\\b${resp}\\b`, 'i');
      return pattern.test(lowerInput);
    });

    if (isAffirmative) {
      // User confirmed consent - transition to intake
      return {
        response: {
          message: "Perfect! Let's begin.",
          frameId: 61,
          nextAction: 'collect_field',
          requiresInput: false
        },
        updatedIntakeState: {
          ...intakeState,
          mode: 'INTAKE_ACTIVE',
          userConsent: 'confirmed',
          transitionTimestamp: Date.now(),
          intakeStarted: true
        },
        updatedSessionData: sessionData
      };
    }

    // Unclear response - re-ask consent
    return {
      response: {
        message: "Just to confirm — are you ready to begin the intake process now?",
        frameId: 61,
        nextAction: 'await_consent',
        requiresInput: true
      },
      updatedIntakeState: {
        ...intakeState,
        userConsent: 'pending'
      },
      updatedSessionData: sessionData
    };
  }

  // Initial transition request
  const transitionMessage = `Great! It sounds like you're ready to move forward.

I'd like to shift into our intake process now. This means I'll ask you a series of structured questions to collect the information needed for your business formation. You can pause anytime, and it's totally fine if you don't know every answer — we can mark those and circle back.

We'll start with your contact information and business name ideas, then move through entity details. Most people take about 10-15 minutes, but there's no rush.

Are you ready to begin?`;

  return {
    response: {
      message: transitionMessage,
      frameId: 61,
      nextAction: 'await_consent',
      requiresInput: true
    },
    updatedIntakeState: {
      ...intakeState,
      userConsent: 'pending'
    },
    updatedSessionData: sessionData
  };
}

/**
 * Golden Frame 62: Client Name Collection
 * Collects full legal name and preferred name
 */
export function executeFrame62(
  intakeState: IntakeModeState,
  sessionData: SessionData,
  userInput: string | null
): GoldenFrameExecutionResult {
  // HARD CONSTRAINT: Can only execute in INTAKE_ACTIVE mode
  if (intakeState.mode !== 'INTAKE_ACTIVE') {
    throw new Error('Frame 62 requires INTAKE_ACTIVE mode');
  }

  // HARD CONSTRAINT: User must have consented
  if (intakeState.userConsent !== 'confirmed') {
    throw new Error('Frame 62 requires confirmed user consent');
  }

  const currentField = intakeState.currentField;
  const fullLegalName = intakeState.fieldsCollected['fullLegalName'];
  const preferredName = intakeState.fieldsCollected['preferredName'];

  // Initial request for legal name
  if (!currentField || currentField === 'full_legal_name') {
    if (!userInput) {
      // First time asking
      const initialMessage = `Perfect, let's start with your name.

We'll need your full legal name as it appears on official documents like your driver's license or passport. This is what will be used for state filings and formation paperwork.

What's your full legal name?`;

      return {
        response: {
          message: initialMessage,
          frameId: 62,
          nextAction: 'collect_field',
          requiresInput: true
        },
        updatedIntakeState: {
          ...intakeState,
          currentField: 'full_legal_name',
          fieldStatusMap: {
            ...intakeState.fieldStatusMap,
            'full_legal_name': 'in_progress'
          }
        },
        updatedSessionData: sessionData
      };
    }

    // Handle "why do you need this?"
    if (userInput.toLowerCase().includes('why') && userInput.toLowerCase().includes('need')) {
      const explanationMessage = `Your legal name goes on the official state filing — it just needs to match your ID. 

What's your full legal name?`;

      return {
        response: {
          message: explanationMessage,
          frameId: 62,
          nextAction: 'collect_field',
          requiresInput: true
        },
        updatedIntakeState: intakeState,
        updatedSessionData: sessionData
      };
    }

    // Handle privacy concerns
    if (userInput.toLowerCase().includes('not comfortable') || userInput.toLowerCase().includes("don't feel comfortable")) {
      const privacyMessage = `I completely understand. Your legal name is required for state filings. This information stays private with our team.

Would you like to continue, or would you prefer to provide this later?`;

      return {
        response: {
          message: privacyMessage,
          frameId: 62,
          nextAction: 'collect_field',
          requiresInput: true
        },
        updatedIntakeState: intakeState,
        updatedSessionData: sessionData
      };
    }

    // Handle partial name (first name only)
    const words = userInput.trim().split(/\s+/);
    if (words.length === 1) {
      const partialMessage = `Thanks, ${userInput}. And your last name?`;

      return {
        response: {
          message: partialMessage,
          frameId: 62,
          nextAction: 'collect_field',
          requiresInput: true
        },
        updatedIntakeState: intakeState,
        updatedSessionData: sessionData
      };
    }

    // Check if user provided both legal and preferred name
    const bothNamesPattern = /(my (?:legal )?name is|legal name is|i'm|i am) (.+?) but (?:i (?:go by|prefer)|call me|use) (.+)/i;
    const match = userInput.match(bothNamesPattern);
    
    if (match) {
      const legalName = match[2].trim();
      const preferred = match[3].trim();

      const confirmBothMessage = `Got it, ${preferred}. I'll use ${preferred} going forward.`;

      return {
        response: {
          message: confirmBothMessage,
          frameId: 62,
          nextAction: 'complete_field',
          requiresInput: false
        },
        updatedIntakeState: {
          ...intakeState,
          currentField: null,
          fieldsCollected: {
            ...intakeState.fieldsCollected,
            'fullLegalName': legalName,
            'preferredName': preferred
          },
          fieldStatusMap: {
            ...intakeState.fieldStatusMap,
            'full_legal_name': 'completed',
            'preferred_name': 'completed'
          }
        },
        updatedSessionData: sessionData
      };
    }

    // Store legal name and ask about preferred name
    const firstWord = words[0];
    const preferredMessage = `Thanks, ${firstWord}. If you go by a different name day-to-day — maybe a nickname, middle name, or just a shortened version — I'm happy to use that instead. It's totally optional.

Is there a name you'd prefer I use, or should I stick with ${firstWord}?`;

    return {
      response: {
        message: preferredMessage,
        frameId: 62,
        nextAction: 'collect_field',
        requiresInput: true
      },
      updatedIntakeState: {
        ...intakeState,
        currentField: 'preferred_name',
        fieldsCollected: {
          ...intakeState.fieldsCollected,
          'fullLegalName': userInput.trim()
        },
        fieldStatusMap: {
          ...intakeState.fieldStatusMap,
          'full_legal_name': 'completed',
          'preferred_name': 'in_progress'
        }
      },
      updatedSessionData: sessionData
    };
  }

  // Collecting preferred name
  if (currentField === 'preferred_name' && userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // User declines preferred name
    if (lowerInput.includes('no') || lowerInput.includes('just use') || lowerInput.includes("that's fine")) {
      const legalNameWords = fullLegalName?.split(/\s+/) || [];
      const firstName = legalNameWords[0] || 'there';

      const confirmMessage = `Sounds good, ${firstName}.`;

      return {
        response: {
          message: confirmMessage,
          frameId: 62,
          nextAction: 'complete_field',
          requiresInput: false
        },
        updatedIntakeState: {
          ...intakeState,
          currentField: null,
          fieldsCollected: {
            ...intakeState.fieldsCollected,
            'preferredName': null
          },
          fieldStatusMap: {
            ...intakeState.fieldStatusMap,
            'preferred_name': 'completed'
          }
        },
        updatedSessionData: sessionData
      };
    }

    // User provides preferred name
    const preferredNameValue = userInput.trim();
    const confirmMessage = `Got it, ${preferredNameValue}. I'll use ${preferredNameValue} going forward.`;

    return {
      response: {
        message: confirmMessage,
        frameId: 62,
        nextAction: 'complete_field',
        requiresInput: false
      },
      updatedIntakeState: {
        ...intakeState,
        currentField: null,
        fieldsCollected: {
          ...intakeState.fieldsCollected,
          'preferredName': preferredNameValue
        },
        fieldStatusMap: {
          ...intakeState.fieldStatusMap,
          'preferred_name': 'completed'
        }
      },
      updatedSessionData: sessionData
    };
  }

  // Should not reach here
  throw new Error('Frame 62 execution reached invalid state');
}

/**
 * Detect which Golden Frame should handle the input
 * HARD CONSTRAINT: If no frame applies, FAIL - do not improvise
 */
export function detectGoldenFrame(
  userInput: string | null,
  intakeState: IntakeModeState,
  sessionData: SessionData
): GoldenFrameId | null {
  // Frame 00: Bootstrap (session start)
  // HARD CONSTRAINT: Must execute if bootstrap not completed (even with no user input)
  if (!sessionData.bootstrapCompleted) {
    return 0;
  }

  // If no user input provided after bootstrap, no frame applies
  if (!userInput) {
    return null;
  }

  // Frame 62: Active intake name collection
  if (intakeState.mode === 'INTAKE_ACTIVE' && 
      (intakeState.currentField === 'full_legal_name' || intakeState.currentField === 'preferred_name')) {
    return 62;
  }

  // Frame 61: Transition to intake
  // HARD CONSTRAINT: Only trigger on READINESS (intent to proceed), not CURIOSITY
  if (intakeState.mode === 'QUALIFICATION' || intakeState.userConsent === 'pending') {
    const lowerInput = userInput.toLowerCase();

    // CURIOSITY SIGNALS - do NOT trigger Frame 61
    const curiositySignals = [
      'what information do you need',
      'what do you need from me',
      'how does this work',
      'how does the intake work',
      'how long does',
      'what happens after',
      'can i stop',
      'what\'s the intake process',
      'tell me about intake'
    ];

    const isCuriosity = curiositySignals.some(signal => lowerInput.includes(signal));
    
    // If curiosity detected and no pending consent, do NOT trigger Frame 61
    if (isCuriosity && intakeState.userConsent !== 'pending') {
      return null;
    }

    // READINESS SIGNALS - trigger Frame 61
    const readinessSignals = [
      "i'm ready",
      'ready to fill out',
      'ready to start',
      'ready to move forward',
      'ready to begin',
      "let's do the paperwork",
      "let's fill out",
      "let's get started",
      "let's do it",
      "let's start",
      'ready to proceed'
    ];

    const matchesReadiness = readinessSignals.some(signal => lowerInput.includes(signal));
    
    // Trigger on readiness OR if awaiting consent response
    if (matchesReadiness || intakeState.userConsent === 'pending') {
      return 61;
    }
  }

  // Frame 62: First field after consent confirmed
  if (intakeState.mode === 'INTAKE_ACTIVE' && 
      intakeState.userConsent === 'confirmed' && 
      !intakeState.currentField) {
    return 62;
  }

  // No frame applies
  return null;
}

/**
 * Execute Golden Frame
 * HARD CONSTRAINT: All responses must come from frames
 */
export function executeGoldenFrame(
  frameId: GoldenFrameId,
  userInput: string | null,
  intakeState: IntakeModeState,
  sessionData: SessionData
): GoldenFrameExecutionResult {
  switch (frameId) {
    case 0:
      // Frame 00: Bootstrap (no user input required)
      return executeFrame00(sessionData);
      
    case 61:
      if (userInput === null) {
        throw new Error('Frame 61 requires user input');
      }
      return executeFrame61(intakeState, sessionData, userInput);
      
    case 62:
      return executeFrame62(intakeState, sessionData, userInput);
      
    default:
      throw new Error(`Unknown Golden Frame ID: ${frameId}`);
  }
}
