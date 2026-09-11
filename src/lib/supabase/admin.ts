import { createClient } from '@supabase/supabase-js';

/**
 * Creates a privileged Supabase Admin client using the Service Role Key.
 * MUST ONLY be called on the server side (Route Handlers, Server Actions).
 * NEVER expose this or call this in browser components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!serviceRoleKey) {
    // Return null or placeholder client in preview environments without secret configured
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
