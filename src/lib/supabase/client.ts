import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a browser-safe Supabase client using @supabase/ssr.
 * Only public anon key is used. Never privileged secrets.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
