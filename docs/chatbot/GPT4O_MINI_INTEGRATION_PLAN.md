# GPT-4o-mini Integration: Deterministic Intake Assistant
## Chatbot Intelligence Protocol

**Date**: May 22, 2024 (Revised)
**Architecture**: Human-Centered Deterministic Intake
**Model**: GPT-4o-mini (JSON Response Mode)

---

## MISSION: Empathy + Extraction
Instead of "Shadow AI" discovery, GPT-4o-mini is now utilized as the intelligence layer for a **Deterministic 8-Step Intake Flow**.

### Core Functional Role
GPT-4o-mini is called via `callIntakeGPT` in `intakeAssistant.ts` for every user turn. It performs three simultaneous functions:

1. **Empathetic Feedback**: Acknowledges what the user just said (even if off-topic) with kindness and professionalism.
2. **Context Retention**: Maintains the thread of conversation while steering the user back to the intake step.
3. **Structured Extraction**: Extracts specific business data (Names, Emails, Phone, etc.) from natural language and returns it as JSON.

### Request/Response Pattern
We use `response_format: { type: "json_object" }` to ensure the model provides a machine-readable decision on:
- `extractedValue`: The piece of data collected (e.g., "John Doe").
- `isStepComplete`: Boolean flag to advance the intake state machine.
- `empatheticResponse`: The message to display to the user.

---

## CONTEXT INJECTION (Knowledge Base)
To stay "calm and kind" and answer business questions while collecting info, the GPT prompt is injected with:
- **Global Context**: Who "IDS" is (Innovation Development Solutions).
- **Step Context**: Why we are asking this specific question.
- **Rules**: "Never judge," "Always acknowledge," "Gently return to the task."

## PERFORMANCE & COST
- **Model**: `gpt-4o-mini`
- **Cost Efficiency**: High. Single-turn extraction is cheaper than long-running discovery phases.
- **Latency**: <2s per turn for intake responses.

## REPLACED SYSTEMS
- Intent Detection (Keyword-based) -> GPT-extracted JSON.
- Golden Frames -> LLM extraction logic.
- Discovery Router -> Linear Intake Machine.


**New** (GPT-enhanced):
```typescript
async function detectIntentGPT(userInput: string, currentPage: string): Promise<Intent> {
  const systemPrompt = `You are an intent classifier for a business formation company.
Current page: ${currentPage}

Classify user message into ONE intent:
- ENTITY_HELP: Asking about LLC, Corp, entity types
- PRICING: Asking about cost, pricing, fees
- CONSULTATION: Ready to book, wants to talk
- GENERAL_INFO: General questions about services
- TIMELINE: How long does X take
- OFF_TOPIC: Not business-related
- READY_FOR_INTAKE: Wants to fill form, provide info

Respond with ONLY the intent name.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ],
    max_tokens: 10, // Just the intent name
    temperature: 0.1 // Deterministic
  });

  return response.choices[0].message.content as Intent;
}
```

**Token Usage**:
- System: ~120 tokens
- User: ~20 tokens (avg)
- Response: ~5 tokens
- **Total: ~145 tokens per intent detection**

**Cost Impact**:
- Input: $0.000000145 ($0.150 per 1M tokens)
- Output: $0.000000003 ($0.600 per 1M tokens)
- **Per call: ~$0.00015**

#### 2.2 Response Generation (Replace canned messages)

**Current**:
```typescript
// Static responses
const messages = {
  welcome: {
    initial: "Hi! I'm here to help...",
  },
  intents: {
    entityHelp: "Great! Let me ask a few...",
  }
}
```

**New** (Context-aware):
```typescript
async function generateResponseGPT(
  userInput: string,
  intent: Intent,
  sessionData: SessionData,
  websiteContext: string
): Promise<string> {
  
  const systemPrompt = `You are a helpful assistant for Innovation Business Development Solutions, a national business formation firm.

COMPANY SERVICES:
- Business formation (LLC, S-Corp, C-Corp)
- Multi-state registration
- Compliance (registered agent, annual reports, BOI filing)
- Websites and custom applications
- AI tools integration
- Email infrastructure

WEBSITE SECTIONS:
${websiteContext}

TONE: Professional but conversational. Warm, confident, helpful.
LENGTH: 2-3 sentences max.
GOAL: Answer briefly, then guide toward consultation.

RULES:
- Never invent prices (say "pricing varies, let's discuss")
- Never give legal/tax advice
- Always offer to schedule consultation
- If unsure, admit it and escalate

Current conversation state: ${sessionData.currentState || 'WELCOME'}
Detected intent: ${intent}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ],
    max_tokens: 150, // Cap response length
    temperature: 0.7, // Natural but consistent
    presence_penalty: 0.3 // Reduce repetition
  });

  return response.choices[0].message.content || fallbackResponse;
}
```

**Token Usage**:
- System: ~200 tokens (with context)
- User: ~20 tokens
- Response: ~100 tokens (avg, capped at 150)
- **Total: ~320 tokens per response**

**Cost Impact**:
- Input: $0.000033 
- Output: $0.000060
- **Per call: ~$0.00009**

#### 2.3 Question Answering (Enhance existing system)

**Keep**: Golden Frames for structured intake  
**Add**: GPT for unstructured questions

```typescript
async function answerQuestionGPT(
  question: string,
  siteKnowledgeBase: SiteContext
): Promise<{ answer: string, shouldTransition: boolean }> {
  
  const systemPrompt = `You are answering questions about Innovation Business Development Solutions.

KNOWLEDGE BASE:
Services: Business formation, compliance, websites, custom apps, AI tools
Locations: All 50 states
Process: Consultation → Formation → Compliance setup
Timeline: 24-48 hours for formation, same-day EIN
Pricing: Custom quotes, formation starts ~$500-1000

PAGES:
- /services: All offerings
- /starting-a-business: Formation guides  
- /who-we-serve: Client types
- /contact: Schedule consultation

Answer the question briefly. If you don't know, say so. Never invent information.
If question is about intake/form, set shouldTransition=true.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    max_tokens: 120,
    temperature: 0.3 // Factual
  });

  const answer = response.choices[0].message.content || '';
  const shouldTransition = answer.toLowerCase().includes('form') || 
                          answer.toLowerCase().includes('intake');

  return { answer, shouldTransition };
}
```

### Token Reduction Strategies

✅ **Implementation**:
1. **Cache system prompts** - No need to send full context each time
2. **Truncate user input** - Max 200 chars (user won't type essays)
3. **Cap responses** - max_tokens=150 (2-3 sentences)
4. **Skip GPT for known patterns**:
   - "hi", "hello", "hey" → Static greeting (no API call)
   - "thank you", "thanks" → Static acknowledgment
   - Profanity/nonsense → Validation layer (no API call)
5. **Rate limit** - Max 1 call per message

```typescript
// Smart routing: GPT only when needed
function shouldUseGPT(input: string, state: ConversationState): boolean {
  // Skip GPT for simple cases
  if (input.length < 3) return false;
  if (/^(hi|hey|hello|thanks|bye)$/i.test(input)) return false;
  if (state === 'INTAKE_COLLECTION') return false; // Golden Frames handle this
  
  return true;
}
```

### Cost Projection Per Message

| Component | Tokens | Cost |
|-----------|--------|------|
| Intent Detection | 145 | $0.00015 |
| Response Generation | 320 | $0.00009 |
| **Total per message** | **465** | **$0.00024** |

**With optimizations** (50% skip GPT):
- Average per message: **$0.00012**

---

## PHASE 3 — SITE-AWARE RESPONSES (NO EMBEDDINGS)

### Website Knowledge as Static JSON

Create `chatbot/kb/siteKnowledge.json`:
```json
{
  "pages": {
    "/": {
      "title": "Home",
      "purpose": "Overview of business formation and scaling services",
      "key_points": [
        "Multi-state business formation",
        "50+ states active",
        "Scalable infrastructure",
        "One coordinated system"
      ],
      "cta": "Get Started"
    },
    "/services": {
      "title": "Services",
      "purpose": "Complete list of offerings",
      "sections": {
        "formation": {
          "services": ["LLC formation", "S-Corp election", "Multi-state registration"],
          "anchor": "#formation"
        },
        "compliance": {
          "services": ["Registered agent", "Annual reports", "BOI filing"],
          "anchor": "#compliance"
        },
        "digital": {
          "services": ["Websites", "Custom apps", "AI tools"],
          "anchor": "#digital"
        }
      }
    },
    "/starting-a-business": {
      "title": "Starting a Business",
      "purpose": "Formation process and entity selection",
      "guides": [
        "LLC vs S-Corp vs C-Corp",
        "Multi-state expansion",
        "Compliance requirements"
      ]
    },
    "/who-we-serve": {
      "title": "Who We Serve",
      "purpose": "Client types and industries",
      "segments": [
        "First-time founders",
        "Established businesses",
        "Multi-location operations"
      ]
    },
    "/contact": {
      "title": "Contact",
      "purpose": "Schedule consultation",
      "form_fields": ["name", "email", "phone", "message"]
    }
  },
  "faqs": {
    "pricing": "Pricing varies by service. LLC formation starts around $500-1000. Multi-state varies. Custom quotes during consultation.",
    "timeline": "Formation: 24-48 hours. EIN: Same day. Websites: 2-4 weeks.",
    "states": "We serve all 50 states for formation and compliance.",
    "difference_llc_corp": "LLC offers liability protection with flexibility. Corp offers stock and stronger structure for investors.",
    "registered_agent": "Legal document recipient. Required in every state. We provide in all 50 states."
  },
  "navigation_hints": {
    "want_to_form_business": "/starting-a-business",
    "see_all_services": "/services",
    "who_can_use": "/who-we-serve",
    "schedule_call": "/contact",
    "pricing_info": "Custom quotes - /contact"
  }
}
```

### Smart Context Injection

```typescript
// Load once at app start
import siteKnowledge from '@/chatbot/kb/siteKnowledge.json';

function getRelevantContext(intent: Intent, currentPage: string): string {
  const pageContext = siteKnowledge.pages[currentPage] || siteKnowledge.pages['/'];
  
  let context = `Current page: ${pageContext.title}\n`;
  
  // Add relevant FAQs based on intent
  if (intent === 'PRICING' && siteKnowledge.faqs.pricing) {
    context += `Pricing: ${siteKnowledge.faqs.pricing}\n`;
  }
  if (intent === 'TIMELINE' && siteKnowledge.faqs.timeline) {
    context += `Timeline: ${siteKnowledge.faqs.timeline}\n`;
  }
  
  // Add navigation hints
  if (intent === 'GENERAL_INFO') {
    context += `Services page: ${siteKnowledge.navigation_hints.see_all_services}\n`;
  }
  
  return context;
}
```

### Page-Aware Routing

```typescript
// Enhance ChatModal to pass current page
useEffect(() => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    sessionStorage.setItem('current_page', currentPath);
  }
}, []);

// In API route
const currentPage = request.headers.get('referer')?.split('/').pop() || '/';
const context = getRelevantContext(intent, currentPage);
```

**No Embeddings Needed**:
- Static JSON (< 10KB)
- Keyword matching for FAQ lookup
- URL-based page context
- Zero API calls for context

---

## PHASE 4 — CONVERSION-FIRST CHAT FLOW

### Golden Frames to Keep

✅ **Frame 61**: Qualification → Intake Transition (KEEP)
- Well-designed consent flow
- Clear expectations
- Reduces anxiety
- **Trigger**: User expresses readiness

✅ **Frame 62**: Name Collection (KEEP)
- Respectful data collection
- Legal name + preferred name
- Privacy-aware
- **Trigger**: After consent

✅ **Proposed: Frame 00**: Welcome + Quick Help (NEW)
- Greeting with page context
- "I can help with X, Y, Z"
- Offers 2-3 quick options
- **Trigger**: Chat opens

✅ **Proposed: Frame 99**: Consultation Nudge (NEW)
- After 2-3 Q&A exchanges
- Soft transition: "Want to dive deeper? Let's schedule a call"
- **Trigger**: Question count > 2

### Frames to Remove/Merge

❌ **Remove**: Excessive qualification questions
- Current system has 7+ qualification Qs
- Reduces to 3 max before consultation offer

❌ **Remove**: Keyword-based intent detection frames
- Replace with GPT intent detection

### Conversation Flow Redesign

```
User opens chat
  ↓
Frame 00: Welcome + Quick Options
  ├─ Option 1: "I want to form a business"
  │    ↓
  │  GPT: Brief entity type explanation
  │    ↓
  │  Frame 99: "Let's chat about your specific needs"
  │    ↓
  │  Consultation booking
  │
  ├─ Option 2: "I have a question"
  │    ↓
  │  GPT: Answer 1 question
  │    ↓
  │  GPT: Answer 1 more (if user asks)
  │    ↓
  │  Frame 99: "Want personalized guidance?"
  │    ↓
  │  Consultation booking
  │
  └─ Option 3: "I'm ready to get started"
       ↓
     Frame 61: Intake transition (consent)
       ↓
     Frame 62+: Data collection
       ↓
     Summary → Consultation
```

### Max Exchanges Before Nudge

```typescript
const MAX_QA_EXCHANGES = 2;

function shouldNudgeConsultation(sessionData: SessionData): boolean {
  const qaCount = sessionData.conversationHistory.filter(
    msg => msg.type === 'question_answered'
  ).length;
  
  return qaCount >= MAX_QA_EXCHANGES;
}

// In response generation
if (shouldNudgeConsultation(sessionData)) {
  appendToResponse(response, "\n\nWant to discuss your specific situation? I can get you on a quick call with our team.");
}
```

### Conversion Triggers

```typescript
const CONVERSION_SIGNALS = [
  'ready to start',
  'how do i get started',
  'want to form',
  'need to register',
  'looking to set up',
  'interested in forming'
];

function detectConversionReadiness(input: string): boolean {
  return CONVERSION_SIGNALS.some(signal => 
    input.toLowerCase().includes(signal)
  );
}

// Skip Q&A, go straight to consultation
if (detectConversionReadiness(userInput)) {
  return executeGoldenFrame(61, sessionData); // Intake transition
}
```

---

## PHASE 5 — HALLUCINATION PREVENTION (FREE SHADOW AI)

### Validation Layer (Zero API Calls)

```typescript
// chatbot/logic/responseValidator.ts

interface ValidationResult {
  isValid: boolean;
  violations: string[];
  safeResponse?: string;
}

const FORBIDDEN_CLAIMS = [
  // Pricing claims
  /\$\d+.*guaranteed/i,
  /cheapest/i,
  /lowest price/i,
  /only \$\d+/i,
  
  // Legal advice
  /you should incorporate as/i,
  /the best entity type is/i,
  /i recommend you choose/i,
  /legally required to/i,
  
  // Timeline guarantees
  /will definitely/i,
  /guaranteed.*days/i,
  /always takes/i,
  
  // Service claims
  /we offer.*bankruptcy/i,
  /we provide.*legal representation/i,
  /we do.*tax returns/i
];

const PRICE_MENTIONS = /\$[\d,]+/g;

export function validateResponse(
  response: string,
  intent: Intent
): ValidationResult {
  
  const violations: string[] = [];
  
  // Check for forbidden claims
  for (const pattern of FORBIDDEN_CLAIMS) {
    if (pattern.test(response)) {
      violations.push(`Forbidden claim detected: ${pattern.source}`);
    }
  }
  
  // Validate price mentions
  const prices = response.match(PRICE_MENTIONS);
  if (prices && intent !== 'PRICING') {
    violations.push('Price mentioned in non-pricing context');
  }
  
  // Check for specific price claims (we only give ranges)
  if (prices) {
    const hasSpecificPrice = /\$\d+\.00/.test(response);
    if (hasSpecificPrice) {
      violations.push('Specific price given (only ranges allowed)');
    }
  }
  
  // Validate advice claims
  if (/should|must|have to|need to.*form|incorporate/i.test(response)) {
    violations.push('Prescriptive advice detected');
  }
  
  if (violations.length > 0) {
    return {
      isValid: false,
      violations,
      safeResponse: getFallbackResponse(intent)
    };
  }
  
  return { isValid: true, violations: [] };
}

function getFallbackResponse(intent: Intent): string {
  const fallbacks = {
    PRICING: "Pricing varies based on your specific needs. During a consultation, we'll provide a clear quote. Want to schedule one?",
    ENTITY_HELP: "Entity selection depends on your situation. Let's discuss your goals during a consultation to recommend the right structure.",
    TIMELINE: "Timelines vary, but formation is typically 24-48 hours. Want to discuss your specific timeline needs?",
    default: "That's a great question that deserves a personalized answer. Can I get you scheduled with our team to discuss?"
  };
  
  return fallbacks[intent] || fallbacks.default;
}
```

### Integration Point

```typescript
// In router after GPT response
const gptResponse = await generateResponseGPT(input, intent, sessionData, context);

// Validate before returning
const validation = validateResponse(gptResponse, intent);

if (!validation.isValid) {
  console.error('GPT response failed validation:', validation.violations);
  console.error('Original response:', gptResponse);
  
  return {
    message: validation.safeResponse!,
    nextState: currentState,
    sessionData: {
      ...sessionData,
      validationFailed: true // Track for monitoring
    }
  };
}

return {
  message: gptResponse,
  nextState: nextState,
  sessionData
};
```

### Why This Is Better Than Second Model Call

✅ **Cost**: Zero API calls (regex + pattern matching)  
✅ **Speed**: Instant validation (< 1ms)  
✅ **Reliability**: Deterministic rules  
✅ **Control**: Explicit guardrails  
✅ **Monitoring**: Log all violations for review

❌ **Alternative (expensive)**:
```typescript
// DON'T DO THIS - costs $0.00024 per validation
const validationCall = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Check if response contains bad claims' },
    { role: 'user', content: response }
  ]
});
// Doubles cost per message!
```

### Intent Validation (Also Free)

```typescript
function validateIntent(userInput: string): {
  isValid: boolean;
  reason?: string;
} {
  // Block gibberish
  if (userInput.length > 500) {
    return { isValid: false, reason: 'Input too long' };
  }
  
  // Block spam patterns
  if (/(.)\1{10,}/.test(userInput)) {
    return { isValid: false, reason: 'Repetitive characters' };
  }
  
  // Block profanity (basic check)
  const profanityList = ['badword1', 'badword2']; // Expand as needed
  if (profanityList.some(word => userInput.toLowerCase().includes(word))) {
    return { isValid: false, reason: 'Inappropriate language' };
  }
  
  return { isValid: true };
}

// Use before GPT call to save tokens
const inputValidation = validateIntent(userInput);
if (!inputValidation.isValid) {
  return {
    message: "I'm here to help with business formation questions. What would you like to know?",
    nextState: currentState,
    sessionData
  };
}
```

---

## PHASE 6 — COST PROJECTIONS (CRITICAL)

### GPT-4o-mini Pricing (as of Jan 2026)

- **Input**: $0.150 per 1M tokens
- **Output**: $0.600 per 1M tokens

### Per-Message Token Breakdown

| Operation | Input Tokens | Output Tokens | Total | Cost |
|-----------|--------------|---------------|-------|------|
| Intent Detection | 140 | 5 | 145 | $0.000024 |
| Response Generation | 220 | 100 | 320 | $0.000093 |
| **Total per message** | **360** | **105** | **465** | **$0.000117** |

### With Optimizations (50% messages skip GPT)

| Scenario | Messages | GPT Calls | Cost |
|----------|----------|-----------|------|
| Simple greeting | 1 | 0 | $0.00 |
| Simple thanks | 1 | 0 | $0.00 |
| Question + Answer | 1 | 1 | $0.000117 |
| Complex conversation (3 turns) | 3 | 2 | $0.000234 |

**Average per message**: $0.000058 (assuming 50% skip rate)

### Monthly Cost Projections

#### Scenario 1: 1,000 Messages/Month

```
Total messages: 1,000
Messages using GPT: 500 (50% skip rate)
Cost per GPT message: $0.000117

Monthly cost: 500 × $0.000117 = $0.0585
Annual cost: $0.70
```

**✅ Under $10/month: YES** (by 99.4%)

#### Scenario 2: 5,000 Messages/Month

```
Total messages: 5,000
Messages using GPT: 2,500
Cost per GPT message: $0.000117

Monthly cost: 2,500 × $0.000117 = $0.29
Annual cost: $3.48
```

**✅ Under $10/month: YES** (by 97%)

#### Scenario 3: 10,000 Messages/Month

```
Total messages: 10,000
Messages using GPT: 5,000
Cost per GPT message: $0.000117

Monthly cost: 5,000 × $0.000117 = $0.585
Annual cost: $7.02
```

**✅ Under $10/month: YES** (by 94%)

#### Scenario 4: 50,000 Messages/Month

```
Total messages: 50,000
Messages using GPT: 25,000
Cost per GPT message: $0.000117

Monthly cost: 25,000 × $0.000117 = $2.93
Annual cost: $35.16
```

**✅ Under $10/month: YES** (by 71%)

#### Scenario 5: 100,000 Messages/Month

```
Total messages: 100,000
Messages using GPT: 50,000
Cost per GPT message: $0.000117

Monthly cost: 50,000 × $0.000117 = $5.85
Annual cost: $70.20
```

**✅ Under $10/month: YES** (by 41%)

### Break-Even Point

```
$10 / $0.000117 = 85,470 GPT calls
85,470 × 2 (50% skip rate) = 170,940 total messages

Monthly message cap to stay under $10: ~170,000 messages
```

### Cost Comparison: Current vs Proposed

| System | Cost per Message | 5K msgs/mo |
|--------|------------------|------------|
| **Current** (no AI) | $0.00 | $0.00 |
| **Proposed** (GPT-4o-mini) | $0.000058 | $0.29 |
| OpenAI Assistants | $0.002 | $10.00 |
| GPT-4 Turbo | $0.004 | $20.00 |

**Cost increase**: $0.29/month (from $0)  
**Value add**: Natural language understanding, context awareness, quality responses

---

## PHASE 7 — RISK & FUTURE SAFEGUARDS

### Cost Spike Risks

⚠️ **What Could Cause Overages**:

1. **Spam/Bot Attack**:
   - Malicious bot sends 100K messages
   - Without rate limiting: $5.85 spike
   
2. **Long Conversations**:
   - User has 50-turn conversation
   - Each turn has growing context
   - Token count explodes
   
3. **System Prompt Bloat**:
   - Adding more context over time
   - 200 tokens → 500 tokens
   - Cost increases 150%
   
4. **Removed Optimizations**:
   - Disabling skip logic
   - Every message calls GPT
   - Cost doubles instantly

### Hard Cost Caps

```typescript
// Implement these immediately

// 1. Rate Limiting (per IP)
const RATE_LIMITS = {
  perIP: 20, // messages per hour
  perSession: 50 // messages per chat session
};

// 2. Token Budget (per user)
const TOKEN_LIMITS = {
  perMessage: 600, // max tokens per call
  perSession: 3000 // max cumulative tokens
};

// 3. Monthly Budget Cap
const MONTHLY_BUDGET = {
  maxSpend: 8.00, // $8 hard cap (buffer below $10)
  checkInterval: 'daily', // Check spend daily
  shutoffTrigger: 7.50 // Disable at $7.50
};

// Implementation
let monthlySpend = 0;

async function callGPTWithBudget(prompt: string): Promise<string> {
  // Check budget
  if (monthlySpend >= MONTHLY_BUDGET.shutoffTrigger) {
    console.error('Monthly budget exceeded, using fallback');
    return getFallbackResponse('GENERAL_INFO');
  }
  
  // Make call
  const response = await openai.chat.completions.create({...});
  
  // Track cost
  const cost = (response.usage.total_tokens / 1000000) * 
               ((response.usage.prompt_tokens * 0.15) + 
                (response.usage.completion_tokens * 0.60));
  monthlySpend += cost;
  
  // Log
  console.log(`GPT call cost: $${cost.toFixed(6)}, Monthly total: $${monthlySpend.toFixed(2)}`);
  
  return response.choices[0].message.content;
}
```

### Monitoring Dashboard

```typescript
// Store in database or Redis
interface UsageMetrics {
  date: string;
  totalMessages: number;
  gptCalls: number;
  skippedCalls: number;
  totalTokens: number;
  estimatedCost: number;
  averageTokensPerCall: number;
  validationFailures: number;
}

// Log daily
function logDailyMetrics() {
  const metrics: UsageMetrics = {
    date: new Date().toISOString().split('T')[0],
    totalMessages: getTotalMessages(),
    gptCalls: getGPTCallCount(),
    skippedCalls: getSkippedCount(),
    totalTokens: getTotalTokens(),
    estimatedCost: calculateCost(),
    averageTokensPerCall: getTotalTokens() / getGPTCallCount(),
    validationFailures: getValidationFailures()
  };
  
  console.log('Daily Metrics:', JSON.stringify(metrics, null, 2));
  
  // Alert if trending high
  if (metrics.estimatedCost > 5.00) {
    console.warn('⚠️ Monthly cost trending above $5');
  }
}
```

### Future Features to Defer

❌ **Do NOT Add Until Traffic Grows**:

1. **Conversation Memory** (adds 200+ tokens per turn)
   - Current: Each message is stateless
   - Future: After 10K msgs/month, add 5-turn memory
   - Cost impact: +$0.04 per 100 messages
   
2. **Multi-Language Support** (adds translation calls)
   - Current: English only
   - Future: After international traffic
   - Cost impact: +$0.02 per translated message
   
3. **Advanced RAG** (requires embeddings)
   - Current: Static JSON knowledge base
   - Future: If knowledge base > 50KB
   - Cost impact: +$0.10/month (embeddings API)
   
4. **Image Analysis** (vision models cost more)
   - Current: Text only
   - Future: For document upload feature
   - Cost impact: +$0.50 per image
   
5. **Voice Transcription** (Whisper API)
   - Current: Text chat only
   - Future: Voice input option
   - Cost impact: +$0.006 per minute

### Scaling Thresholds

```
Traffic Level → Features Enabled → Est. Monthly Cost

0-5K msgs/mo → Basic GPT integration → $0.29
5K-20K msgs/mo → Add 3-turn memory → $1.20
20K-50K msgs/mo → Add conversation context → $3.50
50K-100K msgs/mo → Optimize prompts further → $5.85
100K+ msgs/mo → Consider usage-based pricing → $10+
```

**Recommendation**: Start with Phase 2 only. Monitor for 30 days. Add features only if staying well under $5/month.

---

## IMPLEMENTATION ROADMAP

### Week 1: Foundation

1. Create `/chatbot/kb/siteKnowledge.json`
2. Set up OpenAI API integration
3. Add validation layer (no GPT yet)
4. Implement rate limiting
5. Add usage tracking

### Week 2: GPT Integration

1. Replace intent detection with GPT
2. Add response generation (keep fallbacks)
3. Test with 100 sample conversations
4. Measure token usage
5. Tune max_tokens and prompts

### Week 3: Golden Frames Integration

1. Create Frame 00 (Welcome)
2. Create Frame 99 (Consultation Nudge)
3. Integrate GPT with frame router
4. Test full conversation flows
5. Validate all edge cases

### Week 4: Optimization & Launch

1. Fine-tune skip logic
2. Reduce system prompt tokens
3. Add monitoring dashboard
4. Set budget alerts
5. Gradual rollout (10% → 50% → 100%)

### Success Metrics

After 30 days, verify:
- ✅ Monthly cost < $2.00
- ✅ Average response quality > 4.0/5
- ✅ Validation failure rate < 5%
- ✅ User engagement up (messages per session)
- ✅ Consultation booking rate up

---

## CONCLUSION

### Cost Summary

| Metric | Value |
|--------|-------|
| **Cost per message** | $0.000058 |
| **1K msgs/month** | $0.06 |
| **5K msgs/month** | $0.29 |
| **10K msgs/month** | $0.59 |
| **Safe ceiling** | 170K msgs/month |

### Value Delivered

✅ **Natural Conversations**: Understands context and nuance  
✅ **Site Awareness**: Knows content and can guide users  
✅ **Conversion Optimization**: Nudges toward consultation  
✅ **Safety Guardrails**: Prevents hallucinations and bad advice  
✅ **Cost Control**: Multiple layers of protection  
✅ **Scalable**: Can handle 100K+ messages under budget

### Risk Level

**VERY LOW**:
- Would need 170K msgs/month to hit $10
- Multiple fallback layers
- Hard budget caps
- Monitoring in place
- Easy to disable if needed

### Recommendation

**PROCEED**: This architecture maintains existing stability while adding intelligence at minimal cost. The $10/month budget is safe even at 10X expected traffic.

---

END OF INTEGRATION PLAN
