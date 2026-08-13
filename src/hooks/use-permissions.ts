import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const { user } = useAuth();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["user-permissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Super admin check is handled by server functions too, 
      // but we can check the role here for UI visibility.
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      if (roles?.some(r => r.role === 'super_admin')) {
        // Return a special flag or all keys if super admin
        return ["*"];
      }

      const { data, error } = await supabase.rpc("has_permission", {
        _user_id: user.id,
        _permission_key: "dashboard.view" // Dummy check to trigger RPC or we could fetch all
      });

      // Better: Fetch all granted permission keys for this user
      const { data: rolePerms } = await supabase
        .from("user_roles")
        .select(`
          role,
          role_permissions (
            permissions (
              key
            )
          )
        `)
        .eq("user_id", user.id);

      const keys = new Set<string>();
      rolePerms?.forEach((rp: any) => {
        rp.role_permissions?.forEach((p: any) => {
          if (p.permissions?.key) keys.add(p.permissions.key);
        });
      });

      return Array.from(keys);
    },
    enabled: !!user,
  });

  const hasPermission = (key: string) => {
    if (permissions.includes("*")) return true;
    return permissions.includes(key);
  };

  return { permissions, hasPermission, isLoading };
}
