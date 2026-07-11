import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

/**
 * Rol → birincil kullanıcı profili. Bir kullanıcının birden fazla rolü olabilir
 * (örn. hem admin hem sales_manager). Sidebar ve dashboard bunu birincil
 * profil olarak seçer.
 */
export type PrimaryProfile =
  | "management" // admin, super_admin, general_manager, sales_manager
  | "sales" // sales_rep
  | "finance" // finance
  | "warehouse" // warehouse, operations
  | "content" // content_editor
  | "viewer"; // report_viewer, user

export type B2BBadges = {
  pendingCompanies: number;
  pendingQuotes: number;
  newMessages: number;
  newApplications: number;
  totalPending: number;
};

export type B2BContext = {
  userId: string | null;
  email: string;
  roles: AppRole[];
  primary: PrimaryProfile;
  badges: B2BBadges;
  loading: boolean;
  refresh: () => Promise<void>;
  can: (permission: Permission) => boolean;
};

/**
 * Kaba modül erişim modeli. Faz 1'de basit rol → izin haritası.
 * Faz 5'te formal permission tablosu geldiğinde bu fonksiyon veritabanından
 * beslenecek; call site'lar aynı kalacak.
 */
export type Permission =
  | "companies.view"
  | "companies.edit"
  | "companies.approve"
  | "quotations.view"
  | "quotations.edit"
  | "quotations.approve"
  | "orders.view"
  | "orders.edit"
  | "finance.view"
  | "finance.edit"
  | "warehouse.view"
  | "content.edit"
  | "system.admin";

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  super_admin: [
    "companies.view", "companies.edit", "companies.approve",
    "quotations.view", "quotations.edit", "quotations.approve",
    "orders.view", "orders.edit",
    "finance.view", "finance.edit",
    "warehouse.view", "content.edit", "system.admin",
  ],
  admin: [
    "companies.view", "companies.edit", "companies.approve",
    "quotations.view", "quotations.edit", "quotations.approve",
    "orders.view", "orders.edit",
    "finance.view", "finance.edit",
    "warehouse.view", "content.edit", "system.admin",
  ],
  general_manager: [
    "companies.view", "companies.edit", "companies.approve",
    "quotations.view", "quotations.approve",
    "orders.view",
    "finance.view",
    "warehouse.view",
  ],
  sales_manager: [
    "companies.view", "companies.edit", "companies.approve",
    "quotations.view", "quotations.edit", "quotations.approve",
    "orders.view", "orders.edit",
  ],
  sales_rep: [
    "companies.view", "companies.edit",
    "quotations.view", "quotations.edit",
    "orders.view", "orders.edit",
  ],
  finance: [
    "companies.view",
    "quotations.view",
    "orders.view",
    "finance.view", "finance.edit",
  ],
  warehouse: [
    "orders.view", "warehouse.view",
  ],
  operations: [
    "orders.view", "warehouse.view",
  ],
  content_editor: ["content.edit"],
  report_viewer: [
    "companies.view", "quotations.view", "orders.view", "finance.view",
  ],
  user: [],
};

function pickPrimary(roles: AppRole[]): PrimaryProfile {
  const has = (r: AppRole) => roles.includes(r);
  if (has("admin") || has("super_admin") || has("general_manager") || has("sales_manager")) return "management";
  if (has("sales_rep")) return "sales";
  if (has("finance")) return "finance";
  if (has("warehouse") || has("operations")) return "warehouse";
  if (has("content_editor")) return "content";
  return "viewer";
}

/**
 * Merkezi B2B bağlamı. AdminShell root'ta bir kez çağrılır, alt bileşenler
 * badge sayacı ve rol bilgisi için bunu prop olarak alır.
 */
export function useB2BContext(): B2BContext {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [badges, setBadges] = useState<B2BBadges>({
    pendingCompanies: 0,
    pendingQuotes: 0,
    newMessages: 0,
    newApplications: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? null;
    setUserId(uid);
    setEmail(userData.user?.email ?? "");

    if (!uid) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const [rolesRes, pc, pq, nm, na] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("companies").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
      supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);

    const roleList = (rolesRes.data ?? []).map((r) => r.role as AppRole);
    setRoles(roleList.length > 0 ? roleList : ["user"]);
    setBadges({
      pendingCompanies: pc.count ?? 0,
      pendingQuotes: pq.count ?? 0,
      newMessages: nm.count ?? 0,
      newApplications: na.count ?? 0,
      totalPending: (pc.count ?? 0) + (pq.count ?? 0),
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primary = pickPrimary(roles);

  const can = useCallback(
    (permission: Permission) => {
      for (const r of roles) {
        if (ROLE_PERMISSIONS[r]?.includes(permission)) return true;
      }
      return false;
    },
    [roles],
  );

  return { userId, email, roles, primary, badges, loading, refresh, can };
}

export const PROFILE_LABELS: Record<PrimaryProfile, string> = {
  management: "Yönetim",
  sales: "Satış",
  finance: "Finans",
  warehouse: "Depo",
  content: "İçerik",
  viewer: "Görüntüleyici",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Sistem Yöneticisi",
  admin: "Yönetici",
  general_manager: "Genel Müdür",
  sales_manager: "Satış Müdürü",
  sales_rep: "Satış Temsilcisi",
  finance: "Finans",
  warehouse: "Depo",
  operations: "Operasyon",
  content_editor: "İçerik Editörü",
  report_viewer: "Rapor Görüntüleyici",
  user: "Kullanıcı",
};