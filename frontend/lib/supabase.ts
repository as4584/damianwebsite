/**
 * @deprecated
 * This file is deprecated. Use @/lib/supabase/client instead.
 * 
 * For migration:
 * ```typescript
 * // OLD (deprecated):
 * import { supabase } from '@/lib/supabase';
 * 
 * // NEW (required):
 * import { getSupabaseClient } from '@/lib/supabase/client';
 * const supabase = getSupabaseClient();
 * ```
 */

import { getSupabaseClient } from './supabase/client';

/**
 * @deprecated Use getSupabaseClient() from @/lib/supabase/client
 */
export const supabase = getSupabaseClient();
