import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type Notification = {
  id: string;
  title: string;
  message: string;
  severity: string;
  is_read: boolean | null;
  created_at: string | null;
  target_url: string | null;
  related_module: string | null;
};

export function NotificationsTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["admin-notifications", filter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase.from("notifications").select("*").eq("recipient_id", user.id).order("created_at", { ascending: false });
      
      if (filter === "unread") {
        query = query.eq("is_read", false);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("recipient_id", user.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      toast.success("Tüm bildirimler okundu olarak işaretlendi");
    }
  });

  const getSeverityStyles = (severity: string) => {
    const styles: Record<string, { name: string; color: string }> = {
      info: { name: "info", color: "text-blue-500 bg-blue-50" },
      success: { name: "check_circle", color: "text-green-500 bg-green-50" },
      warning: { name: "warning", color: "text-amber-500 bg-amber-50" },
      error: { name: "error", color: "text-red-500 bg-red-50" },
    };
    return styles[severity] || styles.info;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">Bildirimler</h2>
          <p className="text-sm text-muted-foreground">Sistem olayları ve işlem uyarıları.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="admin-input text-sm py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tümü</option>
            <option value="unread">Okunmamışlar</option>
          </select>
          <button 
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending || notifications.every(n => n.is_read)}
          >
            Tümünü Okundu İşaretle
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--admin-surface-2)] animate-pulse" />
          ))
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground border-2 border-dashed border-[var(--admin-border)] rounded-3xl">
            <Icon name="notifications_none" className="text-5xl mb-4 opacity-10" />
            <p>Bildirim bulunmuyor.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const style = getSeverityStyles(n.severity);
            return (
              <div 
                key={n.id}
                onClick={() => !n.is_read && markAsReadMutation.mutate(n.id)}
                className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                  n.is_read 
                  ? 'bg-[var(--admin-surface)] border-[var(--admin-border)] opacity-75' 
                  : 'bg-[var(--admin-surface)] border-blue-200 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-xl shrink-0 ${style.color}`}>
                  <Icon name={style.name as any} className="text-xl" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold text-sm truncate ${!n.is_read ? 'text-[var(--admin-navy)]' : 'text-muted-foreground'}`}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-4">
                      {n.created_at ? format(new Date(n.created_at), 'd MMM, HH:mm', { locale: tr }) : '-'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                  {n.related_module && (
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Kaynak: {n.related_module}
                    </span>
                  )}
                </div>

                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 self-center" title="Okunmadı" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
