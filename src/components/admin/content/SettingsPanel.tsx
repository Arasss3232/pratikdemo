import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Phone, Mail, Clock, Building2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadField } from "../ImageUploadField";

export function SettingsPanel() {
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<any>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-cms"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").maybeSingle();
      return data;
    }
  });

  useEffect(() => {
    if (settings) setLocalSettings(JSON.parse(JSON.stringify(settings)));
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      if (!settings?.id) throw new Error("Settings record not found");
      const { error } = await supabase.from("site_settings").update(newSettings).eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-cms"] });
      toast.success("Genel ayarlar kaydedildi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  if (isLoading || !localSettings) return <div className="p-8 text-white/40 flex items-center gap-3"><Loader2 className="animate-spin" /> Yükleniyor...</div>;

  const handleChange = (field: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Genel Site Ayarları</h2>
          <p className="text-white/50">Tüm sayfalarda geçerli temel bilgiler</p>
        </div>
        <button 
          onClick={() => localSettings && updateMutation.mutate(localSettings)}
          disabled={updateMutation.isPending}
          className="h-11 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20"
        >
          {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Info */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Building2 className="text-[var(--admin-yellow)]" size={20} />
            <h3 className="font-bold">Kurumsal Bilgiler</h3>
          </div>
          <div className="space-y-4">
            <InputField label="Şirket Adı" value={localSettings.company_name} onChange={v => handleChange("company_name", v)} />
            <InputField label="Slogan (Tagline)" value={localSettings.tagline} onChange={v => handleChange("tagline", v)} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/40 uppercase">Şirket Açıklaması</label>
              <textarea 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm min-h-[100px] text-white"
                value={localSettings.description || ""}
                onChange={e => handleChange("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Phone className="text-[var(--admin-yellow)]" size={20} />
            <h3 className="font-bold">İletişim Kanalları</h3>
          </div>
          <div className="space-y-4">
            <InputField label="Telefon" value={localSettings.phone} onChange={v => handleChange("phone", v)} icon={<Phone size={14}/>} />
            <InputField label="E-posta" value={localSettings.email} onChange={v => handleChange("email", v)} icon={<Mail size={14}/>} />
            <InputField label="WhatsApp" value={localSettings.whatsapp} onChange={v => handleChange("whatsapp", v)} placeholder="905..." />
            <InputField label="Çalışma Saatleri" value={localSettings.working_hours} onChange={v => handleChange("working_hours", v)} icon={<Clock size={14}/>} />
          </div>
        </div>

        {/* Agency Info */}
        <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <LinkIcon className="text-[var(--admin-yellow)]" size={20} />
            <h3 className="font-bold">Ajans Referansı (Footer)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex items-center gap-3 h-11">
              <input 
                type="checkbox" 
                id="agency_visible"
                checked={localSettings.agency_attribution_visible}
                onChange={e => handleChange("agency_attribution_visible", e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-[var(--admin-yellow)]"
              />
              <label htmlFor="agency_visible" className="text-sm">Link Görünsün</label>
            </div>
            <div className="md:col-span-1">
              <InputField label="Link Metni" value={localSettings.agency_attribution_text} onChange={v => handleChange("agency_attribution_text", v)} />
            </div>
            <div className="md:col-span-2">
              <InputField label="Yönlendirme URL" value={localSettings.agency_attribution_url} onChange={v => handleChange("agency_attribution_url", v)} />
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <ImageIcon className="text-[var(--admin-yellow)]" size={20} />
            <h3 className="font-bold">Marka Varlıkları</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploadField label="Ana Logo" value={localSettings.logo_url} onChange={v => handleChange("logo_url", v)} />
            <ImageUploadField label="Mobil Logo" value={localSettings.mobile_logo_url} onChange={v => handleChange("mobile_logo_url", v)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input 
        className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
        value={value || ""}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
