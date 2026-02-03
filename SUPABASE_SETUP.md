# Supabase Setup Guide for Production

## What is Supabase?
Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database (real, persistent data storage)
- Real-time subscriptions
- Row-level security
- Auto-generated APIs
- Built-in authentication (optional, we use NextAuth)

## Why You Need It
Currently, your app uses **in-memory storage** which means:
- ❌ All leads are lost when server restarts
- ❌ Can't scale across multiple servers
- ❌ No data persistence
- ❌ Can't handle production traffic

With Supabase:
- ✅ Persistent PostgreSQL database
- ✅ Data survives server restarts
- ✅ Scales automatically
- ✅ Real production-ready storage

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Free tier includes:
   - 500 MB database
   - 2 GB bandwidth
   - 50,000 monthly active users

## Step 2: Create New Project

1. Click "New Project"
2. Choose organization (or create one)
3. Fill in project details:
   - **Name**: innovation-leads-db (or your choice)
   - **Database Password**: Generate strong password and SAVE IT
   - **Region**: Choose closest to your users (e.g., East US)
   - **Pricing Plan**: Start with Free

4. Click "Create new project"
5. Wait 2-3 minutes for setup

## Step 3: Get Your API Credentials

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** section
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (different long string)

4. Copy these THREE values - you'll need them!

## Step 4: Create Database Tables

1. Click **SQL Editor** in sidebar
2. Click **New query**
3. Paste and run this SQL:

```sql
-- Create leads table
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  source JSONB NOT NULL DEFAULT '{}',
  conversation JSONB NOT NULL DEFAULT '[]',
  intent TEXT NOT NULL,
  hotness TEXT NOT NULL CHECK (hotness IN ('hot', 'warm', 'cold')),
  hotness_factors JSONB NOT NULL DEFAULT '[]',
  extracted_info JSONB NOT NULL DEFAULT '{}',
  suggested_action JSONB NOT NULL DEFAULT '{}',
  internal_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_hotness ON leads(hotness);
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see leads from their business
CREATE POLICY "Users can view their business leads"
  ON leads
  FOR SELECT
  USING (business_id = current_setting('app.current_business_id', true));

-- Create policy: System can insert any lead
CREATE POLICY "System can insert leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy: Users can update their business leads
CREATE POLICY "Users can update their business leads"
  ON leads
  FOR UPDATE
  USING (business_id = current_setting('app.current_business_id', true));

-- Optional: Create businesses table for multi-tenant support
CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed your business
INSERT INTO businesses (id, name, owner_email)
VALUES ('biz_innovation_001', 'Innovation Business Development Solutions', 'admin@innovationdevelopmentsolutions.com');
```

4. Click **RUN** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 5: Configure Your App

1. Open `.env.production` in your project
2. Update these lines with YOUR credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_SERVICE_KEY
```

3. Save the file

## Step 6: Test Locally

1. Copy your production env to local for testing:
```bash
cp .env.production .env.local
```

2. Restart your dev server:
```bash
npm run dev
```

3. Check the console - you should see:
   - ✅ No more "Supabase Fetch Failed" errors
   - ✅ Leads saved to database persist after restart

## Step 7: Verify It's Working

1. Go to http://localhost:3000
2. Open the chat widget and create a test lead
3. Go to http://localhost:3000/dashboard
4. You should see the lead!

5. Stop the server (`Ctrl+C`)
6. Restart the server (`npm run dev`)
7. Refresh the dashboard - **lead should still be there!**

## Step 8: Check Your Data in Supabase

1. Go back to Supabase dashboard
2. Click **Table Editor** in sidebar
3. Click **leads** table
4. You should see your test leads!

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. Add environment variables in your hosting platform
2. Use the same credentials from `.env.production`
3. Make sure to set:
   - `NEXTAUTH_URL` to your production domain
   - `NEXT_PUBLIC_SITE_URL` to your production domain

## Security Notes

⚠️ **NEVER commit `.env.production` or `.env.local` to Git!**

The `.gitignore` already excludes these files, but double-check:
- ❌ Don't share your `service_role` key publicly
- ✅ The `anon` key is safe to use in client-side code
- ✅ Row Level Security protects your data

## Cost Estimate

**Free tier limits:**
- 500 MB database (holds ~50,000+ leads)
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users

**When to upgrade ($25/month):**
- More than 8 GB database
- More than 100 GB bandwidth
- More than 100,000 monthly users
- Need automatic backups

## Troubleshooting

**"Invalid API key" error:**
- Double-check you copied the full key (very long!)
- Make sure there are no spaces or line breaks
- Verify you're using the right project

**"No rows returned" but no lead in dashboard:**
- Check browser console for errors
- Verify `business_id` matches: `biz_innovation_001`
- Check Supabase Table Editor to see if data is there

**Row Level Security blocking everything:**
- Make sure policies were created correctly
- For testing, you can temporarily disable RLS:
  ```sql
  ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
  ```

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Your app's support: Check the error logs in your terminal

---

**Ready to go?** Once you complete steps 1-6, your app will have a real database and be production-ready! 🚀
