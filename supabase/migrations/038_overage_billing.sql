-- ============================================================
-- Migration 038: Overage Billing for AI Usage
-- مسار العقار — فوترة الاستخدام الإضافي
-- ============================================================

-- 1. Add overage columns to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS overage_messages INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overage_amount_sar DECIMAL(10, 2) DEFAULT 0;

-- 2. Set overage_price_per_message for paid plans (SAR per message)
UPDATE plans SET overage_price_per_message = 0.50 WHERE name IN ('starter', 'growth');
UPDATE plans SET overage_price_per_message = 0.30 WHERE name = 'pro';
