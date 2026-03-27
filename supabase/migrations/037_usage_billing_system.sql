-- ============================================================
-- Migration 037: Usage-Based Pricing & Billing System
-- مسار العقار — نظام الفوترة والاستخدام
-- ============================================================

-- 1. Add billing cycle and message limit to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS billing_cycle_end TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS message_limit INTEGER;

-- Backfill: set billing cycle from start_date for existing rows
UPDATE subscriptions
SET
  billing_cycle_start = COALESCE(billing_cycle_start, start_date),
  billing_cycle_end = COALESCE(billing_cycle_end, start_date + INTERVAL '1 month'),
  message_limit = COALESCE(message_limit, 300)
WHERE billing_cycle_start IS NULL;

-- 2. Add max_instances to plans (for WhatsApp instances per office)
ALTER TABLE plans ADD COLUMN IF NOT EXISTS max_instances INTEGER DEFAULT 1;

-- 3. Add future-ready columns to plans
ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS overage_price_per_message DECIMAL(10,4) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS supports_yearly BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS yearly_discount_percent INTEGER DEFAULT 0;

-- 4. Upsert new pricing plans (starter, growth, pro)
-- Upsert: use name as unique key (plans.name is UNIQUE)
INSERT INTO plans (name, name_ar, max_properties, max_ai_messages, max_whatsapp_messages, max_instances, price, sort_order, features)
VALUES
  ('starter', 'بداية', 20, 300, 500, 1, 499, 10, '["1 جلسة واتساب", "300 رد ذكاء اصطناعي/شهر", "دعم أساسي"]'::jsonb),
  ('growth', 'نمو', 100, 1000, 3000, 2, 999, 11, '["2 جلسات واتساب", "1000 رد ذكاء اصطناعي/شهر", "معالجة ذات أولوية"]'::jsonb),
  ('pro', 'احترافي', 500, 3000, 10000, 5, 1999, 12, '["5 جلسات واتساب", "3000 رد ذكاء اصطناعي/شهر", "أعلى أولوية + تحليلات"]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  max_ai_messages = EXCLUDED.max_ai_messages,
  max_whatsapp_messages = EXCLUDED.max_whatsapp_messages,
  max_instances = EXCLUDED.max_instances,
  price = EXCLUDED.price,
  features = EXCLUDED.features;

-- 5. Extend usage_logs: add count, extend type
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS count INTEGER DEFAULT 1;

-- Drop old type constraint and add extended one
ALTER TABLE usage_logs DROP CONSTRAINT IF EXISTS usage_logs_type_check;
ALTER TABLE usage_logs ADD CONSTRAINT usage_logs_type_check
  CHECK (type IN (
    'ai_message', 'whatsapp_message', 'property_created',
    'ai_response', 'lead_created', 'message_sent'
  ));

-- 6. Sync message_limit from plan for existing subscriptions
UPDATE subscriptions s
SET message_limit = p.max_ai_messages
FROM plans p
WHERE s.plan_id = p.id AND (s.message_limit IS NULL OR s.message_limit = 0);

-- 7. Index for billing cycle reset queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_cycle ON subscriptions(billing_cycle_end) WHERE status IN ('active', 'trial');

-- 8. Update trigger to set message_limit and billing cycle on new office
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
  plan_limit INT;
BEGIN
  SELECT id, max_ai_messages INTO free_plan_id, plan_limit FROM plans WHERE name = 'free' LIMIT 1;
  IF free_plan_id IS NOT NULL THEN
    UPDATE offices SET plan_id = free_plan_id WHERE id = NEW.id;
    INSERT INTO subscriptions (office_id, plan_id, status, start_date, end_date, message_limit, billing_cycle_start, billing_cycle_end)
    VALUES (
      NEW.id,
      free_plan_id,
      'trial',
      NOW(),
      NOW() + INTERVAL '14 days',
      COALESCE(plan_limit, 50),
      NOW(),
      NOW() + INTERVAL '1 month'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
