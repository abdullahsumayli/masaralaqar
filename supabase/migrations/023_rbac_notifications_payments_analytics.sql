-- Migration: Add RBAC, notifications, payments, analytics support
-- Run this after existing migrations

-- ══════════════════════════════════════
-- 1. RBAC: Update users table with role enum
-- ══════════════════════════════════════

DO $$
BEGIN
  -- Add role column if not exists (may already exist as text)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
  END IF;

  -- Add office_id column to users table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'office_id') THEN
    ALTER TABLE users ADD COLUMN office_id UUID REFERENCES offices(id) ON DELETE SET NULL;
  END IF;

  -- Create index on office_id
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_office_id') THEN
    CREATE INDEX idx_users_office_id ON users(office_id);
  END IF;
END $$;

-- ══════════════════════════════════════
-- 2. Notifications Table
-- ══════════════════════════════════════

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  office_id UUID REFERENCES offices(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'new_lead', 'payment_success', 'unanswered_question', 'new_viewing', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_office_id ON notifications(office_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ══════════════════════════════════════
-- 3. Payments Table (Moyasar)
-- ══════════════════════════════════════

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  amount_sar NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'initiated', -- 'initiated', 'paid', 'failed', 'refunded'
  gateway TEXT NOT NULL DEFAULT 'moyasar', -- 'moyasar', 'tap', 'bank_transfer'
  gateway_payment_id TEXT, -- Moyasar payment ID
  gateway_invoice_id TEXT,
  payment_method TEXT, -- 'creditcard', 'applepay', 'stcpay', 'bank_transfer'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_office_id ON payments(office_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON payments(gateway_payment_id);

-- ══════════════════════════════════════
-- 4. Analytics Events Table (for dashboard)
-- ══════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'ai_message', 'lead_created', 'property_viewed', 'viewing_scheduled', 'lead_converted'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_office_id ON analytics_events(office_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ══════════════════════════════════════
-- 5. Sent Messages Table (WhatsApp outbound)
-- ══════════════════════════════════════

CREATE TABLE IF NOT EXISTS sent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  gateway_message_id TEXT,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sent_messages_office_id ON sent_messages(office_id);
CREATE INDEX IF NOT EXISTS idx_sent_messages_phone ON sent_messages(phone);

-- ══════════════════════════════════════
-- 6. RLS Policies
-- ══════════════════════════════════════

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_messages ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by API routes)
CREATE POLICY "Service role full access on notifications"
  ON notifications FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on payments"
  ON payments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on analytics_events"
  ON analytics_events FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on sent_messages"
  ON sent_messages FOR ALL USING (true) WITH CHECK (true);
