import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      `Missing Supabase credentials: URL=${url ? 'set' : 'MISSING'}, KEY=${key ? 'set' : 'MISSING'}`,
    );
  }

  _client = createClient(url, key);
  return _client;
}
