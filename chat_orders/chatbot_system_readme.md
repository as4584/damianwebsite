Status: Protected UI Subsystem
Governing Contract: CHATBOT_ENGINEERING_CONTRACT.md v1.3 (HARDENED)

1. PURPOSE OF THIS DOCUMENT

This README exists to protect the chatbot from regression, invisibility, and accidental breakage.

The chatbot is a user-facing UI system, not a background service.

If a human cannot see, click, type into, and receive responses from the chatbot in a real browser session, the chatbot is considered broken, regardless of test results or logs.

This document defines non-negotiable invariants that must be respected by:

Humans

AI agents

Refactors

Feature additions

Styling changes

Layout changes

Page edits elsewhere in the app

2. SOURCE OF TRUTH

The chatbot is governed by:

Primary Contract:
CHATBOT_ENGINEERING_CONTRACT.md — Version 1.3 (HARDENED)

This README does not override the contract.
It reinforces and operationalizes it.

If there is ever a conflict between:

implementation

tests

assumptions

automation

human observation

👉 The contract + human usability win.

3. CHATBOT IS A PROTECTED SUBSYSTEM

The chatbot is considered infrastructure-level UI, similar to:

authentication

navigation

checkout

payments

🚫 DO NOT:

Move the chatbot without updating tests

Wrap it in conditional rendering

Hide it behind feature flags

Change z-index behavior casually

Clip it with overflow: hidden

Assume tests alone guarantee usability

✅ DO:

Treat it as always-on UI

Preserve viewport visibility

Preserve pointer and keyboard interaction

Preserve human usability across pages

4. NON-NEGOTIABLE INVARIANTS

These invariants must always remain true:

UI VISIBILITY

The floating chat bubble is within the viewport

It is not covered by overlays, modals, or layouts

It has a high z-index

It is clickable by a human without devtools

INTERACTION

Clicking the bubble opens the modal

The modal is visually above page content

The input field:

receives focus

shows a visible cursor

accepts keyboard input

MESSAGING

User messages render as visible chat bubbles

Assistant messages render as visible chat bubbles

Messages are readable, not clipped, not hidden

RESILIENCE

Works after page refresh

Works after cold reload

Works across navigation

If any invariant breaks, the chatbot is broken.

5. TESTING PHILOSOPHY (UI-FIRST)

All chatbot tests must align with human reality, not just automation success.

REQUIRED TEST HIERARCHY

Human Usability Reality

Visible UI Assertions

Interaction Tests

State & Logic Tests

Unit Tests

If a test passes but a human cannot use the chatbot:

❌ The test is wrong
❌ The system is not complete

6. TEST REQUIREMENTS (MANDATORY)
E2E / UI Tests MUST:

Use real pointer clicks (click())

Use real keyboard input (type, fill, press)

Assert .toBeVisible() — not DOM existence

Assert viewport presence (bounding box)

Never rely on page.evaluate() for interaction

Tests MUST FAIL if:

The bubble is off-screen

The modal is hidden or clipped

Input cannot receive focus

Messages exist but are not visible

Passing tests that violate human usability are false positives.

7. HUMAN USABILITY TEST (REQUIRED FOR SIGN-OFF)

Before any release, refactor, or merge:

A real human must be able to:

Open the site in a browser

See the chat bubble immediately

Click it with a mouse or trackpad

See the modal open

Type into the input

Send a message

See both user + assistant bubbles

Refresh and repeat successfully

No devtools.
No DOM inspection.
No style overrides.

If this fails → do not ship.

8. SAFE EDITING RULES (IMPORTANT)

When editing other pages, layouts, or styles:

Before merging:

Run chatbot E2E tests

Manually verify chatbot usability

Confirm no layout or z-index conflicts

High-risk changes include:

Global layout wrappers

overflow: hidden

Modals or drawers

New fixed-position elements

Z-index refactors

CSS resets

Any of the above can break the chatbot unintentionally.

9. AI AGENT INSTRUCTIONS (CRITICAL)

Any AI agent working on this repo must be instructed:

Follow CHATBOT_ENGINEERING_CONTRACT.md v1.3 exactly.
UI visibility and human usability override all other concerns.
Do not declare success unless the chatbot is visibly usable by a human.

Agents may not:

Self-certify based on logs

Trust Playwright alone

Assume correctness without visible proof

10. CHANGE MANAGEMENT

Any change that affects:

Chat visibility

Chat interaction

Layout or positioning

Rendering logic

Message flow

Must include:

Updated tests (if needed)

Visual verification

Human usability confirmation

11. FINAL RULE (READ THIS TWICE)

A chatbot that technically exists but cannot be used by a human
does not exist.

This system prioritizes:

Humans

Visibility

Usability

Tests

Architecture

In that order.

✅ STATUS

Chatbot protected by contract v1.3

Human usability is the ultimate gate

Safe to iterate elsewhere as long as invariants hold