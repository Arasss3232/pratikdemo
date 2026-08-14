import { useContentManager } from "@/hooks/use-site-content";
import { Loader2, Globe, Undo2, Save, ExternalLink, Type, Link as LinkIcon, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Enterprise-grade Editor Panel for CMS.
 * Dynamically renders form fields based on data fetched from site_content table.
 */
interface ContentEditorPanelProps {
  pageSection: string;
}

export function ContentEditorPanel({ pageSection }: ContentEditorPanelProps) {
  // Use our custom content manager hook for logic and state
  const { 
    draftData, 
    isLoading, 
    updateDraft, 
    undoChanges, 
    hasChanges, 
    publish, 
    isPublishing 
  } = useContentManager(pageSection);

  // 1. Loading State: Beautiful Skeleton Loader
  if (isLoading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64 bg-white/10" />
            <Skeleton className="h-4 w-96 bg-white/5" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 bg-white/10" />
            <Skeleton className="h-10 w-32 bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-12 w-full bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Main Render: The Editor
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* TOP ACTION BAR */}
      <div className="h-20 px-10 border-b border-white/5 bg-[var(--admin-navy-deep)]/30 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="text-[var(--admin-yellow)] w-5 h-5" />
            {pageSection.replace(/_/g, ' ').toUpperCase()} Bölümü
          </h2>
          <p className="text-xs text-white/40 font-medium">Bu bölümdeki metin ve linkleri anlık olarak güncelleyebilirsiniz.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Site Button */}
          <button 
            onClick={() => window.open('/', '_blank')}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/5"
          >
            <ExternalLink size={16} />
            Sitede Gör
          </button>

          {/* Undo (Geri Al) Button */}
          <button 
            onClick={undoChanges}
            disabled={!hasChanges}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/5"
            title="Değişiklikleri Geri Al"
          >
            <Undo2 size={16} />
            Geri Al
          </button>

          {/* Publish (Yayınla) Button */}
          <button 
            onClick={() => publish()}
            disabled={isPublishing || !hasChanges}
            className="h-10 px-6 bg-[var(--admin-yellow)] hover:bg-[var(--admin-yellow)]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--admin-navy)] text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[var(--admin-yellow)]/20 active:scale-95"
          >
            {isPublishing ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save size={18} />
            )}
            Yayınla
          </button>
        </div>
      </div>

      {/* DYNAMIC FORM AREA */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 admin-sidebar-scroll">
        
        {/* Helper Alert */}
        <div className="bg-[var(--admin-yellow)]/10 border border-[var(--admin-yellow)]/20 rounded-2xl p-4 flex items-start gap-4 mb-8">
          <Info className="text-[var(--admin-yellow)] w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[var(--admin-yellow)]/80">
            <strong>Bilgi:</strong> Yapılan değişiklikler sadece "Yayınla" butonuna bastığınızda canlı siteye yansır. 
            "Geri Al" butonu ile kaydetmediğiniz tüm değişiklikleri iptal edebilirsiniz.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl">
          {Object.entries(draftData).length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-white/20">
              <Globe size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium italic">Bu bölüm için henüz tanımlanmış alan bulunmuyor.</p>
            </div>
          ) : (
            Object.entries(draftData).map(([key, value]) => {
              const isLongText = value.length > 100 || key.includes('text') || key.includes('desc') || key.includes('title');
              
              return (
                <div key={key} className="group space-y-3 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-3xl border border-white/5 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-[var(--admin-yellow)]/60 transition-colors">
                      {key.includes('link') ? <LinkIcon size={12} /> : <Type size={12} />}
                      {key.replace(/_/g, ' ')}
                    </label>
                    <span className="text-[9px] font-mono text-white/10 uppercase">{key}</span>
                  </div>

                  {isLongText ? (
                    <Textarea
                      className="bg-black/40 border-white/5 rounded-xl min-h-[120px] focus:ring-[var(--admin-yellow)] focus:border-[var(--admin-yellow)]/50 transition-all text-white placeholder:text-white/10"
                      value={value}
                      onChange={(e) => updateDraft(key, e.target.value)}
                      placeholder={`${key} içeriğini girin...`}
                    />
                  ) : (
                    <Input
                      className="bg-black/40 border-white/5 rounded-xl h-12 focus:ring-[var(--admin-yellow)] focus:border-[var(--admin-yellow)]/50 transition-all text-white placeholder:text-white/10"
                      value={value}
                      onChange={(e) => updateDraft(key, e.target.value)}
                      placeholder={`${key} değerini girin...`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="h-20" /> {/* Spacer */}
      </div>
    </div>
  );
}
