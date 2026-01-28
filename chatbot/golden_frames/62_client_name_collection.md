# Golden Frame 62: Client Name Collection (Intake)

**Frame ID**: 62  
**Frame Name**: Client Name Collection (Intake)  
**Version**: 1.0  
**Category**: Intake Field Collection  
**Phase**: Intake Mode (Active)  
**Prerequisite**: Golden Frame 61 executed, user consent confirmed

---

## SITUATION

User has entered Intake Mode and confirmed consent to proceed. This is the **first intake field** collected. The system needs to gather:
1. Full legal name (as appears on legal documents)
2. Preferred name (if different from legal name)

This question occurs immediately after mode transition confirmation.

---

## PURPOSE

### Why This Field Is Collected

**Legal Name**: Required for state filings, formation documents, and official records. State agencies require exact legal name of the person forming the entity.

**Preferred Name**: Allows respectful, personalized communication without using legal name if user prefers something else (nickname, middle name, shortened version, chosen name).

### Why This Field Is Asked First

1. **Low-stakes entry**: Name is familiar, non-threatening
2. **Establishes pattern**: Demonstrates intake structure without complexity
3. **Builds trust**: Shows we care about user's preferences (legal vs preferred)
4. **Foundational**: Name is needed for all subsequent documents and communication

---

## TRIGGERS

This frame triggers when:
- User has confirmed readiness to begin intake (Frame 61 complete)
- `conversationMode` = `INTAKE_ACTIVE`
- `userConsent` = `confirmed`
- `currentField` = null or `client_info_start`

This is the **default first question** in Intake Mode.

---

## RESPONSE REQUIREMENTS

### MUST Include

1. **Field purpose explanation**
   - Why we need legal name (state filings)
   - Why we distinguish legal vs preferred
   
2. **Clear question structure**
   - Ask for legal name first
   - Then ask about preferred name separately
   
3. **Normalization of preference**
   - Make it clear preferred name is optional
   - No judgment for having or not having one
   
4. **Example/clarification**
   - Clarify what "legal name" means if needed
   - Provide examples: "as it appears on your driver's license or passport"

5. **Respectful framing**
   - Acknowledge that legal and preferred names may differ
   - Use inclusive language (not "real name" vs "nickname")

### MUST NOT Include

- Pressure to provide preferred name
- Judgment about name choices
- Assumptions about why someone uses preferred name
- Request for unnecessary details (middle name spelling, suffixes unless relevant)

---

## TONE REQUIREMENTS

- **Professional but warm**: This is official data, but collection should feel human
- **Respectful**: Honor the distinction between legal and preferred names
- **Clear**: No ambiguity about what's being asked
- **Patient**: Allow time for response, don't rush

**Politeness Floor**: 4.0/5 minimum

---

## EXAMPLE RESPONSE

```
Perfect, let's start with your name.

We'll need your full legal name as it appears on official documents 
like your driver's license or passport. This is what will be used for 
state filings and formation paperwork.

What's your full legal name?

[USER PROVIDES NAME]

Thanks, [Legal Name]. If you go by a different name day-to-day — 
maybe a nickname, middle name, or just a shortened version — I'm 
happy to use that instead. It's totally optional.

Is there a name you'd prefer I use, or should I stick with [Legal Name]?
```

---

## HANDLING USER RESPONSES

### Scenario 1: Legal Name Provided Clearly

**User**: "Jennifer Marie Johnson"

**System Action**:
- Store: `fullLegalName = "Jennifer Marie Johnson"`
- Proceed to preferred name question
- Use "Jennifer" for preferred name question

---

### Scenario 2: Legal Name + Immediate Preference

**User**: "My legal name is Jennifer Marie Johnson but I go by Jamie"

**System Action**:
- Extract both: `fullLegalName = "Jennifer Marie Johnson"`, `preferredName = "Jamie"`
- Confirm: "Got it, Jamie. I'll use Jamie going forward."
- Skip redundant preferred name question
- Proceed to next intake field

---

### Scenario 3: User Unsure About Legal Name

**User**: "I don't remember my middle name"

**System Response**:
```
No problem. You can just give me your first and last name for now, 
and if we need your middle name later, we can add it. What's your 
first and last name?
```

**System Action**:
- Accept partial name
- Flag for potential follow-up
- Proceed without pressure

---

### Scenario 4: User Doesn't Want Preferred Name

**User**: "No, just use my legal name"  
OR  
**User**: "That's fine"

**System Response**:
```
Sounds good, [Legal Name].
```

**System Action**:
- Store: `preferredName = null`
- Use legal name in all communication
- Proceed to next field

---

### Scenario 5: User Only Provides First Name

**User**: "Sarah"

**System Response**:
```
Thanks, Sarah. And your last name?
```

**System Action**:
- Prompt for completion
- Don't move forward until full name provided
- Maintain patient tone

---

### Scenario 6: User Asks "Why Do You Need This?"

**User**: "Why do you need my legal name?"

**System Response**:
```
Great question. State agencies require the exact legal name of the 
person forming the business. It's what will appear on official formation 
documents and state records. We want to make sure it matches your ID 
exactly to avoid any filing issues.

What's your full legal name?
```

**System Action**:
- Provide transparent explanation
- Return to question after explanation
- Maintain trust

---

### Scenario 7: User Provides Unusual Name Format

**User**: "My name is Mx. River Jordan Sky"

**System Response**:
```
Got it — River Jordan Sky. Just to confirm for the filing, is that 
River Jordan Sky, or are there any other parts to your legal name?
```

**System Action**:
- Accept without judgment
- Confirm for accuracy
- Store as provided
- Note honorific if provided (Mx.) but clarify it's not required for filing

---

### Scenario 8: User Corrects Immediately

**User**: "Actually, I meant Jennifer, not Jenny"

**System Response**:
```
No problem, I've updated that to Jennifer.
```

**System Action**:
- Update field value
- Acknowledge correction
- Proceed normally

---

## FAILURE CONDITIONS

This frame fails if:

1. **No purpose explanation**: System asks for name without explaining why
2. **Legal/preferred distinction unclear**: User confused about which name to provide
3. **Pressure on preferred name**: System implies preferred name is required
4. **Judgment**: System reacts negatively to unusual names, corrections, or preferences
5. **Refuses "I don't know"**: System blocks progression if user can't provide middle name
6. **Doesn't handle corrections**: User tries to fix error, system doesn't acknowledge
7. **Tone below 4.0/5**: Collection feels transactional, impatient, or rude

---

## EDGE CASES

### Mononymous Names

**User**: "I only have one name — just River"

**System Response**:
```
That's fine. Some people do have mononymous names. For state filings, 
we may need to note that, but we can work with just River.
```

**System Action**: Accept, flag for legal review if needed

---

### Name Change in Progress

**User**: "I'm in the process of legally changing my name"

**System Response**:
```
Got it. For the formation documents, we'll need to use whatever your 
legal name is right now — even if you're changing it soon. Once your 
name change is complete, we can update the business records.

What's your current legal name?
```

**System Action**: Use current legal name, note name change status

---

### Privacy Concern

**User**: "I don't feel comfortable sharing that yet"

**System Response**:
```
I completely understand. Your legal name is required for state filings, 
but if you'd rather discuss this with someone directly, I can connect 
you with a team member.

Would you like to continue on your own timeline, or speak with someone?
```

**System Action**: 
- Offer human handoff
- Allow user to pause intake
- Respect boundary

---

## ESCALATION RULES

Escalate to human if:
- User expresses privacy concerns about legal name
- User has complex name situation (ongoing change, legal issues)
- User asks legal questions about name requirements
- User becomes frustrated or anxious

Do NOT escalate for:
- Simple corrections
- Preferred name clarifications
- Routine "why do you need this" questions

---

## FIELD CORRECTION PROTOCOL (CONCEPTUAL)

If user later says:
- "Actually, my middle name is spelled differently"
- "I made a mistake on my name"
- "Can I change what I said earlier?"

**System Response**:
```
Of course. What should I update your legal name to?
```

**System Action**:
- Allow field update
- Confirm new value
- Log correction

(Full backtracking protocol will be defined in future Golden Frame)

---

## METADATA OUTPUT

When this frame executes:

```json
{
  "conversationMode": "INTAKE_ACTIVE",
  "currentField": "full_legal_name",
  "section": "client_info",
  "fieldStatus": "in_progress" | "completed" | "skipped",
  "fieldsCollected": {
    "fullLegalName": "string | null",
    "preferredName": "string | null"
  }
}
```

---

## SUCCESS CRITERIA

Name collection is successful when:
- User understands why legal name is needed
- User provides legal name without confusion
- Legal vs preferred name distinction is clear
- User feels respected (especially for preferred name)
- Tone remains ≥4.0/5
- User can skip preferred name without pressure
- System accepts corrections gracefully

---

## RELATIONSHIP TO OTHER FRAMES

### Prerequisite Frame
- Frame 61: Qualification → Intake Transition (must complete first)

### Related Frames
- Frame 08: User Unsure (if user hesitates on name)
- Frame 14: Never Mind (if user wants to exit after name question)
- [Future] Frame XX: Field Purpose Explanation (for "why do you need this")
- [Future] Frame XX: Explicit Backtracking Protocol (for corrections)

---

## WHY THIS FIELD WAS CHOSEN FIRST

### Strategic Rationale

1. **Low Cognitive Load**
   - Everyone knows their name
   - Familiar question, low anxiety
   - Sets comfortable pace for intake

2. **Establishes Intake Pattern**
   - Demonstrates: ask field → explain purpose → normalize uncertainty → proceed
   - Shows that preferred name accommodation (respect for user preferences)
   - Proves tone is maintained in structured collection

3. **Builds Trust Early**
   - Legal vs preferred distinction shows respect
   - Optional preferred name shows flexibility
   - Purpose explanation shows transparency

4. **Foundational Data**
   - Name needed for all subsequent communication
   - Required for every document and filing
   - Using preferred name (if provided) personalizes remaining intake

5. **Testable First Step**
   - Shadow AI can verify:
     - Purpose explained
     - Legal/preferred distinction made
     - Optional preferred name handled correctly
     - Tone maintained
   - Form Stress Test can measure:
     - Field collection success rate
     - Tone during collection
     - Handling of "I don't know"
     - Correction accommodation

6. **Avoids Complexity**
   - No entity-specific logic
   - No external validation (no API calls)
   - No multi-step dependencies
   - Simple text storage

### What This Demonstrates

By implementing name collection first, we prove:
- ✅ Intake Mode can collect structured fields
- ✅ Field purpose can be explained transparently
- ✅ Tone ≥4.0/5 is maintained in data collection
- ✅ User preferences are respected (preferred name)
- ✅ Uncertainty is normalized ("I don't know" → no problem)
- ✅ Corrections are possible
- ✅ Escalation boundaries are clear

### What This Does NOT Demonstrate

This frame intentionally does NOT:
- ❌ Show complex validation (no email format checking)
- ❌ Show entity-specific branching (no LLC vs Corp logic)
- ❌ Show multi-field dependencies (no "if X then Y")
- ❌ Show external API integration (no name availability check)
- ❌ Show save/resume (future feature)

### Next Logical Steps

After this frame is implemented and tested:

1. **Frame 63**: Business Email Collection (introduces validation concept)
2. **Frame 64**: Phone Number Collection (introduces formatting)
3. **Frame 65**: Business Name Options (introduces multi-value field)
4. **Frame 66**: Entity Type Selection (introduces branching)

But those are future work. This frame stands alone as first intake field.

---

## COMPLIANCE CHECK

### CHATBOT_ENGINEERING_CONTRACT v1.3
✅ **Human Usability**: Tone ≥4.0/5 maintained  
✅ **False Positive Prevention**: Field only marked complete if data provided  
✅ **Drop-off Grace**: User can pause/exit anytime  

### INTAKE_MODE_DEFINITION.md
✅ **Field Purpose Explainable**: "State filings require legal name"  
✅ **No Pressure**: Preferred name explicitly optional  
✅ **Graceful Exit**: User can decline or escalate  
✅ **No Speculation**: Only accepts explicit user input  

### Shadow AI System v1.1
✅ **User Simulation**: Frame supports realistic scenarios  
✅ **Coverage Testing**: Edge cases defined  
✅ **Golden Frame Adherence**: No freeform logic  

---

END OF GOLDEN FRAME 62
