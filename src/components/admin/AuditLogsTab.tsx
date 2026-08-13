import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_title: string | null;
  description?: string;
  previous_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string | null;
};

export function AuditLogsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["admin-audit-logs", searchTerm, eventFilter],
    queryFn: async () => {
      let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
      
      if (eventFilter !== "all") {
        query = query.eq("action", eventFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const getEventBadge = (type: string) => {
    const colors: Record<string, string> = {
      'INSERT': 'bg-green-100 text-green-700',
      'UPDATE': 'bg-blue-100 text-blue-700',
      'DELETE': 'bg-red-100 text-red-700',
      'LOGIN': 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const filteredLogs = logs.filter(log => 
    (log.entity_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">İşlem Geçmişi</h2>
          <p className="text-sm text-muted-foreground">Sistem üzerindeki tüm kritik değişikliklerin geriye dönük kaydı.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
            <input
              type="text"
              placeholder="İşlemlerde ara..."
              className="admin-input pl-9 text-sm py-1.5 w-full sm:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="admin-input text-sm py-1.5"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="all">Tüm Olaylar</option>
            <option value="INSERT">Ekleme (Insert)</option>
            <option value="UPDATE">Güncelleme (Update)</option>
            <option value="DELETE">Silme (Delete)</option>
            <option value="LOGIN">Giriş (Login)</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--admin-surface-2)]/50 border-b border-[var(--admin-border)]">
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Zaman</th>
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Kullanıcı</th>
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Olay</th>
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Tür</th>
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Kayıt</th>
                <th className="px-6 py-4 font-semibold text-[var(--admin-navy)] text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-12 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--admin-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                      {log.created_at ? format(new Date(log.created_at), 'd MMM yyyy HH:mm:ss', { locale: tr }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 grid place-items-center text-[10px] font-bold">
                          {log.actor_id ? 'U' : 'S'}
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground max-w-[80px] truncate" title={log.actor_id || "System"}>
                          {log.actor_id ? `${log.actor_id.split('-')[0]}...` : "System"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getEventBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-muted-foreground">{log.entity_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs max-w-xs truncate" title={log.entity_title || log.entity_id || ""}>
                        {log.entity_title || log.entity_id || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          console.log("Details:", { old: log.previous_values, new: log.new_values });
                          toast.info("İşlem detayları konsola yazdırıldı.");
                        }}
                        className="text-xs text-[var(--admin-navy)] font-semibold hover:underline"
                      >
                        İncele
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
