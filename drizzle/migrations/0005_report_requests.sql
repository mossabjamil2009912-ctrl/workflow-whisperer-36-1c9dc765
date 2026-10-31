CREATE TABLE public.report_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id),
  phone text NOT NULL,
  name text,
  system_label text,
  kind text NOT NULL DEFAULT 'pvsyst',
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.report_requests TO service_role;
ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.preset_reports (
  preset_title text NOT NULL,
  kind text NOT NULL,
  path text NOT NULL,
  file_name text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (preset_title, kind)
);
GRANT ALL ON public.preset_reports TO service_role;
ALTER TABLE public.preset_reports ENABLE ROW LEVEL SECURITY;