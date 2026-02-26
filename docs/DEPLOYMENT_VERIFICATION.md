# Dashboard Subdomain Deployment Verification Checklist

**Target:** `https://dashboard.innovationdevelopmentsolutions.com`  
**Commit:** `7056228`  
**Date:** January 28, 2026

---

## Pre-Deployment Status ✅

- [x] **All tests pass**: 112/112 tests passing
  - [x] 14 subdomain routing tests
  - [x] 98 dashboard functionality tests
- [x] **Build successful**: `npm run build` completes with no errors
- [x] **Local subdomain routing verified**:
  - [x] dashboard.localhost → dashboard loads (rewrite detected)
  - [x] localhost → homepage loads
  - [x] localhost/dashboard → redirects to /
  - [x] dashboard.localhost/dashboard → allows
- [x] **Middleware active**: `x-middleware-rewrite: /dashboard` header confirmed
- [x] **Code pushed to GitHub**: Commit `7056228`

---

## DNS Configuration (Required)

### Step 1: Add DNS Record

**DNS Provider:** [Your DNS provider - e.g., Cloudflare, GoDaddy, Namecheap]

**Record to add:**
```
Type:  CNAME
Name:  dashboard
Value: cname.vercel-dns.com  (or your hosting provider's CNAME)
TTL:   3600 (1 hour)
```

**Verification command:**
```bash
dig dashboard.innovationdevelopmentsolutions.com +short
```

**Expected output:** Should resolve to your hosting provider's domain

### Step 2: Wait for DNS Propagation

- [ ] DNS record added to provider
- [ ] Wait 5-60 minutes for propagation
- [ ] Run `dig` command to verify resolution
- [ ] Check from multiple locations: https://dnschecker.org

---

## Hosting Configuration (Vercel)

### Step 1: Add Domain to Vercel Project

**Via Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `dashboard.innovationdevelopmentsolutions.com`
4. Click "Add"

**Via CLI:**
```bash
vercel domains add dashboard.innovationdevelopmentsolutions.com
```

### Step 2: Verify Domain in Vercel

- [ ] Domain added to Vercel project
- [ ] Vercel shows "Valid Configuration" (green checkmark)
- [ ] SSL certificate provisioned automatically (1-2 minutes)

---

## Production Deployment

### Deploy to Production

```bash
# Option 1: Manual deployment via CLI
vercel --prod

# Option 2: Automatic via GitHub
# (Already pushed to main branch - auto-deploys if GitHub integration enabled)
```

### Verify Deployment

- [ ] Deployment successful in Vercel dashboard
- [ ] Build logs show no errors
- [ ] Deployment URL accessible

---

## Post-Deployment Verification

### ✅ DNS Resolution

```bash
dig dashboard.innovationdevelopmentsolutions.com
```

**Expected:** CNAME pointing to Vercel/hosting provider

**Status:** [ ] PASS [ ] FAIL

---

### ✅ HTTPS Certificate

```bash
curl -I https://dashboard.innovationdevelopmentsolutions.com
```

**Expected:** HTTP/2 200, valid SSL certificate (no warnings)

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Subdomain Serves Dashboard (NOT Homepage)

```bash
curl -s https://dashboard.innovationdevelopmentsolutions.com | grep -o "<title>[^<]*</title>"
```

**Expected:** `<title>Leads Dashboard | Innovation Development Solutions</title>`  
**NOT:** `<title>Innovation Business Development Solutions...</title>` (homepage)

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Main Domain Serves Homepage

```bash
curl -s https://innovationdevelopmentsolutions.com | grep -o "<title>[^<]*</title>"
```

**Expected:** `<title>Innovation Business Development Solutions...</title>`

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Main Domain /dashboard Redirects

```bash
curl -I https://innovationdevelopmentsolutions.com/dashboard
```

**Expected:** HTTP 307 redirect to `/`

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Dashboard API Endpoints

```bash
# Test leads endpoint
curl https://dashboard.innovationdevelopmentsolutions.com/api/leads

# Test metrics endpoint
curl https://dashboard.innovationdevelopmentsolutions.com/api/metrics
```

**Expected:** Valid JSON responses (may be empty arrays/objects if no data yet)

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Dashboard UI Loads Correctly

**In Browser:** Visit `https://dashboard.innovationdevelopmentsolutions.com`

**Visual checks:**
- [ ] Dashboard layout loads (not homepage)
- [ ] Header shows "Leads Dashboard"
- [ ] Metrics cards visible: Total Leads, Hot Leads, Warm Leads, Cold Leads
- [ ] Lead list section visible (may show "No leads yet" if empty)
- [ ] Footer shows "Innovation Development Solutions — Leads Dashboard"
- [ ] NO homepage hero section
- [ ] NO "Get Started" CTA buttons from homepage

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Metrics Render Correctly

**Visual checks:**
- [ ] Metrics cards show numbers (or loading state)
- [ ] Card styling correct (white background, shadow, rounded corners)
- [ ] Icons/emojis display (🔥 ⚡ ❄️)

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Leads Display Correctly

**Visual checks (if leads exist):**
- [ ] Lead cards show in list
- [ ] Hotness indicators visible (🔥 Hot, ⚡ Warm, ❄️ Cold)
- [ ] Lead names/emails/dates display
- [ ] Cards clickable (cursor changes on hover)

**Status:** [ ] PASS [ ] N/A (no leads yet)

---

### ✅ Lead Detail View Works

**Test (if leads exist):**
1. Click any lead card
2. Lead detail page/modal opens
3. Full lead information displays:
   - Contact info (name, email, phone)
   - Intent classification
   - Conversation history
   - Hotness indicator with explanation

**Status:** [ ] PASS [ ] N/A (no leads yet)

---

### ✅ Hover Explanations Work

**Test (if leads exist):**
1. Hover over "Hot Lead" / "Warm Lead" / "Cold Lead" label
2. Tooltip appears with scoring explanation

**Status:** [ ] PASS [ ] N/A (no leads yet)

---

### ✅ Suggested Actions Work

**Test (if leads exist):**
1. Open lead detail view
2. Check "Suggested Actions" section
3. AI-generated actions display
4. Actions are relevant to lead's intent

**Status:** [ ] PASS [ ] N/A (no leads yet)

---

### ✅ Middleware Active

```bash
curl -v https://dashboard.innovationdevelopmentsolutions.com 2>&1 | grep -i "x-middleware"
```

**Expected:** `x-middleware-rewrite: /dashboard` header present

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Performance

**Test:**
1. Visit dashboard in browser
2. Open DevTools → Network tab
3. Refresh page
4. Check "Load" time

**Expected:** Page loads in < 3 seconds

**Status:** [ ] PASS [ ] FAIL

---

### ✅ Console Errors

**Test:**
1. Visit dashboard in browser
2. Open DevTools → Console tab
3. Check for errors

**Expected:** NO errors (warnings OK)

**Status:** [ ] PASS [ ] FAIL

---

## Browser Testing

### Desktop Testing

- [ ] **Chrome** (latest): Dashboard loads correctly
- [ ] **Firefox** (latest): Dashboard loads correctly
- [ ] **Safari** (latest): Dashboard loads correctly
- [ ] **Edge** (latest): Dashboard loads correctly

### Mobile Testing

- [ ] **Mobile Chrome**: Responsive layout works
- [ ] **Mobile Safari**: Responsive layout works
- [ ] **Mobile Firefox**: Responsive layout works

---

## Continuous Monitoring Setup (Optional)

### Uptime Monitoring

**Recommended services:**
- [ ] UptimeRobot (free tier)
- [ ] Pingdom
- [ ] StatusCake

**Monitor URL:** `https://dashboard.innovationdevelopmentsolutions.com`

### SSL Monitoring

**Check certificate expiry:**
```bash
echo | openssl s_client -servername dashboard.innovationdevelopmentsolutions.com -connect dashboard.innovationdevelopmentsolutions.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Set up alerts:**
- [ ] SSL expiry notification (30 days before)
- [ ] Vercel auto-renews Let's Encrypt certificates

---

## Success Criteria (ALL must be ✅)

- [ ] DNS resolves to hosting provider
- [ ] HTTPS certificate valid (no warnings)
- [ ] Dashboard subdomain loads dashboard (NOT homepage)
- [ ] Main domain loads homepage (NOT dashboard)
- [ ] Main domain /dashboard redirects to /
- [ ] Metrics cards display correctly
- [ ] Lead list displays (or shows "No leads yet")
- [ ] API endpoints return valid JSON
- [ ] NO console errors
- [ ] Page loads in < 3 seconds
- [ ] Responsive on mobile
- [ ] Middleware header present (x-middleware-rewrite)

---

## Rollback Plan

**If ANY verification fails:**

1. **Identify failing component:**
   - DNS issue → Wait for propagation or fix DNS record
   - SSL issue → Check Vercel domain verification
   - Routing issue → Check middleware logs in Vercel
   - UI issue → Check browser console for errors

2. **Quick rollback (if needed):**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   
   # Or redeploy previous deployment in Vercel dashboard
   # Deployments → Previous Deployment → Promote to Production
   ```

3. **Remove subdomain (temporary):**
   - Delete CNAME record for `dashboard`
   - Subdomain will stop resolving (404)
   - Main domain unaffected

---

## Final Sign-Off

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________

**All checks passed:** [ ] YES [ ] NO

**If NO, issues found:**
_______________________________________________
_______________________________________________
_______________________________________________

**Resolution:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## Notes

- Keep this checklist for future subdomain deployments
- Update with any new issues/resolutions discovered
- Share with team for reference

**Documentation:**
- Full deployment guide: [SUBDOMAIN_DEPLOYMENT.md](./SUBDOMAIN_DEPLOYMENT.md)
- Main README: [README.md](./README.md)

**Support:**
- GitHub Issues: https://github.com/as4584/damianwebsite/issues
- Vercel Logs: `vercel logs --follow`
