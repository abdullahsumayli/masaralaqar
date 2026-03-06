-- Migration 010: Create bot_subscriptions table for WhatsApp bot integration
-- This table tracks subscriptions to the WhatsApp bot service

create table if not exists bot_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  phone varchar(20) not null unique,
  plan_type varchar(20) not null check (plan_type in ('free', 'basic', 'pro')),
  status varchar(20) not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  usage_count integer not null default 0,
  monthly_limit integer not null,
  activated_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index on user_id and phone for faster queries
create index idx_bot_subscriptions_user_id on bot_subscriptions(user_id);
create index idx_bot_subscriptions_phone on bot_subscriptions(phone);
create index idx_bot_subscriptions_status on bot_subscriptions(status);

-- Enable RLS
alter table bot_subscriptions enable row level security;

-- RLS Policy: Users can only view their own subscription
create policy "Users can view their own bot subscription"
  on bot_subscriptions for select
  using (auth.uid() = user_id);

-- RLS Policy: Users can update their own subscription (for usage tracking)
create policy "Users can update their own bot subscription"
  on bot_subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS Policy: Admin can view all subscriptions (if role='admin')
create policy "Admins can view all bot subscriptions"
  on bot_subscriptions for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Admin can update any subscription
create policy "Admins can update any bot subscription"
  on bot_subscriptions for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Service role can insert (for bot activation)
create policy "Service role can insert bot subscriptions"
  on bot_subscriptions for insert
  with check (true);
