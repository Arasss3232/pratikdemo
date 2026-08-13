import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type ApprovalRequest = {
  id: string;
  approval_no: number;
  request_type: string;
  module: string;
  related_title: string | null;
  requested_by: string;
  status: 'Onay Bekliyor' | 'Onaylandı' | 'Reddedildi' | 'İptal Edildi' | 'Süresi Doldu';
  priority: 'Normal' | 'Yüksek' | 'Acil';
  created_at: string;
  reason: string | null;
  proposed_values: any;
};

export function ApprovalsTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("pending");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-approvals", filter],
    queryFn: async () => {
      let query = supabase.from("approval_requests").select("*").order("created_at", { ascending: false });
      
      if (filter === "pending") {
        query = query.eq("status", "Onay Bekliyor");
      } else if (filter === "reviewed") {
        query = query.in("status", ["Onaylandı", "Reddedildi"]);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ApprovalRequest[];
    },
  });

  const handleDecision = useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: 'Onaylandı' | 'Reddedildi'; note?: string }) => {
      const { error } = await supabase
        .from("approval_requests")
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
          reviewer_note: note
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
      toast.success(variables.status === 'Onaylandı' ? "Talep onaylandı" : "Talep reddedildi");
    }
  });

  const priorityColors = {
    'Normal': 'bg-blue-100 text-blue-700',
    'Yüksek': 'bg-orange-100 text-orange-700',
    'Acil': 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">Onay Bekleyenler</h2>
          <p className="text-sm text-muted-foreground">Kritik içerik ve sistem değişiklikleri için onay merkezi.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="admin-input text-sm py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">Bekleyenler</option>
            <option value="reviewed">Geçmiş Kararlar</option>
            <option value="all">Tümü</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--admin-surface-2)]/50 border-b border-[var(--admin-border)]">
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">No</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Tür / Modül</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">İçerik</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)] text-center">Öncelik</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Tarih</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)]">Durum</th>
              <th className="px-6 py-4 font-semibold text-[var(--admin-navy)] text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                </tr>
              ))
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Gösterilecek onay talebi bulunmuyor.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-[var(--admin-surface-2)]/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">#{req.approval_no}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--admin-navy)]">{req.request_type}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{req.module}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px]">{req.related_title || "Belirtilmedi"}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[req.priority]}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {format(new Date(req.created_at), 'd MMM yyyy HH:mm', { locale: tr })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs ${
                      req.status === 'Onay Bekliyor' ? 'text-blue-600' :
                      req.status === 'Onaylandı' ? 'text-green-600' :
                      'text-red-500'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Onay Bekliyor' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDecision.mutate({ id: req.id, status: 'Onaylandı' })}
                          className="h-8 w-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors grid place-items-center"
                          title="Onayla"
                        >
                          <Icon name="check" className="text-lg" />
                        </button>
                        <button 
                          onClick={() => {
                            const reason = window.prompt("Reddetme sebebi:");
                            if (reason) handleDecision.mutate({ id: req.id, status: 'Reddedildi', note: reason });
                          }}
                          className="h-8 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors grid place-items-center"
                          title="Reddet"
                        >
                          <Icon name="close" className="text-lg" />
                        </button>
                      </div>
                    ) : (
                      <button className="text-[11px] text-muted-foreground hover:underline">
                        Detaylar
                      </button>
                    )}
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
