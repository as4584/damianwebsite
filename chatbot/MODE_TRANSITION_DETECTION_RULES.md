# Mode Transition Detection Rules — Testing Protocol

**Version**: 1.0  
**Purpose**: Define testable signals for Shadow AI and Form Stress Test to detect Intake Mode activation  
**Scope**: Conversation-log-based detection only (no code inspection)

---

## OVERVIEW

Shadow AI and Form Stress Test must be able to **observe Intake Mode transitions** through conversation logs alone, without access to internal system state.

This document defines:
1. What signals indicate Intake Mode has started
2. What counts as a successful transition
3. What counts as a failed transition
4. How to detect mode state from conversation text

---

## MODE STATE SIGNALS (REQUIRED)

### Explicit Metadata Signals

The chatbot MUST emit explicit mode state in conversation metadata:

```json
{
  "conversationMode": "QUALIFICATION" | "INTAKE_ACTIVE" | "INTAKE_PAUSED",
  "transitionTimestamp": "ISO-8601 timestamp",
  "transitionTrigger": "Golden Frame 61" | "user_request" | "qualification_complete",
  "userConsent": "pending" | "confirmed" | "declined"
}
```

**Detection Rule for Shadow AI/Form Stress Test**:
- If `conversationMode` changes from `QUALIFICATION` → `INTAKE_ACTIVE`, transition detected
- If `userConsent` = `confirmed`, transition is valid
- If `userConsent` = `declined`, transition failed (user rejected)

---

## CONVERSATION TEXT SIGNALS (FALLBACK)

If metadata is unavailable, mode transition can be detected from conversation text.

### Transition Indicator Phrases (Chatbot Messages)

The chatbot message that triggers transition MUST contain:

1. **Mode Acknowledgment** (at least one):
   - "shift into our intake process"
   - "move to structured questions"
   - "begin the intake"
   - "collect your information"
   - "start the application"

2. **Consent Request** (required):
   - "Are you ready to proceed?"
   - "Would you like to begin?"
   - "Should we start?"
   - "Are you ready to move forward?"

3. **Explanation** (at least one):
   - "structured questions"
   - "intake process"
   - "information collection"
   - "application form"

**Detection Rule**:
- If chatbot message contains (Mode Acknowledgment + Consent Request + Explanation)
- AND next user message = affirmative ("yes", "ready", "let's do it", "sure")
- THEN transition successful

---

## SUCCESSFUL TRANSITION CRITERIA

### Minimal Success

A transition is **minimally successful** if:

1. **Explicit acknowledgment** that conversation mode is changing
2. **User consent** requested and received
3. **Mode state** changes to `INTAKE_ACTIVE`
4. **Tone remains** ≥4.0/5 during transition

### Optimal Success

A transition is **optimally successful** if all minimal criteria PLUS:

5. **Anxiety reduction** present (pause option mentioned)
6. **Explanation** of what intake entails
7. **Progress preview** (approximate scope or sections)
8. **No pressure** in language (optional framing, "no rush")

---

## FAILED TRANSITION CRITERIA

### Transition Failure Types

#### Type 1: No Transition Detected
- User signals readiness ("I'm ready to fill out the form")
- Chatbot does NOT acknowledge mode shift
- Continues in qualification mode
- **Detection**: No mode state change, no transition language

#### Type 2: Consent Bypassed
- Chatbot moves to intake questions
- WITHOUT asking user permission
- User did not explicitly agree
- **Detection**: Intake questions begin without consent request

#### Type 3: Confusing Transition
- Chatbot language unclear or contradictory
- User doesn't understand mode shift
- User asks "what's happening?" or "what do you mean?"
- **Detection**: User confusion signals after transition attempt

#### Type 4: Pressure-Based Transition
- Chatbot uses urgency or obligation language
- "We need to get this done"
- "This is required to proceed"
- **Detection**: Tone score drops below 4.0 during transition

#### Type 5: Premature Transition
- User still uncertain about entity type or service
- Chatbot pushes to intake anyway
- User not ready (expressed doubt, asked questions)
- **Detection**: User uncertainty signals present before transition

---

## SHADOW AI DETECTION PROTOCOL

### Step 1: Monitor for Transition Triggers

Shadow AI watches for user signals:
- "I'm ready to fill out the form"
- "What information do you need?"
- "Let's move forward"
- Completion of qualification flow

### Step 2: Evaluate Chatbot Response

Check if chatbot response contains:
- [ ] Mode acknowledgment language
- [ ] Consent request
- [ ] Explanation of intake process
- [ ] Anxiety reduction
- [ ] Tone ≥4.0/5

### Step 3: Verify User Consent

Check if user responds with affirmative:
- "Yes"
- "I'm ready"
- "Let's do it"
- "Sure"

NOT affirmative:
- "Maybe later"
- "I'm not sure"
- "What does that mean?"

### Step 4: Confirm Mode Change

Verify:
- [ ] `conversationMode` = `INTAKE_ACTIVE` OR
- [ ] Next chatbot message asks intake-specific question (e.g., "What's your full legal name?")

### Step 5: Log Transition Outcome

```
TRANSITION_DETECTED: true
TRANSITION_SUCCESSFUL: true | false
FAILURE_TYPE: null | "no_transition" | "no_consent" | "confusing" | "pressure" | "premature"
GOLDEN_FRAME_USED: 61 | null
USER_CONSENT: "confirmed" | "declined" | "unclear"
TONE_SCORE: 1-5
```

---

## FORM STRESS TEST DETECTION PROTOCOL

### For Each Simulation

1. **Generate Transition Trigger**
   - Shadow AI simulates user saying "I'm ready to start the intake"

2. **Observe Chatbot Response**
   - Extract chatbot message text
   - Check for transition indicators

3. **Evaluate Transition Quality**
   - Mode acknowledgment present? (yes/no)
   - Consent requested? (yes/no)
   - Explanation provided? (yes/no)
   - Anxiety reduction? (yes/no)
   - Tone acceptable? (≥4.0/5)

4. **Verify Mode Activation**
   - Check metadata: `conversationMode` = `INTAKE_ACTIVE`?
   - OR check if subsequent questions are intake-specific

5. **Record Metrics**
   ```
   TRANSITION_ATTEMPT: true
   TRANSITION_SUCCESS_RATE: (successful / attempted)
   AVG_TRANSITION_TONE: X.X/5
   CONSENT_REQUEST_RATE: (consent_requested / attempted)
   MODE_ACTIVATION_RATE: (mode_changed / attempted)
   ```

---

## INTAKE MODE DETECTION (ONGOING)

Once transition occurs, detect ongoing Intake Mode:

### Metadata Signal
```json
{
  "conversationMode": "INTAKE_ACTIVE",
  "currentField": "full_legal_name" | "business_name_1" | etc.,
  "section": "client_info" | "business_names" | "entity_details" | etc.
}
```

### Text-Based Signal

Chatbot asks **field-specific questions**:
- "What's your full legal name?"
- "What business names are you considering?"
- "Do you have a registered agent?"

These are **NOT** qualification questions (open-ended, exploratory).
These are **structured data requests**.

**Detection Rule**:
- If chatbot asks for specific data point
- AND question maps to known intake field
- AND mode state = `INTAKE_ACTIVE`
- THEN in Intake Mode

---

## MODE EXIT DETECTION

### Pause Signal
```json
{
  "conversationMode": "INTAKE_PAUSED",
  "pauseReason": "user_request" | "overwhelm_detected" | "time_constraint",
  "resumeToken": "abc123..."
}
```

### Text-Based Pause Signal
- Chatbot: "No problem, we can pause here."
- Chatbot: "I've saved your progress."
- Chatbot: "You can come back anytime."

### Exit Signal
```json
{
  "conversationMode": "QUALIFICATION" | "END",
  "exitReason": "user_nevermind" | "wrong_service" | "escalation"
}
```

### Text-Based Exit Signal
- User: "Never mind"
- Chatbot: "No problem at all. Feel free to reach out when you're ready."

---

## EDGE CASE DETECTION

### Case 1: Ambiguous Consent

**Scenario**:
```
CHATBOT: Are you ready to begin intake?
USER: I guess so
```

**Detection Rule**: 
- "I guess" = weak consent
- Log as `USER_CONSENT: weak_affirmative`
- Flag for review if user disengages shortly after

### Case 2: Interrupted Transition

**Scenario**:
```
CHATBOT: Are you ready to begin intake?
USER: Wait, how long will this take?
```

**Detection Rule**:
- User did NOT confirm
- Transition incomplete
- Chatbot must answer question THEN re-request consent

### Case 3: Implicit Transition

**Scenario**:
```
USER: What information do you need?
CHATBOT: Let me get your full legal name.
```

**Detection Rule**:
- No explicit mode acknowledgment
- No consent request
- FAILURE: Consent bypassed

### Case 4: Mode Confusion

**Scenario**:
```
CHATBOT: Let's begin intake.
USER: What does that mean?
```

**Detection Rule**:
- User confused after transition attempt
- FAILURE: Confusing transition
- Chatbot must clarify before proceeding

---

## TESTING CHECKLIST (SHADOW AI)

For each simulation involving intake transition:

- [ ] User readiness signal generated
- [ ] Transition trigger detected (Golden Frame 61)
- [ ] Mode acknowledgment present in chatbot response
- [ ] Consent requested
- [ ] Explanation provided
- [ ] Tone ≥4.0/5
- [ ] User consent simulated (affirm or decline)
- [ ] Mode state change verified
- [ ] Transition outcome logged

---

## TESTING CHECKLIST (FORM STRESS TEST)

For calibration runs:

- [ ] Transition success rate calculated
- [ ] Consent request rate calculated
- [ ] Mode activation rate calculated
- [ ] Average transition tone calculated
- [ ] Failed transitions categorized by type
- [ ] Intake Mode duration tracked
- [ ] Field collection tracked (once implemented)

---

## PASS/FAIL THRESHOLDS

### Transition Detection

| Metric | Threshold | Status |
|--------|-----------|--------|
| Transition Success Rate | ≥90% | Required for production |
| Consent Request Rate | 100% | Non-negotiable |
| Mode Activation Rate | ≥95% | Required |
| Transition Tone Avg | ≥4.0/5 | Required |
| Premature Transitions | 0% | Non-negotiable |
| Consent Bypassed | 0% | Non-negotiable |

### Intake Mode Detection

| Metric | Threshold | Status |
|--------|-----------|--------|
| Mode State Clarity | 100% | Logs must be clear |
| Field Mapping | ≥90% | Questions map to fields |
| Tone Maintenance | ≥4.0/5 | Throughout intake |

---

## FAILURE REPORTING TEMPLATE

When transition fails, report:

```
TRANSITION_FAILURE_REPORT:
  simulation_id: "I-01"
  user_trigger: "I'm ready to fill out the form"
  chatbot_response: "[full response text]"
  failure_type: "no_consent" | "confusing" | "pressure" | etc.
  missing_elements:
    - "consent request"
    - "explanation"
  tone_score: X.X/5
  recommended_action: "Implement Golden Frame 61"
  golden_frame_used: null | 61
```

---

## NON-GOALS

This detection protocol does NOT:
- Define internal code architecture
- Specify database schemas
- Implement actual chatbot logic
- Enumerate all intake fields
- Define UI behavior

This is **testing protocol only** — how to observe and verify mode transitions from conversation logs.

---

END OF MODE TRANSITION DETECTION RULES
