/**
 * Intake Mode Infrastructure
 * Hard-gated field collection with Golden Frame enforcement
 */

export type ConversationMode = 'QUALIFICATION' | 'INTAKE_ACTIVE' | 'INTAKE_PAUSED';

export type FieldStatus = 'unasked' | 'in_progress' | 'completed' | 'skipped';

export type GoldenFrameId = 
  | 61  // Qualification → Intake Transition
  | 62; // Client Name Collection

export interface IntakeModeState {
  mode: ConversationMode;
  currentField: string | null;
  fieldStatusMap: Record<string, FieldStatus>;
  fieldsCollected: Record<string, any>;
  userConsent: 'pending' | 'confirmed' | 'declined' | null;
  transitionTimestamp: number | null;
  intakeStarted: boolean;
}

export interface ConversationMetadata {
  mode: ConversationMode;
  frame_id: GoldenFrameId | null;
  currentField: string | null;
  fieldStatus: FieldStatus | null;
  escalation: boolean;
  toneScore: number | null; // Reserved for future
  transitionTrigger?: string;
  userConsent?: 'pending' | 'confirmed' | 'declined';
}

/**
 * Initialize intake mode state
 */
export function initializeIntakeMode(): IntakeModeState {
  return {
    mode: 'QUALIFICATION',
    currentField: null,
    fieldStatusMap: {},
    fieldsCollected: {},
    userConsent: null,
    transitionTimestamp: null,
    intakeStarted: false
  };
}

/**
 * Transition to Intake Mode (Golden Frame 61)
 * HARD CONSTRAINT: Can only be called after explicit user consent
 */
export function transitionToIntake(
  intakeState: IntakeModeState,
  userConsented: boolean
): IntakeModeState {
  if (!userConsented) {
    // User declined consent - remain in qualification
    return {
      ...intakeState,
      userConsent: 'declined'
    };
  }

  // User confirmed consent - transition to intake
  // NOTE: currentField will be set to first field immediately by Frame 62
  return {
    ...intakeState,
    mode: 'INTAKE_ACTIVE',
    userConsent: 'confirmed',
    transitionTimestamp: Date.now(),
    intakeStarted: true,
    currentField: null // Temporary - Frame 62 sets this immediately
  };
}

/**
 * HARD CONSTRAINT VALIDATOR: INTAKE_ACTIVE requires currentField
 * Throws if invariant is violated
 */
export function validateIntakeState(intakeState: IntakeModeState): void {
  if (intakeState.mode === 'INTAKE_ACTIVE' && intakeState.currentField === null) {
    throw new Error(
      'INVARIANT VIOLATION: INTAKE_ACTIVE mode requires currentField to be set. ' +
      'State corruption detected. Rolling back to QUALIFICATION.'
    );
  }
}

/**
 * Pause intake mode
 */
export function pauseIntake(intakeState: IntakeModeState): IntakeModeState {
  if (intakeState.mode !== 'INTAKE_ACTIVE') {
    throw new Error('Cannot pause intake - not in INTAKE_ACTIVE mode');
  }

  return {
    ...intakeState,
    mode: 'INTAKE_PAUSED'
  };
}

/**
 * Resume intake mode
 */
export function resumeIntake(intakeState: IntakeModeState): IntakeModeState {
  if (intakeState.mode !== 'INTAKE_PAUSED') {
    throw new Error('Cannot resume intake - not in INTAKE_PAUSED mode');
  }

  return {
    ...intakeState,
    mode: 'INTAKE_ACTIVE'
  };
}

/**
 * Set field status
 */
export function setFieldStatus(
  intakeState: IntakeModeState,
  fieldName: string,
  status: FieldStatus
): IntakeModeState {
  return {
    ...intakeState,
    fieldStatusMap: {
      ...intakeState.fieldStatusMap,
      [fieldName]: status
    }
  };
}

/**
 * Set current field
 */
export function setCurrentField(
  intakeState: IntakeModeState,
  fieldName: string | null
): IntakeModeState {
  return {
    ...intakeState,
    currentField: fieldName
  };
}

/**
 * Store field value
 * HARD CONSTRAINT: Only accepts explicit user input, no speculation
 */
export function storeFieldValue(
  intakeState: IntakeModeState,
  fieldName: string,
  value: any
): IntakeModeState {
  return {
    ...intakeState,
    fieldsCollected: {
      ...intakeState.fieldsCollected,
      [fieldName]: value
    },
    fieldStatusMap: {
      ...intakeState.fieldStatusMap,
      [fieldName]: 'completed'
    }
  };
}

/**
 * Get field value
 */
export function getFieldValue(
  intakeState: IntakeModeState,
  fieldName: string
): any {
  return intakeState.fieldsCollected[fieldName] ?? null;
}

/**
 * Get field status
 */
export function getFieldStatus(
  intakeState: IntakeModeState,
  fieldName: string
): FieldStatus {
  return intakeState.fieldStatusMap[fieldName] ?? 'unasked';
}

/**
 * Check if intake mode is active
 */
export function isIntakeModeActive(intakeState: IntakeModeState): boolean {
  return intakeState.mode === 'INTAKE_ACTIVE';
}

/**
 * Check if user has consented to intake
 */
export function hasUserConsented(intakeState: IntakeModeState): boolean {
  return intakeState.userConsent === 'confirmed';
}

/**
 * Generate metadata for observability
 * REQUIRED for Shadow AI and Form Stress Test
 */
export function generateMetadata(
  intakeState: IntakeModeState,
  frameId: GoldenFrameId | null,
  escalation: boolean = false
): ConversationMetadata {
  const currentFieldStatus = intakeState.currentField 
    ? getFieldStatus(intakeState, intakeState.currentField)
    : null;

  return {
    mode: intakeState.mode,
    frame_id: frameId,
    currentField: intakeState.currentField,
    fieldStatus: currentFieldStatus,
    escalation,
    toneScore: null, // Reserved for future implementation
    ...(intakeState.transitionTimestamp && {
      transitionTrigger: 'Golden Frame 61'
    }),
    ...(intakeState.userConsent && {
      userConsent: intakeState.userConsent
    })
  };
}
