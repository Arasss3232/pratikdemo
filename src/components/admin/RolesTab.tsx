import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";

type Permission = {
  id: string;
  key: string;
  description: string;
  group_name: string;
};

type RoleData = {
  role: string;
  permissions: string[];
};

export function RolesTab() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: permissions = [] } = useQuery({
    queryKey: ["admin-permissions"],
    queryFn: async () => {
      const { data } = await supabase.from("permissions").select("*").order("group_name");
      return data as Permission[];
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data } = await supabase.from("role_permissions").select(`
        role,
        permission:permissions(key)
      `);
      
      const grouped: Record<string, string[]> = {};
      data?.forEach((item: any) => {
        if (!grouped[item.role]) grouped[item.role] = [];
        if (item.permission?.key) grouped[item.role].push(item.permission.key);
      });

      return Object.entries(grouped).map(([role, perms]) => ({
        role,
        permissions: perms,
      }));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ role, permissionIds }: { role: string; permissionIds: string[] }) => {
      // First delete all
      await supabase.from("role_permissions").delete().eq("role", role);
      // Then insert new
      if (permissionIds.length > 0) {
        const toInsert = permissionIds.map(id => ({ role, permission_id: id }));
        const { error } = await supabase.from("role_permissions").insert(toInsert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Rol yetkileri güncellendi");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  const groupedPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.group_name]) acc[p.group_name] = [];
    acc[p.group_name].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const currentRolePerms = roles.find(r => r.role === selectedRole)?.permissions || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Role List */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Roller</h3>
        <div className="flex flex-col gap-1">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => setSelectedRole(r.role)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                selectedRole === r.role 
                ? "bg-[var(--admin-navy)] text-white shadow-md" 
                : "hover:bg-[var(--admin-surface-2)] text-[var(--admin-text)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name="admin_panel_settings" className="opacity-70" />
                <span className="capitalize">{r.role.replace('_', ' ')}</span>
              </div>
              <span className="text-[10px] opacity-60 bg-white/10 px-2 py-0.5 rounded-full">
                {r.permissions.length} Yetki
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="flex-1 bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        {!selectedRole ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground p-8 text-center">
            <div>
              <Icon name="touch_app" className="text-4xl mb-4 opacity-20" />
              <p>Yetkileri düzenlemek için soldan bir rol seçin.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-[var(--admin-border)] flex items-center justify-between bg-[var(--admin-surface-2)]/30">
              <div>
                <h2 className="text-lg font-bold capitalize text-[var(--admin-navy)]">
                  {selectedRole.replace('_', ' ')} Yetkileri
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bu rolün sistem genelindeki erişim seviyesini belirleyin.
                </p>
              </div>
              {selectedRole === 'super_admin' ? (
                <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                  Süper Yönetici Tüm Yetkilere Sahiptir
                </div>
              ) : (
                <button 
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => {
                    const ids = permissions
                      .filter(p => currentRolePerms.includes(p.key))
                      .map(p => p.id);
                    updateRoleMutation.mutate({ role: selectedRole, permissionIds: ids });
                  }}
                  disabled={updateRoleMutation.isPending}
                >
                  {updateRoleMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 admin-sidebar-scroll max-h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(groupedPermissions).map(([group, groupPerms]) => (
                  <div key={group} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-2">
                      <h4 className="font-bold text-sm text-[var(--admin-navy)]">{group}</h4>
                      <span className="text-[10px] bg-[var(--admin-surface-2)] px-2 py-0.5 rounded-full text-muted-foreground">
                        {groupPerms.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {groupPerms.map((p) => {
                        const isChecked = currentRolePerms.includes(p.key);
                        return (
                          <label 
                            key={p.id} 
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked 
                              ? "bg-[var(--admin-yellow-soft)] border-[var(--admin-yellow)]" 
                              : "hover:bg-[var(--admin-surface-2)] border-transparent"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 accent-[var(--admin-navy)]"
                              checked={isChecked}
                              disabled={selectedRole === 'super_admin'}
                              onChange={(e) => {
                                const newPerms = e.target.checked
                                  ? [...currentRolePerms, p.key]
                                  : currentRolePerms.filter(k => k !== p.key);
                                
                                queryClient.setQueryData(["admin-roles"], (old: any) => 
                                  old.map((r: any) => r.role === selectedRole ? { ...r, permissions: newPerms } : r)
                                );
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">{p.key}</span>
                              <span className="text-[11px] text-muted-foreground leading-tight">
                                {p.description}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
