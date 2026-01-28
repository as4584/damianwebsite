# Intake Mode Architecture — Explicit Non-Goals

**Version**: 1.0  
**Purpose**: Document what was INTENTIONALLY NOT implemented in this architectural phase  
**Scope**: Mode transition and existence only

---

## WHAT WAS IMPLEMENTED

This architectural phase implemented **ONLY**:

1. ✅ **Golden Frame 61**: Qualification → Intake Transition
   - Defines how to detect user readiness
   - Defines how to request consent
   - Defines transition language and tone requirements

2. ✅ **Intake Mode Definition**: Conceptual invariants
   - What Intake Mode IS and IS NOT
   - Mode behavior rules
   - Relationship to Qualification Mode

3. ✅ **Mode Transition Detection Rules**: Testing protocol
   - How Shadow AI detects transitions
   - How Form Stress Test measures success
   - Pass/fail thresholds

---

## WHAT WAS INTENTIONALLY NOT IMPLEMENTED

### 1. Intake Field Collection (NOT IMPLEMENTED)

**Not Included**:
- Business name questions
- Full legal name vs preferred name collection
- Registered agent questions
- Authorized signer questions
- Management structure questions
- Employee status questions
- EIN verification questions
- Responsible party questions

**Reason**: This phase establishes **mode existence**, not field collection logic.

**Future Work**: 14+ additional Golden Frames required for field-specific interactions.

---

### 2. Entity-Specific Branching (NOT IMPLEMENTED)

**Not Included**:
- LLC-specific questions (management structure)
- Corporation-specific questions (stock classes)
- Nonprofit-specific questions (501(c) status)
- Partnership-specific questions

**Reason**: Branching logic depends on field collection being implemented first.

**Future Work**: Entity-type-aware routing after base intake flow exists.

---

### 3. Field Validation Logic (NOT IMPLEMENTED)

**Not Included**:
- Email format validation
- Phone number formatting
- Business name availability checking
- Address verification
- Field-level error handling

**Reason**: Validation is implementation detail, not architectural concern.

**Future Work**: Technical specification after field collection defined.

---

### 4. Backtracking Protocol (NOT IMPLEMENTED)

**Not Included**:
- "Actually, I meant..." correction handling
- Field update mechanism
- Return to previous question
- Multi-step correction flow

**Reason**: Backtracking requires field collection to exist first.

**Future Work**: Golden Frame for "Explicit Backtracking Protocol" (identified in calibration).

---

### 5. Save & Resume Capability (NOT IMPLEMENTED)

**Not Included**:
- Session state persistence
- Resume token generation
- Return-to-intake flow
- Progress restoration

**Reason**: Save/resume is complex feature requiring infrastructure beyond mode definition.

**Future Work**: Separate architectural phase for session management.

---

### 6. Field Purpose Explanations (NOT IMPLEMENTED)

**Not Included**:
- "Why do you need my business name?"
- "Why are you asking about registered agent?"
- Per-field transparency responses

**Reason**: Explanations depend on specific fields being defined first.

**Future Work**: Golden Frame for "Field Purpose Transparency" (identified in calibration).

---

### 7. Progress Indicators (NOT IMPLEMENTED)

**Not Included**:
- "You're halfway done"
- Section completion feedback
- "3 of 5 sections complete"
- Time estimates

**Reason**: Progress tracking requires full field sequence to be defined.

**Future Work**: User experience enhancement after base intake flow exists.

---

### 8. Question Overwhelm Detection (NOT IMPLEMENTED)

**Not Included**:
- "This is too many questions" recognition
- Pace adjustment
- Break offers mid-intake
- Overwhelm accommodation

**Reason**: Overwhelm detection requires intake flow to exist and be testable.

**Future Work**: Golden Frame for "Question Overwhelm Accommodation" (identified in calibration).

---

### 9. Multi-Intent Handling During Intake (NOT IMPLEMENTED)

**Not Included**:
- Interruption detection ("Wait, how much does this cost?")
- Side-question answering without losing place
- Multi-intent resolution within intake

**Reason**: Multi-intent handling is advanced feature requiring base intake to be stable.

**Future Work**: Golden Frame for "Multi-Intent During Flow" (identified in calibration).

---

### 10. Verbose Answer Extraction (NOT IMPLEMENTED)

**Not Included**:
- Parsing paragraph responses
- Extracting multiple fields from one answer
- Context extraction from free-form text

**Reason**: Extraction logic is NLP/technical concern, not architecture.

**Future Work**: Technical implementation after field collection exists.

---

### 11. Intake-Specific Escalation Rules (NOT IMPLEMENTED)

**Not Included**:
- When to escalate during intake
- Field-level escalation triggers
- Handoff with partial data

**Reason**: Escalation rules depend on understanding which fields are sensitive/complex.

**Future Work**: Escalation policy after intake flow is tested.

---

### 12. Business Name Availability Checking (NOT IMPLEMENTED)

**Not Included**:
- Name search API integration
- Availability feedback
- Alternative suggestions

**Reason**: External API integration is technical implementation, not mode architecture.

**Future Work**: Technical specification for business services integration.

---

### 13. Email Draft Generation (NOT IMPLEMENTED)

**Not Included**:
- Email template population
- Field-to-email mapping
- Email readiness calculation

**Reason**: Email logic depends on complete field collection being implemented.

**Future Work**: Email generation after intake fields are collected reliably.

---

### 14. Intake Field Schema (NOT IMPLEMENTED)

**Not Included**:
- Field data types
- Required vs optional flags
- Field dependencies (if X then Y)
- Validation rules per field

**Reason**: Schema is technical specification, not conversational architecture.

**Future Work**: Technical data model after conversational flow is validated.

---

### 15. Router Logic Implementation (NOT IMPLEMENTED)

**Not Included**:
- State machine updates
- Transition code
- Field collection loops
- Conditional branching

**Reason**: This is architectural definition only, not implementation.

**Future Work**: Code implementation after architecture is approved.

---

### 16. UI/UX for Intake Mode (NOT IMPLEMENTED)

**Not Included**:
- Visual progress bars
- Form field rendering
- Mobile optimization
- Accessibility features

**Reason**: UI is presentation layer, separate from conversational architecture.

**Future Work**: Design phase after conversational flow is validated.

---

### 17. Additional Golden Frames (NOT IMPLEMENTED)

**Not Included** (but identified in calibration):
- Business Name Options Collection
- Entity Type Education
- Registered Agent Explanation
- Registered Agent Collection
- Management Structure Selection
- EIN Status Verification
- Explicit Backtracking Protocol
- Multi-Intent During Flow
- Question Overwhelm Accommodation
- Unknown Answer with Help
- Session Save & Resume
- Verbose Answer Extraction
- Field Purpose Transparency
- Multiple Business Entities
- First-Time Owner Reassurance
- Business Emergency Escalation
- PII Refusal Protocol
- Legal Advice Boundary (intake-specific)
- [And others from calibration report]

**Reason**: This phase implements ONE frame (Frame 61) to establish mode transition.

**Future Work**: 20+ additional frames required for complete intake coverage.

---

### 18. Integration with Existing Qualification Flow (NOT IMPLEMENTED)

**Not Included**:
- Modification of qualification state machine
- Integration points with current router
- Data flow from qualification to intake

**Reason**: Integration is implementation concern, not architectural definition.

**Future Work**: Technical implementation after architecture is approved.

---

### 19. Testing Infrastructure Updates (NOT IMPLEMENTED)

**Not Included**:
- E2E tests for intake mode
- Unit tests for transition logic
- Integration tests for field collection

**Reason**: Tests follow implementation, not architecture.

**Future Work**: Test suite expansion after intake mode is implemented.

---

### 20. Production Deployment Plan (NOT IMPLEMENTED)

**Not Included**:
- Rollout strategy
- A/B testing plan
- Monitoring and metrics
- Rollback procedures

**Reason**: Deployment is operational concern, not architecture.

**Future Work**: DevOps planning after intake mode is built and tested.

---

## WHY THESE EXCLUSIONS MATTER

### Prevents Scope Creep

By explicitly documenting what was NOT implemented, we:
- Maintain focus on mode transition only
- Avoid building incomplete features
- Ensure testability of incremental progress

### Enables Phased Development

Clear non-goals allow:
- Phase 1: Mode transition (this phase)
- Phase 2: Basic field collection
- Phase 3: Advanced features (save/resume, backtracking)
- Phase 4: Optimization (progress indicators, overwhelm detection)

### Supports Testing

Shadow AI and Form Stress Test can now:
- Test mode transition in isolation
- Verify Intake Mode EXISTS
- Confirm transition happens correctly

WITHOUT expecting:
- Full field collection
- Complex interactions
- Advanced features

---

## WHAT SUCCESS LOOKS LIKE (THIS PHASE)

This architectural phase is successful when:

1. ✅ Golden Frame 61 exists and is well-defined
2. ✅ Intake Mode is defined conceptually
3. ✅ Testing can detect mode transitions
4. ✅ Non-goals are clearly documented

**Not required for this phase**:
- Working implementation
- Full intake field collection
- Integration with existing code
- Production readiness

---

## NEXT STEPS (FUTURE WORK)

After this architecture is reviewed and approved:

1. **Implementation Phase**: Build mode transition logic
2. **Field Definition Phase**: Enumerate all intake fields
3. **Golden Frame Expansion**: Create 20+ additional frames
4. **Integration Phase**: Connect to existing chatbot
5. **Testing Phase**: Calibration run #3 with intake mode active
6. **Iteration**: Refine based on stress test findings

---

## ARCHITECTURAL DECISIONS MADE

### Decision 1: Explicit Consent Required

**Choice**: Mode transition requires user consent  
**Alternative Considered**: Automatic transition after qualification  
**Rationale**: User agency and anxiety reduction require explicit permission

### Decision 2: Mode State Must Be Logged

**Choice**: Conversation metadata includes mode state  
**Alternative Considered**: Infer mode from conversation text only  
**Rationale**: Testing requires unambiguous mode detection

### Decision 3: Graceful Exit Always Available

**Choice**: User can exit intake anytime without penalty  
**Alternative Considered**: Require completion or explicit abandonment  
**Rationale**: Contract v1.3 requires drop-off grace

### Decision 4: Tone Floor Maintained

**Choice**: 4.0/5 politeness required in intake  
**Alternative Considered**: Lower threshold for "efficient" intake  
**Rationale**: Humanity requirement doesn't change based on mode

### Decision 5: Single Transition Frame

**Choice**: ONE Golden Frame for transition  
**Alternative Considered**: Multiple frames for different transition types  
**Rationale**: Keep architecture minimal, expand later if needed

---

## QUESTIONS THIS ARCHITECTURE ANSWERS

1. ✅ Does Intake Mode exist as a distinct concept? **YES**
2. ✅ How does a user enter Intake Mode? **Via Golden Frame 61 with consent**
3. ✅ Can Shadow AI detect mode transitions? **YES, via metadata and text signals**
4. ✅ What tone requirements apply in Intake Mode? **Same as qualification: ≥4.0/5**
5. ✅ Can users exit Intake Mode? **YES, always gracefully**

---

## QUESTIONS THIS ARCHITECTURE DOES NOT ANSWER

1. ❌ What specific fields are collected? **Not defined yet**
2. ❌ How are fields validated? **Implementation detail**
3. ❌ How does save/resume work? **Future feature**
4. ❌ How is field order determined? **Future specification**
5. ❌ How are corrections handled? **Future Golden Frame**

---

## COMPLIANCE WITH CONTRACTS

### CHATBOT_ENGINEERING_CONTRACT v1.3

✅ **Human Usability**: Tone requirements maintained (≥4.0/5)  
✅ **False Positive Prevention**: Explicit mode detection prevents false positives  
✅ **Drop-off Grace**: Exit always available without penalty  
✅ **Verification Loop**: Testing protocol defined for mode detection

### Shadow AI System v1.1

✅ **User Simulation**: Testing protocol supports Shadow AI  
✅ **Coverage Engine**: Detection rules enable coverage measurement  
✅ **Golden Frame Adversary**: Frame 61 defined, testable  
✅ **Mode Testing**: Explicit support for mode-aware testing

### Form Stress Test System v1.1

✅ **Phase Awareness**: Intake Mode explicitly defined  
✅ **No Side Effects**: Architecture doesn't send emails  
✅ **Testability**: Detection protocol enables stress testing  
✅ **Mode Transition**: Transition explicitly supported and measurable

---

## SUMMARY

This architectural phase establishes:
- **Mode transition mechanism** (Golden Frame 61)
- **Intake Mode concept** (invariants and rules)
- **Testing detectability** (Shadow AI and Form Stress Test protocols)

This architectural phase does NOT establish:
- **Field collection** (20+ frames needed)
- **Advanced features** (save/resume, backtracking, etc.)
- **Implementation** (code changes)
- **Production readiness** (deployment)

**Goal achieved**: Intake Mode NOW EXISTS as a testable concept.

**Next goal**: Build field collection Golden Frames and implement mode transition logic.

---

END OF EXPLICIT NON-GOALS DOCUMENT
