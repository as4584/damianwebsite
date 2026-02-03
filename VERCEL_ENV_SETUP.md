# Vercel Environment Variables Setup

## CRITICAL: Required for Production

The following environment variables MUST be configured in Vercel Dashboard for the production deployment to work correctly.

### How to Configure

1. Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add each variable below for **Production** environment

---

## Required Environment Variables

### Authentication (NextAuth)

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXTAUTH_URL` | `https://innovationdevelopmentsolutions.com` | Production |
| `NEXTAUTH_SECRET` | Your secret (generate with `openssl rand -base64 32`) | Production |

### Supabase Database

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yktdxshpgsrdawnawifn.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (from Supabase Dashboard → API) | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (KEEP SECRET) | Production |

### OpenAI Chatbot (CRITICAL)

| Variable | Value | Scope |
|----------|-------|-------|
| `OPENAI_KEY` | `sk-proj-...` (Your OpenAI API key) | Production |

⚠️ **Without `OPENAI_KEY`, the chatbot will:**
- Not provide intelligent responses
- Fall back to basic deterministic flow only
- Log warning: `[Chat API] OPENAI_KEY not found - intelligence features disabled`

### How to Get Your OpenAI Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Ensure your project has access to `gpt-4o-mini` model
4. Add the key to Vercel environment variables as `OPENAI_KEY`

---

## Dashboard Subdomain Configuration

For `dashboard.innovationdevelopmentsolutions.com` to work:

### Vercel Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `dashboard.innovationdevelopmentsolutions.com`
3. Point it to the **same** Vercel project
4. The middleware will handle routing:
   - Unauthenticated users → `/login`
   - Authenticated users → `/dashboard`

### DNS Configuration

Ensure your DNS has:
```
dashboard.innovationdevelopmentsolutions.com → CNAME → cname.vercel-dns.com
```

---

## Verification

After setting environment variables:

1. Redeploy your project (Vercel → Deployments → Redeploy)
2. Test chatbot at `https://innovationdevelopmentsolutions.com`
3. Test dashboard at `https://dashboard.innovationdevelopmentsolutions.com`

### Debugging

Check Vercel Function Logs for:
- `[Chat API] GPT-4o-mini initialized with key` → ✅ Working
- `[Chat API] OPENAI_KEY not found` → ❌ Missing key

---

## Security Notes

- NEVER commit API keys to source control
- Use Vercel environment variables exclusively for secrets
- Rotate keys periodically
- Use project-scoped OpenAI keys for budget control
