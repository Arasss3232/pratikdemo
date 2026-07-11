
CREATE TABLE public.homepage_brochures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  eyebrow text,
  subtitle text,
  description text,
  image_desktop text NOT NULL,
  image_tablet text,
  image_mobile text,
  image_alt text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  accent_color text,
  overlay_style text NOT NULL DEFAULT 'left-navy' CHECK (overlay_style IN ('left-navy','right-navy','center-navy','bottom-gradient','minimal')),
  text_theme text NOT NULL DEFAULT 'light' CHECK (text_theme IN ('light','dark')),
  display_order int NOT NULL DEFAULT 0,
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_brochures TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_brochures TO authenticated;
GRANT ALL ON public.homepage_brochures TO service_role;

ALTER TABLE public.homepage_brochures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active scheduled brochures"
  ON public.homepage_brochures FOR SELECT
  USING (
    is_active = true
    AND (start_at IS NULL OR start_at <= now())
    AND (end_at IS NULL OR end_at >= now())
  );

CREATE POLICY "Admins manage brochures"
  ON public.homepage_brochures FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_brochures_updated_at
  BEFORE UPDATE ON public.homepage_brochures
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_brochures_active_order ON public.homepage_brochures (is_active, display_order);
