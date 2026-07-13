
-- 1) Fix reference_images public SELECT: only when parent reference published
DROP POLICY IF EXISTS "reference images public read" ON public.reference_images;
CREATE POLICY "reference images public read"
ON public.reference_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_references pr
    WHERE pr.id = reference_images.reference_id AND pr.published = true
  )
);

-- Owners/admins still manage via existing "admins manage reference images" ALL policy.
-- Add authenticated staff read for unpublished so admin previews work
CREATE POLICY "internal staff read all reference images"
ON public.reference_images
FOR SELECT
TO authenticated
USING (public.is_internal_staff(auth.uid()));

-- 2) Fix service_images similarly
DROP POLICY IF EXISTS "service images public read" ON public.service_images;
CREATE POLICY "service images public read"
ON public.service_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.services s
    WHERE s.id = service_images.service_id AND s.published = true
  )
);

CREATE POLICY "internal staff read all service images"
ON public.service_images
FOR SELECT
TO authenticated
USING (public.is_internal_staff(auth.uid()));

-- 3) Fix quote_requests INSERT policy (WITH CHECK true)
DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;
CREATE POLICY "Public can submit quote requests"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  contact_name IS NOT NULL
  AND email IS NOT NULL
  AND status = 'pending'
  AND (
    (auth.uid() IS NULL AND submitted_by IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (submitted_by IS NULL OR submitted_by = auth.uid()) AND (user_id IS NULL OR user_id = auth.uid()))
  )
);

-- 4) Restrict SECURITY DEFINER role-check functions to only reveal info about the caller.
-- Prevents authenticated users from probing other users' roles via RPC while keeping
-- RLS policies working (they always pass auth.uid()).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_company_role(_user_id uuid, _company_id uuid, _role company_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.company_users
    WHERE user_id = _user_id AND company_id = _company_id
      AND role = _role AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.current_company_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT company_id FROM public.company_users
  WHERE user_id = _user_id AND is_active = true
    AND auth.uid() = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_internal_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','super_admin','general_manager','sales_manager','sales_rep',
                   'finance','warehouse','operations','content_editor','report_viewer')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_company_member(_user_id uuid, _company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.uid() = _user_id AND EXISTS (
    SELECT 1 FROM public.company_users
    WHERE user_id = _user_id AND company_id = _company_id AND is_active = true
  );
$$;
