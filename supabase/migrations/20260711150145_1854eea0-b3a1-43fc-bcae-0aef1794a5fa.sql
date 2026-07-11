
-- Anon rolünden mevcut SECURITY DEFINER fonksiyonların EXECUTE hakkını kaldır
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, public, authenticated;

-- ============================================================
-- Yardımcı fonksiyonlar
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.is_internal_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin','super_admin','general_manager','sales_manager','sales_rep',
                   'finance','warehouse','operations','content_editor','report_viewer')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_internal_staff(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_internal_staff(uuid) TO authenticated;

-- ============================================================
-- Müşteri Grupları
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customer_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  default_discount_pct numeric(5,2) NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_groups TO authenticated;
GRANT ALL ON public.customer_groups TO service_role;
ALTER TABLE public.customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_groups internal read" ON public.customer_groups
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "customer_groups super admin manage" ON public.customer_groups
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE TRIGGER trg_customer_groups_updated BEFORE UPDATE ON public.customer_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Bayi Seviyeleri
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dealer_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  tier integer NOT NULL DEFAULT 1,
  discount_pct numeric(5,2) NOT NULL DEFAULT 0,
  min_annual_volume numeric(14,2),
  color_hex text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dealer_levels TO authenticated;
GRANT ALL ON public.dealer_levels TO service_role;
ALTER TABLE public.dealer_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dealer_levels internal read" ON public.dealer_levels
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "dealer_levels super admin manage" ON public.dealer_levels
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE TRIGGER trg_dealer_levels_updated BEFORE UPDATE ON public.dealer_levels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Satış Temsilcileri
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sales_representatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  region text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_representatives TO authenticated;
GRANT ALL ON public.sales_representatives TO service_role;
ALTER TABLE public.sales_representatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_reps internal read" ON public.sales_representatives
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "sales_reps super admin manage" ON public.sales_representatives
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'))
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'));

CREATE TRIGGER trg_sales_reps_updated BEFORE UPDATE ON public.sales_representatives
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Firmalar
-- ============================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL,
  trade_name text,
  tax_office text,
  tax_number text,
  company_type public.company_type NOT NULL DEFAULT 'corporate',
  customer_group_id uuid REFERENCES public.customer_groups(id) ON DELETE SET NULL,
  dealer_level_id uuid REFERENCES public.dealer_levels(id) ON DELETE SET NULL,
  sector text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  account_code text UNIQUE,
  credit_limit numeric(14,2) NOT NULL DEFAULT 0,
  available_limit numeric(14,2) NOT NULL DEFAULT 0,
  payment_term_days integer NOT NULL DEFAULT 30,
  currency text NOT NULL DEFAULT 'TRY',
  risk_status public.risk_status NOT NULL DEFAULT 'low',
  account_status public.company_account_status NOT NULL DEFAULT 'pending',
  approval_status public.company_approval_status NOT NULL DEFAULT 'pending',
  sales_representative_id uuid REFERENCES public.sales_representatives(id) ON DELETE SET NULL,
  internal_notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_companies_sales_rep ON public.companies(sales_representative_id);
CREATE INDEX IF NOT EXISTS idx_companies_group ON public.companies(customer_group_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(account_status, approval_status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Firma Kullanıcıları
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.company_role NOT NULL DEFAULT 'viewer',
  title text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_primary boolean NOT NULL DEFAULT false,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at timestamptz,
  accepted_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_company_users_user ON public.company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_company_users_company ON public.company_users(company_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_users TO authenticated;
GRANT ALL ON public.company_users TO service_role;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_company_users_updated BEFORE UPDATE ON public.company_users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Firma bağlamı yardımcı fonksiyonları
CREATE OR REPLACE FUNCTION public.is_company_member(_user_id uuid, _company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_users
    WHERE user_id = _user_id AND company_id = _company_id AND is_active = true
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_company_member(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_company_member(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.has_company_role(_user_id uuid, _company_id uuid, _role public.company_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_users
    WHERE user_id = _user_id AND company_id = _company_id
      AND role = _role AND is_active = true
  );
$$;
REVOKE EXECUTE ON FUNCTION public.has_company_role(uuid, uuid, public.company_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_company_role(uuid, uuid, public.company_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.current_company_ids(_user_id uuid)
RETURNS SETOF uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.company_users
  WHERE user_id = _user_id AND is_active = true;
$$;
REVOKE EXECUTE ON FUNCTION public.current_company_ids(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.current_company_ids(uuid) TO authenticated;

-- Firmalar RLS
CREATE POLICY "companies internal read" ON public.companies
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "companies member read" ON public.companies
  FOR SELECT TO authenticated USING (public.is_company_member(auth.uid(), id));
CREATE POLICY "companies super admin manage" ON public.companies
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'))
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'));
CREATE POLICY "companies sales rep update portfolio" ON public.companies
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'sales_rep')
    AND sales_representative_id IN (SELECT id FROM public.sales_representatives WHERE user_id = auth.uid())
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'sales_rep')
    AND sales_representative_id IN (SELECT id FROM public.sales_representatives WHERE user_id = auth.uid())
  );
CREATE POLICY "companies sales rep insert" ON public.companies
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'sales_rep'));

-- Firma Kullanıcıları RLS
CREATE POLICY "company_users internal read" ON public.company_users
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "company_users self read" ON public.company_users
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "company_users company admin read" ON public.company_users
  FOR SELECT TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'company_admin'));
CREATE POLICY "company_users super admin manage" ON public.company_users
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'))
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'));
CREATE POLICY "company_users company admin manage" ON public.company_users
  FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'company_admin'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'company_admin'));

-- ============================================================
-- Firma Adresleri
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  address_type public.address_type NOT NULL,
  label text,
  contact_name text,
  contact_phone text,
  line1 text NOT NULL,
  line2 text,
  district text,
  city text NOT NULL,
  postal_code text,
  country text NOT NULL DEFAULT 'Türkiye',
  is_default boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_company_addresses_company ON public.company_addresses(company_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_addresses TO authenticated;
GRANT ALL ON public.company_addresses TO service_role;
ALTER TABLE public.company_addresses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_company_addresses_updated BEFORE UPDATE ON public.company_addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "company_addresses internal read" ON public.company_addresses
  FOR SELECT TO authenticated USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "company_addresses member read" ON public.company_addresses
  FOR SELECT TO authenticated USING (public.is_company_member(auth.uid(), company_id));
CREATE POLICY "company_addresses super admin manage" ON public.company_addresses
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'))
  WITH CHECK (public.is_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'sales_manager'));
CREATE POLICY "company_addresses company admin manage" ON public.company_addresses
  FOR ALL TO authenticated
  USING (public.has_company_role(auth.uid(), company_id, 'company_admin'))
  WITH CHECK (public.has_company_role(auth.uid(), company_id, 'company_admin'));

-- ============================================================
-- Başlangıç seed verileri
-- ============================================================
INSERT INTO public.customer_groups (code, name, description, default_discount_pct, display_order)
VALUES
  ('KURUMSAL', 'Kurumsal', 'Kurumsal müşteriler ve fabrikalar', 0, 10),
  ('BAYI', 'Bayi', 'Yetkili bayi firmalar', 5, 20),
  ('DISTRIBUTOR', 'Distribütör', 'Bölge distribütörleri', 10, 30),
  ('END_CUSTOMER', 'Son Kullanıcı', 'Perakende son kullanıcılar', 0, 40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.dealer_levels (code, name, tier, discount_pct, color_hex)
VALUES
  ('SILVER', 'Gümüş Bayi', 1, 3, '#94a3b8'),
  ('GOLD', 'Altın Bayi', 2, 6, '#eab308'),
  ('PLATINUM', 'Platin Bayi', 3, 10, '#e5e7eb')
ON CONFLICT (code) DO NOTHING;
