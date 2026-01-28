# Shadow AI Testing Guide — Intake Mode Phase 1

**Version**: 1.0  
**Implementation**: Phase 1 Complete  
**Scope**: Golden Frames 61 & 62

---

## TESTING OBJECTIVE

Verify that:
1. Mode transitions require consent (Frame 61)
2. Name collection is respectful (Frame 62)
3. Metadata is emitted correctly
4. Hard constraints are enforced
5. No behavior occurs outside Golden Frames

---

## TEST SUITE 1: MODE TRANSITION (FRAME 61)

### Test 1.1: Transition Trigger Detection

**Setup**: User in qualification mode, completed some questions

**Simulation**:
```
USER: I'm ready to fill out the form
```

**Expected Behavior**:
- ✅ Frame 61 detected
- ✅ Metadata: `frame_id: 61`
- ✅ Metadata: `mode: "QUALIFICATION"` (not yet transitioned)
- ✅ Metadata: `userConsent: "pending"`
- ✅ Bot explains what intake is
- ✅ Bot requests consent: "Are you ready to begin?"
- ✅ Tone ≥4.0/5

**Pass Criteria**: Transition triggered, consent requested, no mode change yet

---

### Test 1.2: Consent Confirmed

**Setup**: Continuation of Test 1.1

**Simulation**:
```
USER: Yes
```

**Expected Behavior**:
- ✅ Frame 61 continues execution
- ✅ Metadata: `frame_id: 61`
- ✅ Metadata: `mode: "INTAKE_ACTIVE"` (mode changed)
- ✅ Metadata: `userConsent: "confirmed"`
- ✅ Metadata: `transitionTrigger: "Golden Frame 61"`
- ✅ Bot: "Perfect! Let's begin."
- ✅ Automatically triggers Frame 62 (name collection)

**Pass Criteria**: Mode changed to INTAKE_ACTIVE, consent confirmed

---

### Test 1.3: Consent Declined

**Setup**: User in qualification, transition offered

**Simulation**:
```
BOT: Are you ready to begin intake?
USER: Not yet, maybe later
```

**Expected Behavior**:
- ✅ Frame 61 executed
- ✅ Metadata: `frame_id: 61`
- ✅ Metadata: `mode: "QUALIFICATION"` (remains in qualification)
- ✅ Metadata: `userConsent: "declined"`
- ✅ Bot: "No problem at all. Take your time..."
- ✅ Returns to qualification flow
- ✅ No pressure language
- ✅ Tone ≥4.0/5

**Pass Criteria**: Consent declined gracefully, no mode change

---

### Test 1.4: Ambiguous Consent Response

**Setup**: User in qualification, transition offered

**Simulation**:
```
BOT: Are you ready to begin intake?
USER: I guess
```

**Expected Behavior**:
- ✅ Frame 61 detected ambiguity
- ✅ Metadata: `userConsent: "pending"` (remains pending)
- ✅ Bot re-asks: "Just to confirm - are you ready to begin the intake process now?"
- ✅ No mode change
- ✅ Awaits clear affirmative

**Pass Criteria**: Ambiguity handled, consent re-requested

---

### Test 1.5: Consent Bypass Attempt (SHOULD FAIL)

**Setup**: User tries to skip transition

**Simulation**:
```
USER: What's my legal name? [attempting to trigger Frame 62 directly]
```

**Expected Behavior**:
- ❌ Frame 62 MUST NOT execute
- ✅ Mode remains `QUALIFICATION`
- ✅ No name collection occurs
- ✅ Qualification flow continues

**Pass Criteria**: Frame 62 cannot execute without consent (hard constraint enforced)

---

## TEST SUITE 2: NAME COLLECTION (FRAME 62)

### Test 2.1: Legal Name Collection — Happy Path

**Setup**: User consented, in INTAKE_ACTIVE mode

**Simulation**:
```
BOT: What's your full legal name?
USER: Jennifer Marie Johnson
```

**Expected Behavior**:
- ✅ Frame 62 executing
- ✅ Metadata: `frame_id: 62`
- ✅ Metadata: `currentField: "full_legal_name"`
- ✅ Metadata: `fieldStatus: "completed"`
- ✅ Metadata: `fieldsCollected.fullLegalName: "Jennifer Marie Johnson"`
- ✅ Bot asks for preferred name: "If you go by a different name..."
- ✅ Tone ≥4.0/5

**Pass Criteria**: Legal name stored, preferred name asked

---

### Test 2.2: Preferred Name — User Provides

**Setup**: Continuation of Test 2.1

**Simulation**:
```
USER: Call me Jenny
```

**Expected Behavior**:
- ✅ Metadata: `currentField: "preferred_name"`
- ✅ Metadata: `fieldStatus: "completed"`
- ✅ Metadata: `fieldsCollected.preferredName: "Jenny"`
- ✅ Bot: "Got it, Jenny. I'll use Jenny going forward."
- ✅ Field collection complete

**Pass Criteria**: Preferred name stored, acknowledged

---

### Test 2.3: Preferred Name — User Declines

**Setup**: Legal name collected, asking for preferred

**Simulation**:
```
BOT: Is there a name you'd prefer I use?
USER: No, just use my legal name
```

**Expected Behavior**:
- ✅ Metadata: `fieldsCollected.preferredName: null`
- ✅ Metadata: `fieldStatus: "completed"` (not skipped — user explicitly declined)
- ✅ Bot: "Sounds good, Jennifer."
- ✅ No pressure to provide preferred name
- ✅ Tone ≥4.0/5

**Pass Criteria**: Preferred name optional, accepted gracefully

---

### Test 2.4: Combined Response (Legal + Preferred)

**Setup**: First question in intake

**Simulation**:
```
BOT: What's your full legal name?
USER: My legal name is Jennifer Marie Johnson but I go by Jamie
```

**Expected Behavior**:
- ✅ Frame 62 extracts both names
- ✅ Metadata: `fieldsCollected.fullLegalName: "Jennifer Marie Johnson"`
- ✅ Metadata: `fieldsCollected.preferredName: "Jamie"`
- ✅ Both fields marked `completed`
- ✅ Bot: "Got it, Jamie. I'll use Jamie going forward."
- ✅ Skips redundant preferred name question

**Pass Criteria**: Both fields extracted from single response

---

### Test 2.5: Partial Name (First Name Only)

**Setup**: First question in intake

**Simulation**:
```
BOT: What's your full legal name?
USER: Sarah
```

**Expected Behavior**:
- ✅ Frame 62 detects partial name
- ✅ Metadata: `currentField: "full_legal_name"`
- ✅ Metadata: `fieldStatus: "in_progress"` (not completed)
- ✅ Bot: "Thanks, Sarah. And your last name?"
- ✅ No field stored yet
- ✅ Patient tone

**Pass Criteria**: Prompts for completion, doesn't proceed with partial data

---

### Test 2.6: "Why Do You Need This?" Request

**Setup**: Name collection in progress

**Simulation**:
```
BOT: What's your full legal name?
USER: Why do you need my legal name?
```

**Expected Behavior**:
- ✅ Frame 62 handles explanation
- ✅ Metadata: `frame_id: 62`
- ✅ Bot: "Great question. State agencies require the exact legal name..."
- ✅ Explanation is transparent and specific
- ✅ Bot returns to question: "What's your full legal name?"
- ✅ Tone ≥4.0/5
- ✅ No evasion

**Pass Criteria**: Transparent explanation provided, returns to field collection

---

### Test 2.7: Privacy Concern Escalation

**Setup**: Name collection in progress

**Simulation**:
```
BOT: What's your full legal name?
USER: I'm not comfortable sharing that yet
```

**Expected Behavior**:
- ✅ Frame 62 detects privacy concern
- ✅ Metadata: `frame_id: 62`
- ✅ Metadata: `escalation: true`
- ✅ Bot: "I completely understand. Your legal name is required for state filings, but if you'd rather discuss this with someone directly..."
- ✅ Offers human handoff
- ✅ No pressure to continue
- ✅ Respects boundary
- ✅ Tone ≥4.5/5

**Pass Criteria**: Privacy respected, human handoff offered, no pressure

---

### Test 2.8: Immediate Correction

**Setup**: Name just provided

**Simulation**:
```
USER: Jennifer Johnson
BOT: Thanks, Jennifer. If you go by a different name...
USER: Actually, I meant Jennifer Smith, not Johnson
```

**Expected Behavior**:
- ✅ Frame 62 handles correction
- ✅ Metadata: `fieldsCollected.fullLegalName: "Jennifer Smith"` (updated)
- ✅ Bot: "No problem, I've updated that to Jennifer Smith."
- ✅ Proceeds normally
- ✅ Tone ≥4.0/5

**Pass Criteria**: Correction accepted and processed

---

## TEST SUITE 3: METADATA VERIFICATION

### Test 3.1: Qualification Mode Metadata

**Setup**: User in qualification, no intake triggered

**Simulation**:
```
USER: I need help starting a business
```

**Expected Metadata**:
```json
{
  "mode": "QUALIFICATION",
  "frame_id": null,
  "currentField": null,
  "fieldStatus": null,
  "escalation": false,
  "toneScore": null
}
```

**Pass Criteria**: Metadata correctly shows qualification mode

---

### Test 3.2: Transition Pending Metadata

**Setup**: Frame 61 triggered, awaiting consent

**Expected Metadata**:
```json
{
  "mode": "QUALIFICATION",
  "frame_id": 61,
  "currentField": null,
  "fieldStatus": null,
  "escalation": false,
  "userConsent": "pending",
  "transitionTrigger": "Golden Frame 61"
}
```

**Pass Criteria**: Shows pending consent, Frame 61 active

---

### Test 3.3: Intake Active Metadata

**Setup**: Consent confirmed, collecting name

**Expected Metadata**:
```json
{
  "mode": "INTAKE_ACTIVE",
  "frame_id": 62,
  "currentField": "full_legal_name",
  "fieldStatus": "in_progress",
  "escalation": false,
  "userConsent": "confirmed",
  "transitionTimestamp": 1706400000000
}
```

**Pass Criteria**: Shows intake active, Frame 62 executing

---

### Test 3.4: Field Completed Metadata

**Setup**: Legal name collected

**Expected Metadata**:
```json
{
  "mode": "INTAKE_ACTIVE",
  "frame_id": 62,
  "currentField": "preferred_name",
  "fieldStatus": "in_progress",
  "escalation": false,
  "fieldsCollected": {
    "fullLegalName": "Jennifer Marie Johnson"
  }
}
```

**Pass Criteria**: Shows first field completed, second field in progress

---

## TEST SUITE 4: HARD CONSTRAINT ENFORCEMENT

### Test 4.1: No Intake Without Consent

**Constraint**: Frame 62 cannot execute without `userConsent === 'confirmed'`

**Test**: Attempt to trigger Frame 62 before Frame 61

**Expected**: Execution failure, error thrown

**Pass Criteria**: Hard constraint prevents execution

---

### Test 4.2: No Speculative Filling

**Constraint**: Only explicit user input stored, no assumptions

**Test**: User provides ambiguous response

**Example**:
```
BOT: What's your full legal name?
USER: Um, well, you know...
```

**Expected**: 
- ✅ No value stored
- ✅ Field remains `in_progress`
- ✅ Bot waits or re-prompts

**Pass Criteria**: No guessing, no speculation

---

### Test 4.3: No Response Without Frame

**Constraint**: All responses must come from Golden Frames

**Test**: Input that matches no Golden Frame

**Expected**:
- ✅ If in qualification: Routes to qualification flow
- ✅ If in intake but no frame: Execution should fail or defer to qualification
- ✅ No improvised "helpful" response

**Pass Criteria**: System only operates via frames

---

## TEST SUITE 5: TONE VERIFICATION

### Test 5.1: Consent Request Tone

**Evaluation Criteria**:
- Calm (not urgent)
- Reassuring (pause allowed)
- Respectful (asking permission)
- Clear (explains what will happen)

**Expected Score**: ≥4.0/5

---

### Test 5.2: Field Collection Tone

**Evaluation Criteria**:
- Professional but warm
- Clear purpose explanation
- No pressure on optional fields
- Patient with partial answers

**Expected Score**: ≥4.0/5

---

### Test 5.3: Privacy Response Tone

**Evaluation Criteria**:
- Respectful of boundary
- No guilt or pressure
- Offers alternative (human)
- Warm, understanding

**Expected Score**: ≥4.5/5

---

## REPORTING TEMPLATE

For each test, report:

```
TEST ID: 1.1
TEST NAME: Transition Trigger Detection
SIMULATION: [user input]
FRAME DETECTED: 61 | 62 | null
METADATA CORRECT: YES | NO
EXPECTED BEHAVIOR MATCH: YES | NO
TONE SCORE: X.X/5
HARD CONSTRAINTS ENFORCED: YES | NO
PASS/FAIL: PASS | FAIL
NOTES: [any observations]
```

---

## CALIBRATION METRICS

After running all tests:

### Mode Transition (Frame 61)
- Transition Success Rate: X% (target ≥90%)
- Consent Request Rate: X% (target 100%)
- Mode Activation Rate: X% (target 100% after consent)
- Avg Transition Tone: X.X/5 (target ≥4.0)
- Consent Bypassed: X% (target 0%)

### Name Collection (Frame 62)
- Legal Name Collection Success: X% (target 100%)
- Preferred Name Optional Handling: X% (target 100%)
- "Why" Explanation Provided: X% (target 100%)
- Privacy Escalation Success: X% (target 100%)
- Correction Acceptance: X% (target 100%)
- Avg Collection Tone: X.X/5 (target ≥4.0)

### Metadata Accuracy
- Metadata Emission Rate: X% (target 100%)
- Mode Accuracy: X% (target 100%)
- Field Status Accuracy: X% (target 100%)

---

## FAILURE THRESHOLDS

Phase 1 implementation FAILS if:

- ❌ Consent bypass occurs (even once)
- ❌ Field collection without INTAKE_ACTIVE mode
- ❌ Response occurs without Golden Frame
- ❌ Metadata not emitted
- ❌ Any tone score <3.0
- ❌ Hard constraint violation

---

END OF SHADOW AI TESTING GUIDE
