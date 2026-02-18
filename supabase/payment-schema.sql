-- Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'free', 'basic', 'pro'
  price_sar DECIMAL(10, 2),
  description TEXT,
  features TEXT[], -- Array of features
  max_properties INT,
  max_leads INT,
  max_storage_gb INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'inactive', 'cancelled'
  started_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  renewal_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bank Transfer Payments
CREATE TABLE IF NOT EXISTS public.bank_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  amount_sar DECIMAL(10, 2) NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'cancelled'
  payment_method TEXT DEFAULT 'bank_transfer',
  
  -- Bank Details
  bank_name TEXT,
  account_number TEXT,
  transfer_date DATE,
  reference_number TEXT,
  
  -- Admin Verification
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice/Receipt
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.bank_transfers(id),
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  
  invoice_number TEXT UNIQUE NOT NULL,
  amount_sar DECIMAL(10, 2) NOT NULL,
  description TEXT,
  
  issued_at TIMESTAMP DEFAULT NOW(),
  due_date DATE,
  paid_at TIMESTAMP,
  
  status TEXT DEFAULT 'draft', -- 'draft', 'issued', 'paid', 'overdue'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Subscription Plans - Public Read
CREATE POLICY "Public can read subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (true);

-- User Subscriptions - Own Subscriptions
CREATE POLICY "Users can read their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can read all subscriptions
CREATE POLICY "Admins can read all subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bank Transfers - Own Payments
CREATE POLICY "Users can read their own payments"
  ON public.bank_transfers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.bank_transfers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending payments"
  ON public.bank_transfers FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admin can read all payments
CREATE POLICY "Admins can read all payments"
  ON public.bank_transfers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update payment status
CREATE POLICY "Admins can update payment status"
  ON public.bank_transfers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Invoices - Own Invoices
CREATE POLICY "Users can read their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Admin can read all invoices
CREATE POLICY "Admins can read all invoices"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Default Subscription Plans
INSERT INTO public.subscription_plans (name, price_sar, description, features, max_properties, max_leads, max_storage_gb)
VALUES
  (
    'free',
    0,
    'خطة مجانية للمبتدئين',
    ARRAY['عرض العقارات الأساسي', 'تحليل بسيط'],
    5,
    50,
    1
  ),
  (
    'basic',
    299,
    'خطة الأساس - مثالية للوكلاء الفرديين',
    ARRAY['عرض العقارات المتقدم', 'إدارة العملاء الكاملة', 'تحليل تفصيلي', 'دعم البريد الإلكتروني'],
    50,
    500,
    10
  ),
  (
    'pro',
    799,
    'خطة احترافية - للفريق والمكاتب الكبيرة',
    ARRAY['جميع ميزات الأساس', 'ميزات متقدمة متعددة', 'API Access', 'دعم البريد والهاتف', 'مسؤول حساب مخصص'],
    500,
    5000,
    100
  );
