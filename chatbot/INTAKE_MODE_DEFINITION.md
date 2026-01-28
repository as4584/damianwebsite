# Intake Mode Definition — Architectural Invariants

**Version**: 1.0  
**Status**: Conceptual (Mode Exists, Fields Not Yet Implemented)  
**Purpose**: Define Intake Mode as a distinct conversational phase

---

## WHAT INTAKE MODE IS

Intake Mode is a **structured conversational phase** where the chatbot collects specific, predetermined information needed to complete a business formation intake form.

### Characteristics

1. **Explicit Entry**
   - Intake Mode is entered through Golden Frame 61 (Qualification → Intake Transition)
   - User must consent before entry
   - Transition is acknowledged explicitly

2. **Structured Progression**
   - Questions follow a predetermined sequence
   - Each question maps to a specific form field
   - Progress is trackable and resumable

3. **Field-Focused**
   - Each interaction aims to collect or clarify a form field
   - Fields have known requirements (required, optional, format)
   - Missing fields are tracked explicitly

4. **User-Accommodating**
   - User can skip questions with "I don't know"
   - User can request explanations ("why do you need this?")
   - User can pause and resume
   - User can backtrack to correct previous answers

5. **Transparent**
   - Purpose of each field is explainable
   - Progress indicators available
   - Exit is always available without penalty

---

## WHAT INTAKE MODE IS NOT

1. **NOT Exploratory**
   - Intake is not for discovering user intent
   - Intent must be clear before entering intake
   - Entity type uncertainty blocks intake entry

2. **NOT Conversational in Traditional Sense**
   - Not free-form dialogue
   - Not advice-giving
   - Not educational (qualification handles education)

3. **NOT Rigid**
   - Not a linear script that can't accommodate questions
   - Not intolerant of corrections
   - Not punishing for skips or pauses

4. **NOT Pressure-Based**
   - Not urgent or time-limited
   - Not shaming for incomplete data
   - Not implying consequences for stopping

5. **NOT Autonomous**
   - Cannot provide legal/tax advice during intake
   - Cannot make decisions for user
   - Cannot fill fields speculatively

---

## MODE INVARIANTS (NON-NEGOTIABLE RULES)

### Rule 1: Explicit Mode State

At all times, the system knows:
- Current mode (QUALIFICATION | INTAKE_ACTIVE | INTAKE_PAUSED)
- How it entered this mode
- What field/section is active

### Rule 2: Consent-Gated Entry

Intake Mode CANNOT be entered without:
- Explicit transition (Golden Frame 61)
- User consent confirmation
- Clear explanation of what intake entails

### Rule 3: Graceful Exit Always Available

At ANY point in Intake Mode:
- User can say "never mind" → graceful exit
- User can say "I need to pause" → save state
- User can say "I want to talk to someone" → escalate

Exit is NEVER penalized with pressure, urgency, or negativity.

### Rule 4: Field Purpose Must Be Explainable

For EVERY field collected:
- System can explain why the field is needed
- Explanation must be transparent and honest
- User asking "why?" does NOT block progression

### Rule 5: Tone Floor

Politeness score MUST remain ≥4.0/5 throughout intake.

If tone degrades:
- Pause intake
- Offer human handoff
- Never push through friction

### Rule 6: No Speculative Field Filling

System MUST NOT:
- Guess field values
- Infer from context without confirmation
- Fill fields "on behalf" of user

Every field value comes from explicit user input.

### Rule 7: Safety Boundaries Remain Active

Intake Mode does NOT suspend safety rules:
- Legal advice refusal still active
- Tax advice refusal still active
- PII refusal still active (especially SSN)
- Escalation evaluation continuous

---

## ALLOWED BEHAVIORS IN INTAKE MODE

1. **Structured Questions**
   - "What's your full legal name?"
   - "What business names are you considering?"
   - "Do you have a registered agent?"

2. **Clarifications**
   - "Just to confirm, is that [value]?"
   - "Can you spell that for me?"

3. **Progress Updates**
   - "We're about halfway through."
   - "Just a few more sections."

4. **Field Explanations**
   - "We ask this because state law requires..."
   - "This helps us determine..."

5. **Accommodations**
   - "No problem, we can skip that for now."
   - "You can come back to this later."
   - "Let me connect you with someone who can help."

---

## FORBIDDEN BEHAVIORS IN INTAKE MODE

1. **Advice**
   - ❌ "You should choose LLC"
   - ❌ "Most people go with member-managed"

2. **Pressure**
   - ❌ "We need this to proceed"
   - ❌ "This is required" (when it's actually optional)
   - ❌ "You're almost done, just a few more"

3. **Speculation**
   - ❌ "I'll assume you meant..."
   - ❌ "Based on what you said, I'll put..."

4. **Judgment**
   - ❌ "You don't know that?"
   - ❌ "This is important information"
   - ❌ Implying user is unprepared

5. **Opacity**
   - ❌ Asking for data without explaining why
   - ❌ Refusing to explain field purpose

---

## MODE TRANSITIONS

### Entry: QUALIFICATION → INTAKE_ACTIVE
- Via Golden Frame 61
- Requires user consent
- Logged explicitly

### Pause: INTAKE_ACTIVE → INTAKE_PAUSED
- User signals need to stop
- Progress saved
- Return path provided

### Resume: INTAKE_PAUSED → INTAKE_ACTIVE
- User returns with resume token/context
- System restores state
- Continues from last field

### Exit: INTAKE_ACTIVE → QUALIFICATION
- User says "never mind" or similar
- Graceful acknowledgment
- Option to return later

### Escalate: INTAKE_ACTIVE → HUMAN_HANDOFF
- User requests human assistance
- System preserves collected data
- Warm handoff

---

## RELATIONSHIP TO QUALIFICATION MODE

| Aspect | Qualification Mode | Intake Mode |
|--------|-------------------|-------------|
| **Purpose** | Explore intent, build context | Collect structured data |
| **Pressure** | None, exploratory | Still low, but purpose-driven |
| **Questions** | Open-ended, adaptive | Structured, predetermined |
| **Field Mapping** | Informal context | Explicit form fields |
| **Completion** | Not expected | Desired but not required |
| **Exit Cost** | None | None (same as qualification) |
| **Tone** | Conversational | Professional but warm |

---

## RELATIONSHIP TO GOLDEN FRAMES

- **ALL intake behavior must originate from Golden Frames**
- If an intake scenario lacks a frame, propose a new frame
- Do NOT patch with ad-hoc logic
- Do NOT invent responses outside frame structure

Current Intake-Related Frames:
- Frame 61: Qualification → Intake Transition (NEW)
- [Future frames for field collection, corrections, explanations, etc.]

---

## TESTABILITY REQUIREMENTS

Intake Mode must be detectable by:

1. **Shadow AI**: Can observe mode state in conversation metadata
2. **Form Stress Test**: Can verify transition occurred
3. **Human Review**: Can read transcript and identify mode boundaries

Mode state MUST be logged explicitly in conversation metadata.

---

## SUCCESS CRITERIA

Intake Mode is successful when:
- Users understand they've entered structured collection
- Users consent before entry
- Users feel safe to pause or exit
- Fields are collected accurately
- Tone remains ≥4.0/5
- Users feel respected throughout

---

## FAILURE CONDITIONS

Intake Mode fails when:
- User confused about what's happening
- Transition occurred without consent
- User pressured to continue
- User cannot pause or backtrack
- Tone degrades below 4.0/5
- User feels trapped or judged

---

## NON-GOALS (INTENTIONAL EXCLUSIONS)

This definition does NOT:
- Enumerate all intake fields (separate specification)
- Define field validation rules (implementation detail)
- Specify database schema (technical concern)
- Define UI rendering (presentation layer)
- Implement entity-specific branching (future work)

This is a **mode definition**, not a field specification.

---

END OF INTAKE MODE DEFINITION
