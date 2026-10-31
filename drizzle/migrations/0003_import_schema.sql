CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text, city text, notes text, system text, last_message text,
  stage text NOT NULL DEFAULT 'new',
  unread integer NOT NULL DEFAULT 0,
  last_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  direction text NOT NULL DEFAULT 'customer',
  kind text NOT NULL DEFAULT 'text',
  text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_customer_created_idx ON public.messages(customer_id, created_at);
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  phone text NOT NULL,
  name text, city text, amount text, details text, invoice_no text, method text,
  status text NOT NULL DEFAULT 'pending',
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE SEQUENCE IF NOT EXISTS public.support_ticket_seq START 1001;
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no text NOT NULL UNIQUE DEFAULT ('ACTES-SUP-' || nextval('public.support_ticket_seq')::text),
  customer_id uuid REFERENCES public.customers(id),
  phone text NOT NULL,
  name text, city text, device text, issue_type text, description text,
  media_id text, media_type text,
  status text NOT NULL DEFAULT 'open',
  assigned_to text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.support_tickets TO service_role;
GRANT USAGE ON SEQUENCE public.support_ticket_seq TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.catalog_items (
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
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_no text NOT NULL DEFAULT ('ACTES-Q-' || to_char(now(),'YYMMDD-HH24MISS')),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text,
  phone text,
  city text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;