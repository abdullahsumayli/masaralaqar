-- Legacy Evolution shared instance "saqr" → canonical WAHA name per office (office_{uuid}).
-- Also remove DB default so new rows no longer get "saqr".

UPDATE public.whatsapp_sessions
SET
  instance_id = 'office_' || office_id::text,
  updated_at = now()
WHERE instance_id = 'saqr'
   OR lower(btrim(instance_id)) = 'saqr';

ALTER TABLE public.whatsapp_sessions
  ALTER COLUMN instance_id DROP DEFAULT;

ALTER TABLE public.whatsapp_sessions
  ALTER COLUMN instance_id SET DEFAULT NULL;
