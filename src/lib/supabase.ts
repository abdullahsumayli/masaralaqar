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

// ── Blog Posts ───────────────────────────────────────────────

export async function getAllBlogPosts(publishedOnly: boolean = true) {
  let query = supabaseAdmin.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (publishedOnly) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function createBlogPost(post: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ── Library Resources ────────────────────────────────────────

export async function getAllLibraryResources(publishedOnly: boolean = true) {
  let query = supabaseAdmin.from("library_resources").select("*").order("created_at", { ascending: false });
  if (publishedOnly) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createLibraryResource(resource: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("library_resources")
    .insert(resource)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLibraryResource(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("library_resources")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLibraryResource(id: string) {
  const { error } = await supabaseAdmin.from("library_resources").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ── Bot Subscriptions ────────────────────────────────────────

export async function getBotSubscriptionByPhone(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("bot_subscriptions")
    .select("*")
    .eq("phone", phone)
    .single();
  return { data, error };
}
