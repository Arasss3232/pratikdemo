import { useContentManager } from "@/hooks/use-site-content";
import { Loader2, Globe, Undo2, Save, ExternalLink, Type, Link as LinkIcon, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Enterprise-grade Editor Panel for CMS.
 * Dynamically renders form fields based on data fetched from site_content table.
 */
interface ContentEditorPanelProps {
  pageSection: string;
}

export function ContentEditorPanel({ pageSection }: ContentEditorPanelProps) {
  const { 
    draftData, 
    isLoading, 
    updateDraft, 
    undoChanges, 
    hasChanges, 
    publish, 
    isPublishing 
  } = useContentManager(pageSection);

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

  // Section specific labels and groupings
  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      top_bar: "Üst Bilgi Çubuğu Ayarları",
      header: "Header ve Navigasyon Ayarları",
      footer: "Footer Bilgileri ve Sosyal Medya",
      hero: "Ana Sayfa Karşılama (Hero) Bölümü",
      corporate: "Kurumsal Sayfası İçerikleri",
      products: "Ürünler Sayfası İçerikleri",
      catalogs: "Kataloglar Sayfası İçerikleri",
      dealerships: "Bayiliklerimiz Sayfası İçerikleri",
      contact: "İletişim Sayfası ve Form Bilgileri"
    };
    return titles[section] || section.toUpperCase();
  };

  const getFieldLabel = (key: string) => {
    const labels: Record<string, string> = {
      // Global
      working_hours: "Çalışma Saatleri",
      address: "Adres Bilgisi",
      phone: "Telefon Numarası",
      whatsapp_number: "WhatsApp Numarası",
      whatsapp_link: "WhatsApp Direkt Link",
      cta_text: "Eylem Butonu Metni",
      logo_url: "Logo Görsel URL",
      nav_home: "Menü: Ana Sayfa",
      nav_corporate: "Menü: Kurumsal",
      nav_products: "Menü: Ürünler",
      nav_catalogs: "Menü: Kataloglar",
      nav_dealerships: "Menü: Bayilikler",
      nav_contact: "Menü: İletişim",
      cta_button_text: "Header Buton Metni",
      company_description: "Şirket Kısa Tanıtımı (Footer)",
      email: "E-Posta Adresi",
      facebook_url: "Facebook Linki",
      instagram_url: "Instagram Linki",
      linkedin_url: "LinkedIn Linki",
      copyright_text: "Telif Hakkı (Copyright) Metni",
      
      // Home
      main_title: "Hero Ana Başlık",
      about_text: "Hero Açıklama Metni",
      primary_cta_text: "Hero Birincil Buton",
      secondary_cta_text: "Hero İkincil Buton",
      stat_1_label: "İstatistik 1 Başlık",
      stat_1_value: "İstatistik 1 Değer",
      stat_2_label: "İstatistik 2 Başlık",
      stat_2_value: "İstatistik 2 Değer",
      cta_banner_text: "Hero Alt Banner Metni",
      
      // Corporate
      about_title: "Hakkımızda Başlık",
      about_content: "Hakkımızda Kısa Metin",
      mission: "Misyonumuz",
      vision: "Vizyonumuz",
      page_title: "Sayfa Başlığı",
      page_subtitle: "Sayfa Alt Başlığı",
      
      // Common
      page_description: "Sayfa Açıklaması",
      form_title: "Form Başlığı",
      map_embed_url: "Google Harita Embed URL",
      contact_subtitle: "İletişim Alt Başlık"
    };
    return labels[key] || key.replace(/_/g, ' ');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* TOP ACTION BAR */}
      <div className="h-20 px-10 border-b border-white/5 bg-[var(--admin-navy-deep)]/30 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Globe className="text-[var(--admin-yellow)] w-5 h-5" />
            {getSectionTitle(pageSection)}
          </h2>
          <p className="text-xs text-white/40 font-medium">Bu bölümdeki metin, link ve görsel URL'lerini 1:1 yönetebilirsiniz.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.open('/', '_blank')}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/5"
          >
            <ExternalLink size={16} />
            Sitede Gör
          </button>

          <button 
            onClick={undoChanges}
            disabled={!hasChanges}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/5"
            title="Değişiklikleri Geri Al"
          >
            <Undo2 size={16} />
            Geri Al
          </button>

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
        
        <div className="bg-[var(--admin-yellow)]/10 border border-[var(--admin-yellow)]/20 rounded-2xl p-4 flex items-start gap-4 mb-8 max-w-4xl">
          <Info className="text-[var(--admin-yellow)] w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[var(--admin-yellow)]/80">
            <strong>Kapsamlı Yönetim:</strong> Sitede görünen her bir alan için eşleşen bir giriş kutusu bulunmaktadır.
            Yapılan değişikliklerin canlı sitede görünmesi için <strong>"Yayınla"</strong> butonuna basmayı unutmayın.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl">
          {Object.entries(draftData).length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-white/20">
              <Globe size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium italic">Bu bölüm için henüz tanımlanmış alan bulunmuyor.</p>
            </div>
          ) : (
            <Card className="bg-white/[0.02] border-white/5 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.01] px-8 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/60 flex items-center gap-3">
                  <Type className="text-[var(--admin-yellow)] w-4 h-4" />
                  İçerik Alanları
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {Object.entries(draftData).map(([key, value]) => {
                  const isLongText = value.length > 100 || key.includes('content') || key.includes('description') || key.includes('mission') || key.includes('vision');
                  
                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em] flex items-center gap-2">
                          {key.includes('link') || key.includes('url') ? <LinkIcon size={12} className="text-[var(--admin-yellow)]/70" /> : <Type size={12} className="text-[var(--admin-yellow)]/70" />}
                          {getFieldLabel(key)}
                        </label>
                        <code className="text-[9px] font-mono text-white/10">{key}</code>
                      </div>

                      {isLongText ? (
                        <Textarea
                          className="bg-black/40 border-white/10 rounded-xl min-h-[140px] focus:ring-[var(--admin-yellow)] focus:border-[var(--admin-yellow)]/50 transition-all text-white placeholder:text-white/10"
                          value={value}
                          onChange={(e) => updateDraft(key, e.target.value)}
                          placeholder={`${getFieldLabel(key)} içeriğini girin...`}
                        />
                      ) : (
                        <Input
                          className="bg-black/40 border-white/10 rounded-xl h-12 focus:ring-[var(--admin-yellow)] focus:border-[var(--admin-yellow)]/50 transition-all text-white placeholder:text-white/10"
                          value={value}
                          onChange={(e) => updateDraft(key, e.target.value)}
                          placeholder={`${getFieldLabel(key)} değerini girin...`}
                        />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}