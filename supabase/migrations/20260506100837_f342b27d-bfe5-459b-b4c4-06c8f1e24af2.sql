CREATE TABLE public.goal_level_detail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id text NOT NULL,
  level text NOT NULL,
  explanation text,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (goal_id, level)
);

ALTER TABLE public.goal_level_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read goal_level_detail"
ON public.goal_level_detail FOR SELECT USING (true);

CREATE POLICY "Admins manage goal_level_detail"
ON public.goal_level_detail FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_goal_level_detail_updated_at
BEFORE UPDATE ON public.goal_level_detail
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();