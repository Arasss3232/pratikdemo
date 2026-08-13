import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type AdminTask = {
  id: string;
  title: string;
  description: string | null;
  related_module: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  priority: 'Düşük' | 'Normal' | 'Yüksek' | 'Acil';
  status: 'Bekliyor' | 'Devam Ediyor' | 'Tamamlandı' | 'İptal Edildi';
  due_at: string | null;
  created_at: string | null;
  notes: string | null;
};

export function TasksTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["admin-tasks", filter],
    queryFn: async () => {
      let query = supabase.from("admin_tasks").select("*").order("created_at", { ascending: false });
      
      if (filter === "my") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) query = query.eq("assigned_to", user.id);
      } else if (filter === "pending") {
        query = query.eq("status", "Bekliyor");
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AdminTask[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AdminTask['status'] }) => {
      const { error } = await supabase
        .from("admin_tasks")
        .update({ 
          status, 
          completed_at: status === 'Tamamlandı' ? new Date().toISOString() : null 
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Görev durumu güncellendi");
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("admin_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Görev silindi");
    }
  });

  const priorityColors = {
    'Düşük': 'bg-gray-100 text-gray-700',
    'Normal': 'bg-blue-100 text-blue-700',
    'Yüksek': 'bg-orange-100 text-orange-700',
    'Acil': 'bg-red-100 text-red-700',
  };

  const statusColors = {
    'Bekliyor': 'border-gray-200 text-gray-500',
    'Devam Ediyor': 'border-blue-200 text-blue-500',
    'Tamamlandı': 'border-green-200 text-green-600 bg-green-50',
    'İptal Edildi': 'border-red-200 text-red-400',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">Görevlerim</h2>
          <p className="text-sm text-muted-foreground">Yönetim panelindeki aktif iş kalemleri ve süreç takibi.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="admin-input text-sm py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tüm Görevler</option>
            <option value="my">Bana Atananlar</option>
            <option value="pending">Bekleyenler</option>
          </select>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => toast.info("Yeni görev oluşturma yakında aktif edilecek.")}
          >
            <Icon name="add" className="text-lg" />
            Yeni Görev
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--admin-surface-2)] animate-pulse" />
          ))
        ) : tasks.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-[var(--admin-border)] rounded-3xl">
            <Icon name="task" className="text-5xl mb-4 opacity-10" />
            <p>Henüz bir görev bulunmuyor.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className={`group p-5 rounded-2xl border transition-all hover:shadow-md bg-[var(--admin-surface)] ${
                task.status === 'Tamamlandı' ? 'opacity-75 border-green-100' : 'border-[var(--admin-border)]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteTaskMutation.mutate(task.id)}
                    className="p-1 hover:text-red-600 transition-colors"
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
              
              <h3 className={`font-bold mb-1 line-clamp-1 ${task.status === 'Tamamlandı' ? 'line-through text-muted-foreground' : 'text-[var(--admin-navy)]'}`}>
                {task.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">
                {task.description || "Açıklama girilmemiş."}
              </p>

              <div className="flex items-center gap-2 mb-4 text-[11px] text-muted-foreground">
                <Icon name="event" className="text-sm" />
                <span>{task.due_at ? format(new Date(task.due_at), 'd MMMM yyyy', { locale: tr }) : 'Tarih belirtilmedi'}</span>
                {task.related_module && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="capitalize">{task.related_module}</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--admin-border)]">
                <select
                  className={`text-[11px] border rounded-lg px-2 py-1 outline-none transition-colors ${statusColors[task.status]}`}
                  value={task.status}
                  onChange={(e) => updateStatusMutation.mutate({ id: task.id, status: e.target.value as AdminTask['status'] })}
                >
                  <option value="Bekliyor">Bekliyor</option>
                  <option value="Devam Ediyor">Devam Ediyor</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                  <option value="İptal Edildi">İptal Edildi</option>
                </select>
                
                <button className="text-[11px] font-semibold text-[var(--admin-navy)] hover:underline">
                  Detayları Gör
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
