# Golden Frame 61: Qualification → Intake Transition

**Frame ID**: 61  
**Frame Name**: Qualification → Intake Transition  
**Version**: 1.0  
**Category**: Mode Transition  
**Phase**: Qualification → Intake Boundary

---

## SITUATION

The user has completed exploratory conversation (qualification) and signals readiness to provide structured information for business formation intake.

This frame represents the **boundary between two distinct conversational modes**:
- FROM: Qualification (exploratory, low-pressure, context-gathering)
- TO: Intake (structured, field-by-field, data collection)

---

## TRIGGERS (Non-Exhaustive)

### Explicit User Signals
- "I'm ready to fill out the form"
- "Let's do the paperwork"
- "What information do you need from me?"
- "I'm ready to move forward"
- "Let's get started with the application"
- "I want to complete the intake"
- "Can you collect my details?"

### Contextual Signals
- User has completed qualification questions
- User has expressed clear intent (entity formation, registration)
- User has indicated decision readiness
- User asks "what's next?" after qualification

### Anti-Triggers (Do NOT transition on these)
- User still exploring options
- User expressed uncertainty about entity type
- User has unresolved questions
- User signaled overwhelm
- User has not indicated clear intent

---

## RESPONSE REQUIREMENTS

### MUST Include
1. **Acknowledgment of transition**
   - Explicitly state that conversation is shifting to structured intake
   
2. **Explanation of what Intake Mode is**
   - Brief, human-friendly description
   - Set clear expectations about question structure
   
3. **Anxiety reduction**
   - No pressure to complete all at once
   - Option to pause/resume
   - Normalize uncertainty about some answers
   
4. **Consent request**
   - Explicit "Are you ready to proceed?"
   - Allow user to decline or defer
   
5. **Next step preview**
   - What the first question/section will be
   - Approximate scope (not exact count)

### MUST NOT Include
- Pressure or urgency language
- Implication that declining is bad
- Legal or tax advice
- Detailed field enumeration (overwhelming)
- Promises about completion time

---

## TONE REQUIREMENTS

- **Calm**: This is a natural next step, not a big deal
- **Reassuring**: You can pause anytime, we can help
- **Respectful**: Your time matters, your uncertainty is normal
- **Clear**: Short sentences, plain language
- **Warm**: Human, not transactional

**Politeness Floor**: 4.0/5 minimum

---

## EXAMPLE RESPONSE

```
Great! It sounds like you're ready to move forward.

I'd like to shift into our intake process now. This means I'll ask you 
a series of structured questions to collect the information needed for 
your LLC formation. You can pause anytime, and it's totally fine if you 
don't know every answer — we can mark those and circle back.

We'll start with your contact information and business name ideas, then 
move through entity details. Most people take about 10-15 minutes, but 
there's no rush.

Are you ready to begin?
```

---

## MODE SIGNAL (FOR TESTING)

When this frame is triggered, the system MUST emit:

```
MODE: INTAKE_ACTIVE
TRANSITION: QUALIFICATION → INTAKE
USER_CONSENT: PENDING
```

After user confirms:

```
MODE: INTAKE_ACTIVE
USER_CONSENT: CONFIRMED
INTAKE_PHASE: CLIENT_INFO
```

If user declines:

```
MODE: QUALIFICATION
TRANSITION: DEFERRED
```

---

## FAILURE CONDITIONS

This frame fails if:

1. **No explicit acknowledgment** of mode transition
2. **No consent request** (transition happens without permission)
3. **Pressuring language** (urgency, scarcity, obligation)
4. **No anxiety reduction** (all-or-nothing framing)
5. **Immediate field questions** without explanation

---

## RELATED FRAMES

- Frame 08: User Unsure (if user hesitates after transition offer)
- Frame 14: Never Mind (if user declines and wants to exit)
- Frame 28: Want Human (if user prefers human intake)

---

## ESCALATION RULES

Escalate to human if:
- User says "I need help deciding" (not ready for intake)
- User asks complex legal/tax questions before proceeding
- User expresses significant anxiety about intake process

---

## SUCCESS CRITERIA

Transition is successful when:
- User understands mode shift
- User explicitly consents to proceed
- System enters INTAKE_ACTIVE state
- Tone remains 4.0/5 or higher
- User feels safe to pause or decline

---

## NON-GOALS

This frame does NOT:
- Collect any intake fields
- Ask business name questions
- Request entity type details
- Handle field-level interactions
- Manage backtracking or corrections within intake

Those behaviors belong to subsequent intake-specific frames.

---

END OF GOLDEN FRAME 61
