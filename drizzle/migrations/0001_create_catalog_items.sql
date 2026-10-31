CREATE TABLE public.catalog_items (
  key text PRIMARY KEY,
  kind text NOT NULL DEFAULT 'item',
  category text NOT NULL DEFAULT 'other',
  category_title text,
  name text NOT NULL,
  unit text,
  price numeric,
  label text,
  pdf_url text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.catalog_items TO service_role;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;