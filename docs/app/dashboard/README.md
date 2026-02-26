# Leads Dashboard

A real-time dashboard for tracking and managing incoming leads from the Innovation Development Solutions website.

## What This Dashboard Does

The Leads Dashboard gives you a clear view of everyone who has started a conversation on your website. It helps you:

- **See who's interested** — Every conversation is captured and scored
- **Know who to call first** — Hot leads are highlighted so you never miss a sale
- **Understand what they want** — Key information is extracted automatically
- **Get AI-powered suggestions** — The system tells you the best next step

## Understanding Lead Seriousness (The 🔥 System)

We use a simple traffic-light system to show how serious each lead is:

### 🔥 Hot Lead
This person is **ready to move forward**. They've shown clear buying signals like:
- Asked about pricing or costs
- Checked availability or scheduling
- Provided their contact information
- Expressed urgency ("need this ASAP")

**What to do:** Call or email them within the hour if possible.

### 🟡 Warm Lead
This person is **interested but exploring**. They might have:
- Asked questions about services
- Visited multiple pages
- Shared some information but not contact details

**What to do:** Follow up within 24 hours with helpful information.

### ⚪ Cold Lead
This person is **just looking around**. Signs include:
- Very short conversation
- Vague or off-topic messages
- No clear intent or questions

**What to do:** No immediate action needed. They may come back later.

## How to Use This Dashboard Daily

### Morning Routine
1. Open the dashboard
2. Check the **Hot Leads counter** at the top — these are your priority
3. Click on each hot lead to see their full conversation
4. Follow the **AI Suggested Next Step** for each one

### Viewing a Lead
When you click on a lead, you'll see:
- **Their conversation** — The full chat in an easy-to-read format
- **Key information** — Business type, location, timeline automatically extracted
- **Lead seriousness** — Hover over the emoji for details on why they're rated this way
- **Suggested action** — What the AI recommends you do next
- **Quick action buttons** — One-click to call, email, or schedule

### Adding Notes
Click the yellow notes section to add your own observations:
- What you discussed on a call
- Special requirements they mentioned
- Follow-up dates

Notes are only visible to your team, not to the lead.

## Dashboard Features

### Metrics Overview
At the top, you'll see:
- **Total Visits** — How many people came to your site
- **Avg. Time Spent** — How long they stayed (longer = more interested)
- **Bounce Rate** — Percentage who left quickly (lower = better)
- **Lead Conversions** — How many started a conversation

### Lead Filters
Use the filter tabs to view:
- **All** — Every lead
- **Hot 🔥** — High priority only
- **Warm 🟡** — Medium interest
- **Cold ⚪** — Low engagement

### New Activity Indicator
A blue dot appears next to leads with recent activity (within the last hour).

## Privacy & Security

- This dashboard is only accessible to authorized team members
- Lead conversations are stored securely
- Internal notes are never visible to leads
- The middleware validates all access requests

## Technical Notes for Developers

### File Structure
```
dashboard/
├── page.tsx              # Main dashboard view
├── leads/[leadId]/       # Lead detail pages
├── components/           # UI components
├── services/             # Data services
├── utils/               # Helper functions
├── middleware/          # Access control
├── types/               # TypeScript definitions
├── api/                 # API routes
└── tests/               # Test suites
```

### Running Tests
```bash
npm test -- --testPathPattern=dashboard
```

### Key Design Decisions
1. **No numeric scores exposed** — Users only see Hot/Warm/Cold, never "72 points"
2. **Business-friendly language** — No technical jargon in the UI
3. **TDD approach** — All features have corresponding tests
4. **Middleware-based access** — Real security, not just UI hiding

### API Endpoints
- `GET /dashboard/api/leads` — List all leads
- `GET /dashboard/api/leads/[id]` — Get single lead
- `PATCH /dashboard/api/leads/[id]` — Update lead (notes, etc.)
- `GET /dashboard/api/metrics` — Get dashboard metrics

---

Questions? Contact the development team.
