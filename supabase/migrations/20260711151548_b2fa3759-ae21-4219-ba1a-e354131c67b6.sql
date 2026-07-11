-- Portal: link quote requests to companies + strict RLS

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website';

CREATE INDEX IF NOT EXISTS idx_quote_requests_company_id ON public.quote_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_submitted_by ON public.quote_requests(submitted_by);

-- Drop any existing overly-broad policies then rebuild
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='quote_requests'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.quote_requests', p.policyname);
  END LOOP;
END $$;

-- Anonymous public form submissions still allowed (website contact form)
CREATE POLICY "Public can submit quote requests"
  ON public.quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Portal user: see quotes for own companies
CREATE POLICY "Company members can view own quotes"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (
    company_id IS NOT NULL
    AND company_id IN (SELECT public.current_company_ids(auth.uid()))
  );

-- Own submission (even if no company link yet) visible to submitter
CREATE POLICY "Submitter can view own quotes"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

-- Internal staff: full visibility & management
CREATE POLICY "Internal staff can view all quotes"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (public.is_internal_staff(auth.uid()));

CREATE POLICY "Internal staff can update quotes"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (public.is_internal_staff(auth.uid()))
  WITH CHECK (public.is_internal_staff(auth.uid()));

CREATE POLICY "Internal staff can delete quotes"
  ON public.quote_requests FOR DELETE
  TO authenticated
  USING (public.is_internal_staff(auth.uid()));

-- Company members can request revision (limited update: message + status='revision_requested')
CREATE POLICY "Company members can request revision"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (
    company_id IS NOT NULL
    AND company_id IN (SELECT public.current_company_ids(auth.uid()))
  )
  WITH CHECK (
    company_id IS NOT NULL
    AND company_id IN (SELECT public.current_company_ids(auth.uid()))
  );

-- Portal announcements (site duyuruları)
CREATE TABLE IF NOT EXISTS public.portal_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL DEFAULT 'all', -- all | dealers | corporate
  is_active boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portal_announcements TO authenticated;
GRANT ALL ON public.portal_announcements TO service_role;

ALTER TABLE public.portal_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portal users can view active announcements"
  ON public.portal_announcements FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Internal staff manage announcements"
  ON public.portal_announcements FOR ALL
  TO authenticated
  USING (public.is_internal_staff(auth.uid()))
  WITH CHECK (public.is_internal_staff(auth.uid()));

CREATE TRIGGER trg_portal_announcements_updated_at
  BEFORE UPDATE ON public.portal_announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
