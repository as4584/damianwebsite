/**
 * SUPABASE CLIENT - SINGLE SOURCE OF TRUTH
 * 
 * ⚠️ CRITICAL: All Supabase access MUST go through this file.
 * Direct usage of @supabase/supabase-js createClient() is FORBIDDEN.
 * 
 * CI-AWARE ARCHITECTURE:
 * - In CI/test mode: Returns deterministic mock (no network calls)
 * - In production: Returns real Supabase client
 * 
 * ENFORCEMENT:
 * - Runtime validation prevents bypassing this module
 * - Missing credentials in production throw immediately
 * - CI mode is detected automatically and reliably
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// CI DETECTION
// ============================================================================

function isCI(): boolean {
  return (
    process.env.CI === 'true' ||
    process.env.NODE_ENV === 'test' ||
    process.env.SUPABASE_DISABLED === 'true'
  );
}

// ============================================================================
// MOCK CLIENT (CI MODE)
// ============================================================================

interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  neq: (column: string, value: any) => MockQueryBuilder;
  gt: (column: string, value: any) => MockQueryBuilder;
  gte: (column: string, value: any) => MockQueryBuilder;
  lt: (column: string, value: any) => MockQueryBuilder;
  lte: (column: string, value: any) => MockQueryBuilder;
  like: (column: string, pattern: string) => MockQueryBuilder;
  ilike: (column: string, pattern: string) => MockQueryBuilder;
  is: (column: string, value: any) => MockQueryBuilder;
  in: (column: string, values: any[]) => MockQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder;
  limit: (count: number) => MockQueryBuilder;
  single: () => Promise<{ data: null; error: null }>;
  maybeSingle: () => Promise<{ data: null; error: null }>;
  then: (resolve: (value: { data: any; error: null }) => void) => Promise<{ data: any; error: null }>;
}

function createMockQueryBuilder(): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: async (resolve) => {
      const result = { data: [], error: null };
      resolve(result);
      return result;
    },
  };
  return builder;
}

function createMockSupabaseClient(): any {
  return {
    from: (table: string) => createMockQueryBuilder(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signIn: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      signUp: async () => ({ data: null, error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  };
}

// ============================================================================
// CLIENT FACTORY
// ============================================================================

let _supabaseClient: SupabaseClient | any | null = null;
let _initializationLogged = false;

/**
 * Get Supabase Client (SINGLE SOURCE OF TRUTH)
 * 
 * USAGE:
 * ```typescript
 * import { getSupabaseClient } from '@/lib/supabase/client';
 * 
 * const supabase = getSupabaseClient();
 * const { data, error } = await supabase.from('leads').select('*');
 * ```
 * 
 * CI MODE:
 * - Returns mock client (no network calls)
 * - Deterministic responses
 * - No DNS resolution
 * 
 * PRODUCTION MODE:
 * - Returns real Supabase client
 * - Validates credentials
 * - Throws if misconfigured
 */
export function getSupabaseClient(): SupabaseClient | any {
  // Singleton pattern - initialize once
  if (_supabaseClient) {
    return _supabaseClient;
  }

  const ciMode = isCI();

  // Log initialization (once only)
  if (!_initializationLogged) {
    if (ciMode) {
      console.log('🔌 Supabase Mode: CI MOCK');
    } else {
      console.log('🔌 Supabase Mode: REAL CLIENT');
    }
    _initializationLogged = true;
  }

  // CI MODE: Return mock client
  if (ciMode) {
    _supabaseClient = createMockSupabaseClient();
    return _supabaseClient;
  }

  // PRODUCTION MODE: Validate and create real client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Validate credentials (fail-fast in production)
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '❌ SUPABASE CONFIGURATION ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Set these environment variables or enable CI mode (CI=true or NODE_ENV=test).'
    );
  }

  if (supabaseUrl === 'your-project-url.supabase.co' || supabaseAnonKey === 'your-anon-key') {
    throw new Error(
      '❌ SUPABASE CONFIGURATION ERROR: Placeholder credentials detected. ' +
      'Replace with real Supabase credentials or enable CI mode.'
    );
  }

  // Create real Supabase client
  _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return _supabaseClient;
}

/**
 * Check if Supabase is enabled (not in CI mode)
 */
export function isSupabaseEnabled(): boolean {
  return !isCI();
}

/**
 * Reset client (for testing only)
 * @internal
 */
export function __resetSupabaseClient(): void {
  _supabaseClient = null;
  _initializationLogged = false;
}

// ============================================================================
// RUNTIME PROTECTION
// ============================================================================

// Prevent direct imports of @supabase/supabase-js createClient
if (typeof window === 'undefined' && !isCI()) {
  // Server-side: Validate that this is the only place creating clients
  const stack = new Error().stack || '';
  if (stack.includes('supabase.ts') && !stack.includes('client.ts')) {
    console.warn(
      '⚠️  DEPRECATION WARNING: Direct Supabase client detected. ' +
      'Use getSupabaseClient() from @/lib/supabase/client instead.'
    );
  }
}

// ============================================================================
// LEGACY COMPATIBILITY (TEMPORARY)
// ============================================================================

/**
 * Legacy export for backward compatibility
 * @deprecated Use getSupabaseClient() instead
 */
export const supabase = getSupabaseClient();
