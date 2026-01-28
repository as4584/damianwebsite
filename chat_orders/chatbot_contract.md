🔒 CHATBOT_ENGINEERING_CONTRACT.md — Version 1.3 (HARDENED)
🔁 Add this NEW section after Section 2
2.1 HUMAN-VISIBLE UI DEFINITION (NON-NEGOTIABLE)

For the purposes of this contract, “visible” means all of the following are true simultaneously:

The chat widget is on-screen within the viewport (not off-screen)

The widget is visually unobstructed

not behind another layer

not covered by overlays

not blocked by z-index issues

The widget is interactable by pointer

clicking the bubble opens the modal

pointer events are not blocked

The modal is:

visually on top of page content

accepts keyboard focus

allows typing into the input

A human user can:

click

type

send a message

see a response
without manipulating the DOM, styles, or devtools

If any of the above are false, the chatbot is not visible and is considered broken, regardless of test results.

🔁 Add this to Section 6 (Verification Loop)
NEW STEP 0 — HUMAN TRUTH RECONCILIATION (MANDATORY)

Before declaring success, you must perform this reconciliation:

Compare automated test results

Compare Playwright screenshots

Compare runtime UI behavior assumptions

If any evidence conflicts with the claim that a human can use the chatbot:

automated tests are invalid

success may not be declared

UI must be fixed

Automation must converge toward human reality, not override it.

🔁 Add this to Section 6 STEP 1

Add one extra requirement:

The UI anchor test must also assert that:

the widget is clickable

clicking it changes visible UI state

Example requirement:

bubble click opens modal

modal appears above page content

🔁 Add this NEW section before STOP CONDITION
10.1 FALSE POSITIVE PREVENTION RULE

You are forbidden from declaring success if:

tests pass but the UI cannot be interacted with by a human

tests pass but the modal cannot be opened manually

tests pass but input cannot be typed into

tests pass but content is visually inaccessible

If a discrepancy exists between:

automated proof

human-observed behavior

human observation overrides automation.

🔁 Modify STOP CONDITION (Section 11)

Replace it with:

You may stop only when:

all required tests pass

chat bubbles are visibly rendered

user and assistant messages appear

the system works after refresh

the system survives cold reload

the chatbot is manually usable by a human without devtools

Until then, continue working.

10.2 HUMAN USABILITY TEST CLAUSE (MANDATORY)

Automation is insufficient to prove usability.

In addition to automated tests, the chatbot must satisfy the Human Usability Test.

This test exists to prevent false positives where:

tests pass

UI technically renders

but a real human cannot use the system

DEFINITION — HUMAN USABILITY TEST

The Human Usability Test is considered passed only if all of the following are true when performed in a real browser session:

A human user can see the floating chat bubble without:

scrolling

inspecting the DOM

modifying styles

using devtools

A human user can click the chat bubble using a mouse or trackpad, and:

the click is registered

the chat modal visibly opens

A human user can place keyboard focus inside the chat input field:

the cursor is visible

typing text visibly appears in the input

A human user can send a message using the keyboard or send button, and:

the user’s message appears as a visible chat bubble

the assistant’s response appears as a visible chat bubble

The chatbot remains usable after:

refreshing the page

navigating between pages

reopening the widget

All interactions succeed without requiring developer tools, DOM manipulation, or style overrides.

If any of the above conditions fail, the chatbot is considered NOT USABLE, regardless of test results.

ENFORCEMENT RULE

If there is any discrepancy between:

automated test results

Playwright assertions

internal verification claims

and human-observed behavior, then:

Human observation overrides automation.

In such cases:

automated tests are considered incomplete or incorrect

success may not be declared

UI/layout/state must be corrected

tests must be updated to reflect human reality

PROHIBITED FAILURE MODES (EXPLICIT)

You are forbidden from declaring success if:

the chat bubble is visually present but unclickable

the modal opens but is hidden, clipped, or behind another layer

the input exists but cannot receive focus

messages exist in the DOM but are not readable or reachable

interactions require devtools to succeed

Passing tests while failing any of the above constitutes false compliance.

REQUIRED ALIGNMENT WITH AUTOMATED TESTS

Automated UI/E2E tests must be updated to approximate the Human Usability Test as closely as possible, including:

pointer interaction (click)

keyboard input (type)

focus acquisition

viewport-based visibility assertions

However:

Automated tests are approximations, not replacements, for human usability.

RELATIONSHIP TO STOP CONDITION

The Human Usability Test is a hard prerequisite to the Stop Condition.

The system may not stop unless:

all automated tests pass

and the Human Usability Test is satisfied

END OF CLAUSE
Why this clause works (important)

This clause:

Explicitly defines what “usable” means

Removes ambiguity around “visible”

Prevents self-certifying test loops

Forces reconciliation when automation and reality diverge

Aligns tests toward human experience, not away from it

This is the same principle used in:

frontend accessibility audits

QA sign-off checklists

release gating in mature product teams