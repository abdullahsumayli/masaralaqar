-- ── Migration 044: Fix function search_path + scope service_role policies ────
--
-- Fixes Security Advisor warnings:
--   • Function Search Path Mutable → update_updated_at, get_my_office_id, sync_office_name
--   • RLS Policy Always True (roles unscoped) → whatsapp_sessions, conversation_messages,
--     whatsapp_onboarding_events
--
-- Intentionally NOT changed (false positives):
--   • blog_posts / library_resources  — admin CMS content managed server-side only
--   • trial_requests INSERT true      — anonymous users submit trial interest, by design
--   • auth_leaked_password_protection — dashboard setting, not SQL
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. Fix function search_path ───────────────────────────────────────────────
-- Without SET search_path, a SECURITY DEFINER function could be tricked into
-- resolving table/function names from an attacker-controlled schema.
-- Fix: pin search_path to '' and fully-qualify every schema reference.

CREATE OR REPLACE FUNCTION public.get_my_office_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT office_id FROM public.users WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_office_name()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  IF NEW.name IS NULL AND NEW.office_name IS NOT NULL THEN
    NEW.name := NEW.office_name;
  END IF;
  IF NEW.office_name IS NULL AND NEW.name IS NOT NULL THEN
    NEW.office_name := NEW.name;
  END IF;
  RETURN NEW;
END;
$$;


-- ── 2. Scope "always true" service_role policies to service_role only ─────────
-- Policies created without TO <role> apply to ALL roles (including anon).
-- Replacing them with TO service_role scopes them correctly.

-- whatsapp_sessions
DROP POLICY IF EXISTS full_access ON public.whatsapp_sessions;
CREATE POLICY service_role_all_whatsapp_sessions ON public.whatsapp_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- conversation_messages
DROP POLICY IF EXISTS "Service role full access on conversation_messages" ON public.conversation_messages;
CREATE POLICY service_role_all_conversation_messages ON public.conversation_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- whatsapp_onboarding_events
DROP POLICY IF EXISTS whatsapp_onboarding_events_service_role ON public.whatsapp_onboarding_events;
CREATE POLICY service_role_all_whatsapp_onboarding_events ON public.whatsapp_onboarding_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);
