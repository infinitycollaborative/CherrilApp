import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for privileged server-side operations (e.g. fully
 * deleting an auth user). Returns null when the service role key isn't
 * configured so callers can fall back gracefully. NEVER import this into
 * client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
