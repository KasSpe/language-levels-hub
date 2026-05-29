ALTER TYPE public.level_key ADD VALUE IF NOT EXISTS 'ALFA' BEFORE 'A1';

ALTER TABLE public.goal_level_detail
  ADD COLUMN IF NOT EXISTS explicit_contexts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS implicit_contexts jsonb NOT NULL DEFAULT '[]'::jsonb;