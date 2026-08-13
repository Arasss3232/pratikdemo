-- Hardening RLS for key tables

-- homepage_brochures
ALTER TABLE public.homepage_brochures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read for active brochures" ON public.homepage_brochures;
CREATE POLICY "Public read for active brochures" ON public.homepage_brochures
    FOR SELECT TO anon 
    USING (is_active = true AND (start_at IS NULL OR start_at <= now()) AND (end_at IS NULL OR end_at >= now()));

DROP POLICY IF EXISTS "Admins can manage brochures" ON public.homepage_brochures;
CREATE POLICY "Admins can manage brochures" ON public.homepage_brochures
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read for active categories" ON public.product_categories;
CREATE POLICY "Public read for active categories" ON public.product_categories
    FOR SELECT TO anon USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.product_categories;
CREATE POLICY "Admins can manage categories" ON public.product_categories
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- catalogs
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.catalogs TO anon;
DROP POLICY IF EXISTS "Public read for catalogs" ON public.catalogs;
CREATE POLICY "Public read for catalogs" ON public.catalogs
    FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Admins can manage catalogs" ON public.catalogs;
CREATE POLICY "Admins can manage catalogs" ON public.catalogs
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
