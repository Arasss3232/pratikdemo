-- 1. app_role enum güncellemesi
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum JOIN pg_type ON pg_type.oid = pg_enum.enumtypid WHERE pg_type.typname = 'app_role' AND enumlabel = 'seo_manager') THEN
        ALTER TYPE public.app_role ADD VALUE 'seo_manager';
    END IF;
END $$;

-- 2. Yetkiler tablosu
CREATE TABLE IF NOT EXISTS public.permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    description text,
    group_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT ON public.permissions TO authenticated;
GRANT ALL ON public.permissions TO service_role;

-- 3. Rol Yetkileri tablosu
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.app_role NOT NULL,
    permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(role, permission_id)
);

GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;

-- 4. Görevler tablosu
CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    related_module text,
    related_id uuid,
    assigned_to uuid REFERENCES auth.users(id),
    assigned_by uuid REFERENCES auth.users(id),
    priority text NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Düşük', 'Normal', 'Yüksek', 'Acil')),
    status text NOT NULL DEFAULT 'Bekliyor' CHECK (status IN ('Bekliyor', 'Devam Ediyor', 'Tamamlandı', 'İptal Edildi')),
    due_at timestamptz,
    reminder_at timestamptz,
    completed_at timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_tasks TO authenticated;
GRANT ALL ON public.admin_tasks TO service_role;

-- 5. Görev Notları tablosu
CREATE TABLE IF NOT EXISTS public.task_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid REFERENCES public.admin_tasks(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    note text NOT NULL,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_notes TO authenticated;
GRANT ALL ON public.task_notes TO service_role;

-- 6. Onay Talepleri tablosu
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_no serial UNIQUE,
    request_type text NOT NULL,
    module text NOT NULL,
    related_id uuid NOT NULL,
    related_title text,
    requested_action text NOT NULL,
    requested_by uuid REFERENCES auth.users(id) NOT NULL,
    assigned_approver uuid REFERENCES auth.users(id),
    reason text,
    previous_values jsonb,
    proposed_values jsonb,
    status text NOT NULL DEFAULT 'Onay Bekliyor' CHECK (status IN ('Onay Bekliyor', 'Onaylandı', 'Reddedildi', 'İptal Edildi', 'Süresi Doldu')),
    priority text NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Yüksek', 'Acil')),
    due_at timestamptz,
    reviewed_at timestamptz,
    reviewer_note text,
    rejection_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.approval_requests TO authenticated;
GRANT ALL ON public.approval_requests TO service_role;

-- 7. Bildirimler tablosu
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid REFERENCES auth.users(id) NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    severity text NOT NULL DEFAULT 'Bilgi' CHECK (severity IN ('Bilgi', 'Başarılı', 'Uyarı', 'Kritik')),
    related_module text,
    related_id uuid,
    target_url text,
    is_read boolean DEFAULT false,
    read_at timestamptz,
    expires_at timestamptz,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- 8. İşlem Geçmişi (Audit Logs) - Immutable
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES auth.users(id),
    actor_name text,
    actor_email text,
    action text NOT NULL,
    module text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    entity_title text,
    previous_values jsonb,
    new_values jsonb,
    status text,
    ip_address text,
    user_agent text,
    correlation_id uuid,
    error_summary text,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

-- 9. RLS Aktifleştirme
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. Security Definer Fonksiyonu: has_permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Super admin her şeye yetkili
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin') THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = _user_id AND p.key = _permission_key
  );
END;
$$;

-- 11. RLS Politikaları
CREATE POLICY "Permissions are readable by authenticated" ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tasks: Admins can view all, users view assigned" ON public.admin_tasks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR assigned_to = auth.uid() OR assigned_by = auth.uid());

CREATE POLICY "Tasks: Authorized can manage" ON public.admin_tasks FOR ALL TO authenticated
USING (public.has_permission(auth.uid(), 'tasks.view_all') OR assigned_to = auth.uid() OR assigned_by = auth.uid());

CREATE POLICY "Notifications: Users can manage own" ON public.notifications FOR ALL TO authenticated
USING (recipient_id = auth.uid());

CREATE POLICY "Audit Logs: Authorized can view" ON public.audit_logs FOR SELECT TO authenticated
USING (public.has_permission(auth.uid(), 'audit.view'));

CREATE POLICY "Approvals: Authorized can view" ON public.approval_requests FOR SELECT TO authenticated
USING (public.has_permission(auth.uid(), 'approvals.view') OR requested_by = auth.uid() OR assigned_approver = auth.uid());

-- 12. Varsayılan Yetkilerin Seed Edilmesi
DO $$
DECLARE
    p_id uuid;
BEGIN
    -- Dashboard
    INSERT INTO public.permissions (key, description, group_name) VALUES ('dashboard.view', 'Genel bakış panelini görüntüleme', 'Dashboard') ON CONFLICT (key) DO NOTHING;
    
    -- Teklif Talepleri
    INSERT INTO public.permissions (key, description, group_name) VALUES ('quotes.view', 'Teklif taleplerini görüntüleme', 'Teklifler') ON CONFLICT (key) DO NOTHING;
    INSERT INTO public.permissions (key, description, group_name) VALUES ('quotes.update', 'Teklif taleplerini güncelleme', 'Teklifler') ON CONFLICT (key) DO NOTHING;
    INSERT INTO public.permissions (key, description, group_name) VALUES ('quotes.delete', 'Teklif taleplerini silme', 'Teklifler') ON CONFLICT (key) DO NOTHING;

    -- SEO
    INSERT INTO public.permissions (key, description, group_name) VALUES ('seo.view', 'SEO ayarlarını görüntüleme', 'SEO') ON CONFLICT (key) DO NOTHING;
    INSERT INTO public.permissions (key, description, group_name) VALUES ('seo.update', 'SEO ayarlarını güncelleme', 'SEO') ON CONFLICT (key) DO NOTHING;

    -- Sistem
    INSERT INTO public.permissions (key, description, group_name) VALUES ('users.view', 'Kullanıcıları görüntüleme', 'Sistem') ON CONFLICT (key) DO NOTHING;
    INSERT INTO public.permissions (key, description, group_name) VALUES ('roles.manage', 'Rol ve yetkileri yönetme', 'Sistem') ON CONFLICT (key) DO NOTHING;
    INSERT INTO public.permissions (key, description, group_name) VALUES ('audit.view', 'İşlem geçmişini görüntüleme', 'Sistem') ON CONFLICT (key) DO NOTHING;

    -- Admin rolüne temel yetkileri ata
    FOR p_id IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role, permission_id) VALUES ('admin', p_id) ON CONFLICT DO NOTHING;
        INSERT INTO public.role_permissions (role, permission_id) VALUES ('super_admin', p_id) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;