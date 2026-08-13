import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, History, RotateCcw, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function HistoryPanel() {
  const { data: revisions, isLoading } = useQuery({
    queryKey: ["cms-history"],
    queryFn: async () => {
      // Assuming content_revisions table exists
      const { data } = await supabase
        .from("content_revisions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    }
  });

  if (isLoading) return <div className="p-8 text-white/40"><Loader2 className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">İçerik Geçmişi</h2>
          <p className="text-white/50">Son yapılan değişiklikler ve versiyonlar</p>
        </div>
      </div>

      <div className="space-y-4">
        {revisions?.length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed border-white/5 rounded-2xl text-white/20">
            <History size={48} className="mx-auto mb-4 opacity-50" />
            <p>Henüz kayıtlı bir değişiklik geçmişi yok.</p>
          </div>
        ) : (
          revisions?.map((rev: any) => (
            <div key={rev.id} className="bg-white/5 border border-white/5 p-5 rounded-xl flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{rev.reason || "İçerik Güncellemesi"}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/60 uppercase">
                      {rev.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {format(new Date(rev.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={12} />
                      Admin
                    </span>
                  </div>
                </div>
              </div>
              <button className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100">
                <RotateCcw size={14} />
                Geri Yükle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
