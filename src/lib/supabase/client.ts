import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseServiceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!supabaseServiceClient) {
    try {
      supabaseServiceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase service client:', err);
      return null;
    }
  }

  return supabaseServiceClient;
}
