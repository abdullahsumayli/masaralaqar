-- ── Migration 043: Enable RLS on ai_agents and office_settings ───────────────
-- Fixes Security Advisor errors:
--   • Policy Exists RLS Disabled  → public.ai_agents
--   • RLS Disabled in Public      → public.ai_agents
--   • RLS Disabled in Public      → public.office_settings
--
-- Pattern: same as offices table — users access own office's rows via
-- get_my_office_id(); service_role retains unrestricted access for the
-- AI engine, webhooks, and server-side operations.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ai_agents ────────────────────────────────────────────────────────────────

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Service role: unrestricted (AI engine reads agent config on every message)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_agents'
      AND policyname = 'service_role_all_ai_agents'
  ) THEN
    CREATE POLICY service_role_all_ai_agents ON public.ai_agents
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users: read own office's agent config
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_agents'
      AND policyname = 'users_select_own_ai_agent'
  ) THEN
    CREATE POLICY users_select_own_ai_agent ON public.ai_agents
      FOR SELECT TO authenticated
      USING (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: create agent for own office
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_agents'
      AND policyname = 'users_insert_own_ai_agent'
  ) THEN
    CREATE POLICY users_insert_own_ai_agent ON public.ai_agents
      FOR INSERT TO authenticated
      WITH CHECK (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: update own office's agent
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_agents'
      AND policyname = 'users_update_own_ai_agent'
  ) THEN
    CREATE POLICY users_update_own_ai_agent ON public.ai_agents
      FOR UPDATE TO authenticated
      USING (office_id = get_my_office_id())
      WITH CHECK (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: delete own office's agent
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_agents'
      AND policyname = 'users_delete_own_ai_agent'
  ) THEN
    CREATE POLICY users_delete_own_ai_agent ON public.ai_agents
      FOR DELETE TO authenticated
      USING (office_id = get_my_office_id());
  END IF;
END $$;


-- ── office_settings ──────────────────────────────────────────────────────────

ALTER TABLE public.office_settings ENABLE ROW LEVEL SECURITY;

-- Service role: unrestricted
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'office_settings'
      AND policyname = 'service_role_all_office_settings'
  ) THEN
    CREATE POLICY service_role_all_office_settings ON public.office_settings
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users: read own office's settings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'office_settings'
      AND policyname = 'users_select_own_office_settings'
  ) THEN
    CREATE POLICY users_select_own_office_settings ON public.office_settings
      FOR SELECT TO authenticated
      USING (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: create settings for own office
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'office_settings'
      AND policyname = 'users_insert_own_office_settings'
  ) THEN
    CREATE POLICY users_insert_own_office_settings ON public.office_settings
      FOR INSERT TO authenticated
      WITH CHECK (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: update own office's settings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'office_settings'
      AND policyname = 'users_update_own_office_settings'
  ) THEN
    CREATE POLICY users_update_own_office_settings ON public.office_settings
      FOR UPDATE TO authenticated
      USING (office_id = get_my_office_id())
      WITH CHECK (office_id = get_my_office_id());
  END IF;
END $$;

-- Authenticated users: delete own office's settings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'office_settings'
      AND policyname = 'users_delete_own_office_settings'
  ) THEN
    CREATE POLICY users_delete_own_office_settings ON public.office_settings
      FOR DELETE TO authenticated
      USING (office_id = get_my_office_id());
  END IF;
END $$;
