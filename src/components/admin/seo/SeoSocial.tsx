import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoSocial() {
  const settings = useSiteSettings();
  const [form, setForm] = useState({
    og_image: "",
    twitter_image: "",
    social_facebook: "",
    social_instagram: "",
    social_linkedin: "",
    social_twitter: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        og_image: settings.og_image_default || "",
        twitter_image: settings.twitter_image_default || "",
        social_facebook: settings.social_facebook || "",
        social_instagram: settings.social_instagram || "",
        social_linkedin: settings.social_linkedin || "",
        social_twitter: settings.social_twitter || ""
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        og_image_default: form.og_image,
        twitter_image_default: form.twitter_image,
        social_facebook: form.social_facebook,
        social_instagram: form.social_instagram,
        social_linkedin: form.social_linkedin,
        social_twitter: form.social_twitter
      } as any)
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
    } else {
      toast.success("Sosyal medya ayarları güncellendi.");
      settings.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Sosyal Medya & Open Graph</h2>
        <p className="text-sm text-muted-foreground">Paylaşımlarda görünecek görselleri ve sosyal medya bağlantılarını yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b bg-muted/30 font-medium text-[var(--admin-navy)]">Varsayılan Paylaşım Görselleri</div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Open Graph Görseli (1200x630)</label>
              <input 
                value={form.og_image}
                onChange={(e) => setForm({ ...form, og_image: e.target.value })}
                className="admin-input w-full"
                placeholder="https://.../og-image.jpg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter/X Kart Görseli (800x418)</label>
              <input 
                value={form.twitter_image}
                onChange={(e) => setForm({ ...form, twitter_image: e.target.value })}
                className="admin-input w-full"
                placeholder="https://.../twitter-card.jpg"
              />
            </div>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b bg-muted/30 font-medium text-[var(--admin-navy)]">Sosyal Medya Profilleri</div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook Sayfa URL</label>
              <input 
                value={form.social_facebook}
                onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                className="admin-input w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram URL</label>
              <input 
                value={form.social_instagram}
                onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                className="admin-input w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <input 
                value={form.social_linkedin}
                onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
                className="admin-input w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-2 rounded bg-[var(--admin-navy)] text-white font-bold text-sm disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Sosyal Medya Ayarlarını Kaydet"}
        </button>
      </div>
    </div>
  );
}
