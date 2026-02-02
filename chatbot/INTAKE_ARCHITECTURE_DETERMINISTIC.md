# 🎯 Deterministic Intake Architecture — Implementation Summary

**Date**: May 22, 2024 (Revised)
**Architecture**: Human-Centered Deterministic Intake
**Status**: ✅ COMPLETE — REPLACED SHADOW AI

---

## MISSION OVERVIEW
The chatbot has been refactored from a multi-phase "Shadow AI" discovery engine into a **Deterministic Intake Assistant**. It follows a strict 8-step sequence designed for clarity, empathy, and high conversion.

## CORE LOGIC: `intakeAssistant.ts`
The engine now resides in [chatbot/logic/intakeAssistant.ts](chatbot/logic/intakeAssistant.ts). It uses a linear state machine with GPT-4o-mini for "Empathy + Extraction."

### The 8-Step Sequence
1. **FULL_LEGAL_NAME**: (Required) Needed for legal lead formation.
2. **PREFERRED_NAME**: (Optional) For personalization.
3. **EMAIL**: (Required) Primary contact.
4. **PHONE**: Secondary contact.
5. **BUSINESS_NAME_CHECK**: "Do you have a business name?"
6. **BUSINESS_NAME_OPTIONS**: (If yes) Collect name.
7. **BUSINESS_TYPE**: Corporation, LLC, etc.
8. **EIN_STATUS**: Already have one or need one?
9. **READINESS**: When do you want to start?
10. **COMPLETED**: Lead saved to database.

## ARCHITECTURAL CHANGES

### 1. `routerEnhanced.ts` simplification
The router no longer tries to "discover" intent. It initializes the `businessIntake` state and hands off execution to `processIntake`. The bot now identifies as a "Business Intake Assistant" from turn 1.

### 2. Empathy-First LLM Interaction
Every turn uses `callIntakeGPT` which performs three critical tasks:
- **Acknowledge**: Validates the user's previous statement with high empathy.
- **Extract**: Pulls structured data (JSON) from the response.
- **Sequence**: Determines if the current step is "completed" based on the input.

### 3. Lead Capture Rules
- **Minimum Requirement**: A `fullLegalName` must be present to count as a lead.
- **Persistence**: Leads are created/updated in the database via `/api/leads/create` once the `COMPLETED` state is reached.

## REPLACED SYSTEMS
- **Golden Frames**: Deprecated.
- **Shadow AI / Discovery Mode**: Deprecated.
- **Multi-Phase Routing**: Deprecated.

## TESTING
The flow is verified via `test_chatbot_lifecycle.sh` (or equivalent shell tests) to ensure the 8-step sequence completes and hit the lead capture endpoint.
