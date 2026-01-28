# Intelligent Chatbot - Quick Start Guide

## 🚀 What Changed

Your chatbot is now **intelligent** using GPT-4o-mini while keeping costs under $10/month.

## ✨ New Features

1. **Smart Intent Detection** - Understands what users really want
2. **Natural Responses** - Friendly, context-aware answers
3. **Site Navigation** - Guides users to relevant pages
4. **Confidence Scoring** - Knows when to offer intake vs. educate
5. **Conversion Focus** - Pushes consultation after 2 questions

## 🔧 How to Use

### Start the Server
```bash
cd /root/damaian
npm run dev
```

Server runs at: http://localhost:3000

### Test the Chat API

**Simple question:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is an LLC?",
    "currentState": "INFO_PROVIDED",
    "sessionData": {
      "conversationHistory": [],
      "bootstrapCompleted": true
    }
  }'
```

**Follow-up question:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How much does it cost?",
    "currentState": "INFO_PROVIDED",
    "sessionData": {
      "conversationHistory": [
        {"role": "user", "message": "What is an LLC?", "timestamp": 1234567890},
        {"role": "bot", "message": "An LLC is...", "timestamp": 1234567891}
      ],
      "bootstrapCompleted": true
    }
  }'
```

## 📊 Monitoring

### Check GPT Usage
Look for logs in console:
```
[Intelligence] Call 1/2: Intent detection
[Intelligence] Detected intent: ENTITY_HELP
[Intelligence] Confidence: MEDIUM (5/10)
[Intelligence] Call 2/2: Response generation
[Intelligence] Usage: 2 calls, $0.0001 spent, $7.99 remaining
```

### When GPT is Skipped
```
[Intelligence] Skipping GPT for this message
```

This happens for:
- Greetings ("hi", "hello")
- Thanks ("thank you")
- Intake mode (Golden Frames active)
- 3+ questions already answered

## 🎯 Cost Control

**Hard Limits:**
- Max 2 GPT calls per message
- Intent detection: 10 tokens max
- Response: 150 tokens max
- Monthly cap: $8.00

**Expected Cost:**
- 500 messages/month = **$0.03**
- 2000 messages/month = **$0.12**
- 5000 messages/month = **$0.29**

## 🔐 Environment Setup

Ensure `.env` has:
```
OPENAI_KEY=sk-proj-...
```

If missing, system falls back to rule-based responses (still works!).

## 🧪 Testing Different Scenarios

### Test 1: General Question (Uses GPT)
```json
{
  "message": "What services do you offer?",
  "currentState": "INFO_PROVIDED"
}
```

### Test 2: Greeting (Skips GPT)
```json
{
  "message": "hi",
  "currentState": "WELCOME"
}
```

### Test 3: High Confidence (Offers Intake)
```json
{
  "message": "I want to start an LLC in California",
  "currentState": "INFO_PROVIDED"
}
```

### Test 4: After 2 Questions (Pushes Consultation)
```json
{
  "message": "What about multi-state?",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "conversationHistory": [
      /* 4+ previous messages */
    ]
  }
}
```

## 🛠️ Troubleshooting

### Issue: "OpenAI API error: 401"
**Solution:** Check/update OPENAI_KEY in `.env`
**Impact:** System uses fallback responses (still works)

### Issue: Responses seem generic
**Check:** 
1. Is GPT being skipped? (Check logs)
2. Is API key valid?
3. Are you in intake mode? (GPT disabled during intake)

### Issue: Not pushing consultation
**Check:** Conversation history count (needs 2+ Q&A pairs)

## 📁 Important Files

- `/chatbot/logic/intelligentRouter.ts` - Intelligence orchestration
- `/chatbot/logic/gptService.ts` - OpenAI API calls
- `/chatbot/logic/confidenceScoring.ts` - Confidence calculation
- `/chatbot/kb/siteKnowledge.json` - Site content database
- `/app/api/chat/route.ts` - Chat API endpoint

## 🔄 How Intelligence Works

```
User Message
     ↓
Is it a Golden Frame? → YES → Execute Frame (skip GPT)
     ↓ NO
Should use intelligence? → NO → Use standard flow
     ↓ YES
GPT Call #1: Detect Intent (10 tokens, temp 0.1)
     ↓
Calculate Confidence (FREE - no GPT)
     ↓
GPT Call #2: Generate Response (150 tokens, temp 0.7)
     ↓
Enhance with Confidence Behavior
     ↓
Return Response
```

## 🎓 Best Practices

1. **Monitor Usage:** Check logs for GPT call patterns
2. **Track Conversions:** Note when consultation push happens
3. **Update Knowledge:** Edit `/chatbot/kb/siteKnowledge.json` as site changes
4. **Test Regularly:** Use curl commands to verify behavior
5. **Check Costs:** Review OpenAI usage dashboard monthly

## 📞 Support

**See Full Report:** `/root/damaian/IMPLEMENTATION_REPORT.md`

**Questions?** Check the logs:
- `[Intelligence]` - Intelligence layer activity
- `[Enhanced Router]` - Routing decisions
- `[Chat API]` - API initialization

---

**Status:** ✅ Ready to use  
**Cost:** Under $10/month guaranteed  
**Backward Compatible:** 100%  
**Breaking Changes:** None
