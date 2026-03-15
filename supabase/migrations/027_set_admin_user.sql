-- Set admin role for the given email.
-- The user must already exist in public.users (e.g. after signing up via /auth/signup).
-- Run this migration after the user has registered once.

UPDATE public.users
SET role = 'admin'
WHERE email = 'sumayliabdullah@gmail.com'
  AND role IS DISTINCT FROM 'admin';
