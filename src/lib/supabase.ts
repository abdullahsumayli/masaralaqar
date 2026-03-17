import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

let _supabaseAdmin: SupabaseClient | null = null;

// Browser client — uses cookies for session storage so API routes can read auth
// createBrowserClient is safe to call multiple times (singleton internally)
export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Backward-compatible export used throughout the codebase
export const supabase = (() => {
  if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
    return getSupabaseBrowserClient() as unknown as SupabaseClient;
  }
  // Server-side or build: use regular createClient (no session persistence needed)
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createClient("https://placeholder.supabase.co", "placeholder-key");
})();

// Server-side admin client with service role key (bypasses RLS)
export const supabaseAdmin = (() => {
  if (!_supabaseAdmin && supabaseUrl && supabaseServiceRoleKey) {
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  // Fallback to regular client if service role not available
  if (!_supabaseAdmin) {
    return supabase;
  }
  return _supabaseAdmin;
})();
