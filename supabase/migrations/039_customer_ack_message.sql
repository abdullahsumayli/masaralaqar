-- Instant WhatsApp ack text per office (webhook → customer before AI reply)
ALTER TABLE public.ai_agents
  ADD COLUMN IF NOT EXISTS customer_ack_message TEXT;

COMMENT ON COLUMN public.ai_agents.customer_ack_message IS
  'Optional override for the immediate "message received" WhatsApp reply; empty = platform default';
