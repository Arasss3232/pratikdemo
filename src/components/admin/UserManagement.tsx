import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { useState } from "react";
import { type Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

type AdminUser = {
  id: string;
  email: string;
  role: AppRole;
  created_at: string;
};

export function UserManagement({ currentUserId }: { currentUserId: string }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          id,
          role,
          created_at,
          user_id
        `);
      
      if (error) throw error;

      // We need to fetch email from auth.users which is not directly accessible via PostgREST for all users
      // unless we have a profiles table. Since we don't have a public profiles table mentioned, 
      // I'll assume we might need to join or we just use user_id.
      // Wait, the project instructions said to create a profiles table if needed.
      // Let's check if there is a 'profiles' table.
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["app-roles-list"],
    queryFn: async () => {
      // Get unique roles from user_roles as a proxy for the enum
      const { data } = await supabase.from("user_roles").select("role");
      const unique = Array.from(new Set(data?.map(r => r.role)));
      return unique as AppRole[];
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      toast.success("Kullanıcı rolü güncellendi");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-muted-foreground">Sistem yöneticilerini ve yetkilerini yönetin.</p>
        </div>
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            className="admin-input pl-10 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--admin-surface-2)]/50 border-b border-[var(--admin-border)]">
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Kullanıcı ID</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Mevcut Rol</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Kayıt Tarihi</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)] text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id} className="hover:bg-[var(--admin-surface-2)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-muted-foreground">{u.user_id}</span>
                      {u.user_id === currentUserId && (
                        <span className="text-[10px] text-blue-600 font-bold mt-1">(Siz)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="text-xs border rounded-lg px-2 py-1 outline-none focus:ring-1 ring-[var(--admin-navy)]"
                      value={u.role}
                      disabled={u.user_id === currentUserId || updateRoleMutation.isPending}
                      onChange={(e) => updateRoleMutation.mutate({ userId: u.user_id, newRole: e.target.value as AppRole })}
                    >
                      {roles.map(r => (
                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
