CREATE TABLE public.app_settings (key text PRIMARY KEY, value numeric NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.app_settings (key, value) VALUES ('kwh_price', 290);