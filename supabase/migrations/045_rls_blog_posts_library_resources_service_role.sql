-- ── Migration 045: Scope blog_posts and library_resources policies to service_role
--
-- Both tables had "Allow all operations" policies without role restriction,
-- meaning any authenticated user could mutate admin-only content directly
-- via Supabase client. Scoped to service_role since all writes go through
-- server-side API routes.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Allow all posts operations" ON public.blog_posts;
CREATE POLICY service_role_all_blog_posts ON public.blog_posts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all resources operations" ON public.library_resources;
CREATE POLICY service_role_all_library_resources ON public.library_resources
  FOR ALL TO service_role USING (true) WITH CHECK (true);
