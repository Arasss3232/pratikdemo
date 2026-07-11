
-- ai_audit_findings
CREATE TABLE public.ai_audit_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('acil','onemli','iyilestirme','oneri')),
  target_table text,
  target_id uuid,
  target_url text,
  message_tr text NOT NULL,
  suggestion_tr text,
  action_type text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','snoozed','dismissed','resolved')),
  snooze_until timestamptz,
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_audit_findings TO authenticated;
GRANT ALL ON public.ai_audit_findings TO service_role;
ALTER TABLE public.ai_audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal staff manage findings" ON public.ai_audit_findings
  FOR ALL TO authenticated
  USING (public.is_internal_staff(auth.uid()))
  WITH CHECK (public.is_internal_staff(auth.uid()));
CREATE TRIGGER trg_ai_audit_findings_updated BEFORE UPDATE ON public.ai_audit_findings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX ai_audit_findings_status_idx ON public.ai_audit_findings(status, severity);

-- ai_task_items
CREATE TABLE public.ai_task_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title_tr text NOT NULL,
  description_tr text,
  source text NOT NULL DEFAULT 'user' CHECK (source IN ('user','ai','audit','system')),
  related_proposal_id uuid,
  related_finding_id uuid REFERENCES public.ai_audit_findings(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','cancelled')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_task_items TO authenticated;
GRANT ALL ON public.ai_task_items TO service_role;
ALTER TABLE public.ai_task_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON public.ai_task_items
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE TRIGGER trg_ai_task_items_updated BEFORE UPDATE ON public.ai_task_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX ai_task_items_user_status_idx ON public.ai_task_items(user_id, status);

-- ai_project_preferences (singleton)
CREATE TABLE public.ai_project_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  tone text NOT NULL DEFAULT 'profesyonel',
  formality text NOT NULL DEFAULT 'resmi',
  default_mode text NOT NULL DEFAULT 'easy' CHECK (default_mode IN ('easy','advanced')),
  homepage_density text NOT NULL DEFAULT 'dengeli',
  visual_style text NOT NULL DEFAULT 'endustriyel',
  brand_terms text[] NOT NULL DEFAULT ARRAY[]::text[],
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_project_preferences TO authenticated;
GRANT ALL ON public.ai_project_preferences TO service_role;
ALTER TABLE public.ai_project_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal staff read preferences" ON public.ai_project_preferences
  FOR SELECT TO authenticated
  USING (public.is_internal_staff(auth.uid()));
CREATE POLICY "Admins update preferences" ON public.ai_project_preferences
  FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Admins insert preferences" ON public.ai_project_preferences
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()));
CREATE TRIGGER trg_ai_project_preferences_updated BEFORE UPDATE ON public.ai_project_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.ai_project_preferences (singleton) VALUES (true);

-- ai_change_bundles
CREATE TABLE public.ai_change_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  description_tr text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','partially_applied','applied','rejected')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_change_bundles TO authenticated;
GRANT ALL ON public.ai_change_bundles TO service_role;
ALTER TABLE public.ai_change_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal staff manage bundles" ON public.ai_change_bundles
  FOR ALL TO authenticated
  USING (public.is_internal_staff(auth.uid()))
  WITH CHECK (public.is_internal_staff(auth.uid()));
CREATE TRIGGER trg_ai_change_bundles_updated BEFORE UPDATE ON public.ai_change_bundles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ai_change_bundle_items (
  bundle_id uuid NOT NULL REFERENCES public.ai_change_bundles(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL REFERENCES public.ai_action_proposals(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, proposal_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_change_bundle_items TO authenticated;
GRANT ALL ON public.ai_change_bundle_items TO service_role;
ALTER TABLE public.ai_change_bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal staff manage bundle items" ON public.ai_change_bundle_items
  FOR ALL TO authenticated
  USING (public.is_internal_staff(auth.uid()))
  WITH CHECK (public.is_internal_staff(auth.uid()));

-- ai_usage_logs
CREATE TABLE public.ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  model text,
  tokens_in integer,
  tokens_out integer,
  latency_ms integer,
  status text NOT NULL DEFAULT 'ok',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ai_usage_logs TO authenticated;
GRANT ALL ON public.ai_usage_logs TO service_role;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own usage" ON public.ai_usage_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Admins read usage" ON public.ai_usage_logs
  FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()) OR user_id = auth.uid());
CREATE INDEX ai_usage_logs_created_idx ON public.ai_usage_logs(created_at DESC);
