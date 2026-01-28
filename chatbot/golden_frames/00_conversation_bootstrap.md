# Golden Frame 00: Conversation Bootstrap

**Frame ID**: 00  
**Frame Name**: Conversation Bootstrap  
**Version**: 1.0  
**Category**: Session Initialization  
**Phase**: Session Start

---

## SITUATION

A new user has just opened the chat widget. This is the first interaction of the session. The user has not yet sent any message. The assistant must establish purpose and ask an open question to begin discovery.

This frame represents the **entry point** of all conversations:
- Establishes what the assistant will do
- Asks open question to start DISCOVERY phase
- Sets a direct, helpful tone
- Begins task immediately

---

## TRIGGERS

### Required Conditions
- `session.isNew === true` (first interaction)
- `session.bootstrapCompleted === false`
- No prior messages in conversation history

### Execution Timing
- Executes BEFORE qualification
- Executes BEFORE intake
- Executes BEFORE any other Golden Frame
- Executes ONCE per session only

---

## RESPONSE REQUIREMENTS

### MUST Include
1. **Greeting**
   - Warm, friendly welcome
   - Non-robotic tone

2. **Identity**
   - Assistant name/role
   - Business name: "Innovation Business Development Solutions"

3. **Purpose**
   - What the assistant can help with
   - Types of questions it can answer
   - Optional step-by-step guidance available

4. **No Pressure**
   - User is in control
   - No obligation to proceed
   - Can ask questions freely

### MUST NOT Include
- Data collection requests
- Qualifying questions
- Pressure to "get started"
- Immediate transition to intake
- Multiple questions in sequence
- Forms or structured fields

---

## RESPONSE TEMPLATE

```
I help people figure out how to start or structure a business. I'll ask a couple questions and we'll take it from there.
```

---

## BEHAVIORAL CONSTRAINTS

### Allowed Behavior
- Greet the user warmly
- Introduce the business
- Explain capabilities clearly
- Invite questions
- Wait for user's first message

### Forbidden Behavior
- Ask the user questions
- Request personal information
- Start qualification flow immediately
- Transition to intake mode
- Offer multiple-choice buttons
- Suggest a "best" path
- Create urgency or pressure

---

## TONE REQUIREMENTS

- **Warm**: Friendly, welcoming
- **Clear**: No jargon or corporate speak
- **Calm**: No urgency or pressure
- **Respectful**: User autonomy is paramount
- **Helpful**: Clearly states what's possible

---

## STATE CHANGES

### Before Execution
```typescript
{
  session.isNew: true,
  session.bootstrapCompleted: false,
  intakeMode.mode: 'QUALIFICATION',
  intakeMode.userConsent: null
}
```

### After Execution
```typescript
{
  session.bootstrapCompleted: true,
  // All other state unchanged
}
```

---

## VALIDATION CHECKLIST

✅ Greeting is warm and natural  
✅ Business name is mentioned exactly  
✅ Purpose is clear without jargon  
✅ No questions asked to user  
✅ No data collection attempted  
✅ No pressure language used  
✅ User autonomy emphasized  
✅ Frame executes only once per session  

---

## FAILURE MODES

### What NOT to Do
❌ "To get started, I'll need some information from you."  
❌ "Let's begin! What's your business name?"  
❌ "Click below to start your application."  
❌ "Most users find it helpful to..."  
❌ Multiple quick reply buttons

### Why These Fail
- They assume user intent
- They create pressure
- They collect data before rapport
- They skip consent
- They violate user autonomy

---

## GOOD OUTCOME

The user:
- Knows who they're talking to
- Understands what help is available
- Feels no pressure to proceed
- Can ask questions freely
- Remains in control

---

## BAD OUTCOME

The user:
- Feels pushed into a process
- Doesn't know who/what this is
- Feels obligated to "start"
- Receives questions before context

---

## INTEGRATION NOTES

### Router Logic
```typescript
if (session.isNew && !session.bootstrapCompleted) {
  return executeGoldenFrame(0);
}
```

### After Frame 00
- User sends first message
- Normal conversation flow begins
- Qualification or information requests proceed
- Frame 00 NEVER runs again

---

## EXAMPLE VARIATIONS (All Valid)

**Primary Message (Use This)**
```
I help people figure out how to start or structure a business. I'll ask a couple questions and we'll take it from there.
```

---

## TESTING PROTOCOL

### Test Case 1: First Interaction
- **Input**: User opens chat widget (no message sent)
- **Expected**: Frame 00 executes automatically
- **Validation**: Message contains business name, no questions asked

### Test Case 2: Session Persistence
- **Input**: User sends message after Frame 00
- **Expected**: Conversation continues, Frame 00 does NOT re-trigger
- **Validation**: `bootstrapCompleted === true` in session state

### Test Case 3: New Session
- **Input**: User closes and reopens chat (new session)
- **Expected**: Frame 00 executes again
- **Validation**: New greeting message appears

---

## VERSION HISTORY

- **v1.0** (2026-01-27): Initial creation
  - Establishes conversation bootstrap pattern
  - Defines business context injection
  - Enforces no-pressure initialization
