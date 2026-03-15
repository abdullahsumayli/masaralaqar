-- ============================================================
-- Migration 026: Affiliate Marketing System
-- Scalable for 100k+ customers, 10k+ affiliates
-- Requires: public.user_subscriptions (e.g. from payment-schema.sql)
-- ============================================================

-- 1. Affiliates (one per user; optional parent for tier-2)
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  parent_affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_parent ON affiliates(parent_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_created_at ON affiliates(created_at DESC);

-- 2. Referrals (affiliate -> referred user signup)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

-- 3. Commissions (per payment; tier 1 = direct, tier 2 = override)
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  tier_level INT NOT NULL DEFAULT 1 CHECK (tier_level IN (1, 2)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_referral_id ON commissions(referral_id);
CREATE INDEX IF NOT EXISTS idx_commissions_subscription_id ON commissions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at DESC);

-- 4. Coupons (affiliate-generated; discount first month only)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_affiliate_id ON coupons(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active) WHERE active = TRUE;

-- 5. Payouts (admin-approved payouts to affiliates)
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at DESC);

-- RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Affiliates: users see/insert own row; admin uses service role (bypasses RLS)
CREATE POLICY "affiliates_select_own" ON affiliates FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "affiliates_insert_own" ON affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Referrals: affiliates see their referrals only
CREATE POLICY "referrals_select_own" ON referrals FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = referrals.affiliate_id AND a.user_id = auth.uid())
  );

-- Commissions: affiliates see own only
CREATE POLICY "commissions_select_own" ON commissions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = commissions.affiliate_id AND a.user_id = auth.uid())
  );

-- Coupons: affiliates see/insert/update own
CREATE POLICY "coupons_select_own" ON coupons FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = coupons.affiliate_id AND a.user_id = auth.uid())
  );
CREATE POLICY "coupons_insert_own" ON coupons FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = coupons.affiliate_id AND a.user_id = auth.uid())
  );
CREATE POLICY "coupons_update_own" ON coupons FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = coupons.affiliate_id AND a.user_id = auth.uid())
  );

-- Payouts: affiliates see own only
CREATE POLICY "payouts_select_own" ON payouts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM affiliates a WHERE a.id = payouts.affiliate_id AND a.user_id = auth.uid())
  );

-- Allow anon to read coupon by code for validation (API uses service role)
-- No public read on coupons; validation is server-side only.
