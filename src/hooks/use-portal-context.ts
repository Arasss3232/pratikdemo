import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type PortalCompany = Database["public"]["Tables"]["companies"]["Row"];
export type PortalMembership = Database["public"]["Tables"]["company_users"]["Row"];
export type PortalRole = Database["public"]["Enums"]["company_role"];

export type PortalPermission =
  | "view_prices"
  | "view_finance"
  | "request_quote"
  | "approve_quote"
  | "create_order"
  | "manage_users"
  | "manage_addresses";

const ROLE_PERMISSIONS: Record<PortalRole, PortalPermission[]> = {
  company_admin: ["view_prices", "view_finance", "request_quote", "approve_quote", "create_order", "manage_users", "manage_addresses"],
  purchasing:    ["view_prices", "request_quote", "approve_quote", "create_order", "manage_addresses"],
  order_creator: ["view_prices", "request_quote", "create_order"],
  finance_viewer:["view_finance"],
  viewer:        [],
};

const STORAGE_KEY = "pratik.portal.company";

export type PortalContext = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  memberships: Array<PortalMembership & { company: PortalCompany | null }>;
  activeMembership: (PortalMembership & { company: PortalCompany | null }) | null;
  activeCompany: PortalCompany | null;
  role: PortalRole | null;
  setActiveCompany: (companyId: string) => void;
  can: (perm: PortalPermission) => boolean;
  refresh: () => Promise<void>;
};

export function usePortalContext(): PortalContext {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<Array<PortalMembership & { company: PortalCompany | null }>>([]);
  const [activeId, setActiveId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const u = userRes.user;
    if (!u) {
      setUserId(null); setEmail(null); setMemberships([]); setLoading(false);
      return;
    }
    setUserId(u.id);
    setEmail(u.email ?? null);

    const { data } = await supabase
      .from("company_users")
      .select("*, company:companies(*)")
      .eq("user_id", u.id)
      .eq("is_active", true);

    const rows = (data ?? []) as Array<PortalMembership & { company: PortalCompany | null }>;
    // Only companies that are active & approved
    const usable = rows.filter((r) => r.company && r.company.account_status === "active" && r.company.approval_status === "approved");
    setMemberships(usable);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [load]);

  // Ensure activeId is valid
  useEffect(() => {
    if (memberships.length === 0) return;
    const stillValid = activeId && memberships.some((m) => m.company_id === activeId);
    if (!stillValid) {
      const first = memberships[0].company_id;
      setActiveId(first);
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, first);
    }
  }, [memberships, activeId]);

  const setActiveCompany = useCallback((id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const activeMembership = memberships.find((m) => m.company_id === activeId) ?? memberships[0] ?? null;
  const activeCompany = activeMembership?.company ?? null;
  const role = activeMembership?.role ?? null;

  const can = useCallback((perm: PortalPermission) => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role].includes(perm);
  }, [role]);

  return { loading, userId, email, memberships, activeMembership, activeCompany, role, setActiveCompany, can, refresh: load };
}

export const ROLE_LABELS_TR: Record<PortalRole, string> = {
  company_admin: "Firma Yöneticisi",
  purchasing:    "Satın Alma",
  order_creator: "Sipariş Yetkilisi",
  finance_viewer:"Finans",
  viewer:        "Görüntüleyici",
};