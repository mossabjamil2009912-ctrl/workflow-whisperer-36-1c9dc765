CREATE TABLE IF NOT EXISTS public.bot_button_locks (
  context_id text PRIMARY KEY,
  choice text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.bot_button_locks TO service_role;
ALTER TABLE public.bot_button_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS bot_paused boolean NOT NULL DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_name text, ADD COLUMN IF NOT EXISTS media_id text, ADD COLUMN IF NOT EXISTS media_url text, ADD COLUMN IF NOT EXISTS mime text;