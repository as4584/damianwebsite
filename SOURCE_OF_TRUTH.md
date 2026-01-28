# 🎯 SOURCE OF TRUTH - Project Configuration

**Last Updated:** January 28, 2026  
**Purpose:** Single source of truth to prevent configuration mistakes

---

## 🌐 DOMAIN CONFIGURATION

### ✅ CORRECT DOMAINS (USE THESE)
- **Production Domain:** `innovationdevelopmentsolutions.com`
- **Dashboard Subdomain:** `dashboard.innovationdevelopmentsolutions.com`
- **Vercel App:** `damianwebsite.vercel.app`

### ❌ NEVER USE THESE DOMAINS
- ~~lexmakesit.com~~ (WRONG - DO NOT USE)
- ~~dashboard.lexmakesit.com~~ (WRONG - DO NOT USE)

---

## 🚀 DEPLOYMENT CONFIGURATION

### Platform
- **Hosting:** Vercel
- **Repository:** GitHub - https://github.com/as4584/damianwebsite.git
- **Branch:** main
- **Deployment:** Automatic on push to main

### Vercel Project
- **Project Name:** damianwebsite
- **Framework:** Next.js 14.2.35
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 🔐 ENVIRONMENT VARIABLES

### Production (.env.production)
```env
NEXT_PUBLIC_SITE_URL=https://innovationdevelopmentsolutions.com
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.innovationdevelopmentsolutions.com
NEXTAUTH_URL=https://innovationdevelopmentsolutions.com
NEXTAUTH_SECRET=<generate-secure-secret-minimum-32-chars>
DEFAULT_BUSINESS_ID=biz_innovation_001
NODE_ENV=production
```

### Development (.env.local)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_DASHBOARD_URL=http://dashboard.localhost:3001
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-key-change-in-production
DEFAULT_BUSINESS_ID=biz_innovation_001
NODE_ENV=development
```

---

## 🔑 AUTHENTICATION

### Test Credentials (Development Only)
- **Email:** test@innovation.com
- **Password:** King1000$
- **Business ID:** biz_innovation_001

### Production Credentials
- **Must be configured separately in production**
- **Never commit production credentials to GitHub**
- **Use Vercel environment variables**

---

## 📁 PROJECT STRUCTURE

```
/root/damaian/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage (innovationdevelopmentsolutions.com)
│   ├── dashboard/               # Protected dashboard
│   │   └── page.tsx            # Dashboard UI
│   └── api/                     # API routes
│       ├── chat/                # Chatbot API
│       └── auth/                # NextAuth endpoints
├── chatbot/                     # Chatbot logic & components
├── components/                  # Reusable UI components
├── lib/                         # Utilities & database
│   ├── db/                      # In-memory databases
│   └── auth/                    # Authentication helpers
├── middleware.ts                # Route protection & subdomain routing
├── e2e/                         # Playwright E2E tests
└── scripts/                     # Deployment scripts
```

---

## 🛣️ ROUTING CONFIGURATION

### Main Site (innovationdevelopmentsolutions.com)
- `/` - Homepage
- `/about` - About page
- `/services` - Services page
- `/industries` - Industries page
- `/who-we-serve` - Who we serve page
- `/contact` - Contact page
- `/starting-a-business` - Starting a business page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Dashboard (dashboard.innovationdevelopmentsolutions.com)
- `/` - Protected dashboard (requires authentication)
- Redirects to `/api/auth/signin` if not authenticated

### Middleware Rules
```typescript
// Subdomain routing in middleware.ts
if (hostname === 'dashboard.innovationdevelopmentsolutions.com' || 
    hostname === 'dashboard.localhost') {
  // Route to /dashboard
  // Require authentication
}
```

---

## 🗄️ DATABASE CONFIGURATION

### Current (Development)
- **Type:** In-memory Map storage
- **Files:** `lib/db/mock-db.ts`, `lib/db/leads-db.ts`
- **Data Persistence:** None (resets on restart)

### Future (Production)
- **Type:** PostgreSQL (planned)
- **Provider:** To be determined (Supabase/Vercel Postgres/etc.)
- **Migration:** Required before production launch

---

## 🧪 TESTING

### Test Suites
1. **Confidence Score Tests:** `e2e/confidence-score.spec.ts`
   - Validates mock data elimination
   - Code quality checks (100/100 target)

2. **Auth Dashboard Tests:** `e2e/auth-dashboard.spec.ts`
   - Authentication flow validation
   - Protected route access

3. **Production Ready Tests:** `e2e/production-ready.spec.ts`
   - End-to-end production validation
   - Real data flow testing

### Running Tests
```bash
# All tests
npx playwright test

# Specific suite
npx playwright test e2e/confidence-score.spec.ts

# With UI
npx playwright test --ui

# Headed mode
npx playwright test --headed
```

---

## 📦 DEPENDENCIES

### Core
- **Next.js:** 14.2.35 (App Router)
- **React:** 18.3.1
- **NextAuth.js:** 4.24.7 (Authentication)
- **bcryptjs:** 3.0.3 (Password hashing)

### Testing
- **Playwright:** Latest (E2E testing)
- **Jest:** 29.7.0 (Unit testing)

### UI
- **Tailwind CSS:** 3.4.1
- **Framer Motion:** 11.5.6 (Animations)
- **Radix UI:** Various (Accessible components)

---

## 🔄 DEPLOYMENT WORKFLOW

### Automatic (GitHub → Vercel)
1. Push to `main` branch on GitHub
2. Vercel automatically detects changes
3. Runs build process (`npm run build`)
4. Deploys to production if build succeeds
5. Updates DNS for all configured domains

### Manual Verification
```bash
# Run verification script
./scripts/verify-deployment.sh

# Check test suite
npx playwright test

# Validate build locally
npm run build
```

---

## 🚨 CRITICAL RULES

### ✅ DO THIS
- Always use `innovationdevelopmentsolutions.com` domain
- Always use `dashboard.innovationdevelopmentsolutions.com` subdomain
- Deploy through GitHub → Vercel (automatic)
- Run verification script before pushing
- Keep this SOURCE_OF_TRUTH.md updated

### ❌ NEVER DO THIS
- Use `lexmakesit.com` or related domains
- Commit production secrets to GitHub
- Deploy without running tests
- Modify Vercel settings without updating this doc
- Change domains without updating all references

---

## 📞 VERCEL CONFIGURATION

### Domain Settings (Current)
- ✅ `dashboard.innovationdevelopmentsolutions.com` (Production)
- ✅ `innovationdevelopmentsolutions.com` (Production)
- ✅ `damianwebsite.vercel.app` (Valid Configuration)

### DNS Configuration
- **Type:** CNAME
- **Name:** `dashboard`
- **Value:** `cname.vercel-dns.com` (Vercel manages this)

### Build Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x

---

## 🔍 TROUBLESHOOTING

### Wrong Domain Issues
1. Check this SOURCE_OF_TRUTH.md for correct domains
2. Search codebase for incorrect domain references:
   ```bash
   grep -r "lexmakesit" .
   ```
3. Update all references to use correct domains
4. Commit and push to trigger Vercel rebuild

### Deployment Failures
1. Check Vercel dashboard for build logs
2. Run `npm run build` locally to test
3. Verify environment variables in Vercel
4. Check GitHub Actions for verification results

### Authentication Issues
1. Verify NEXTAUTH_URL matches actual domain
2. Check NEXTAUTH_SECRET is set in Vercel
3. Verify middleware.ts hostname matching
4. Test with correct test credentials

---

## 📝 UPDATE LOG

| Date | Change | Updated By |
|------|--------|------------|
| Jan 28, 2026 | Created source of truth document | System |
| Jan 28, 2026 | Fixed all lexmakesit.com references | System |

---

## ✅ VERIFICATION CHECKLIST

Before any deployment, verify:
- [ ] All domain references use `innovationdevelopmentsolutions.com`
- [ ] Dashboard subdomain uses `dashboard.innovationdevelopmentsolutions.com`
- [ ] No references to `lexmakesit.com` anywhere
- [ ] Environment variables match this document
- [ ] Middleware hostname checks are correct
- [ ] Verification script passes (100%)
- [ ] Tests pass (≥80% pass rate)
- [ ] Build succeeds locally (`npm run build`)

---

**If you see `lexmakesit.com` anywhere in the codebase, IT'S A BUG - FIX IT IMMEDIATELY!**
