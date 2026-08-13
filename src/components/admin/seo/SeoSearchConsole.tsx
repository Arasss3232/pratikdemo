import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../../site-shell";

export function SeoSearchConsole() {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_settings").select("google_search_console").eq("id", true).maybeSingle();
      if (data?.google_search_console) {
        setVerificationCode(data.google_search_console);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    let finalCode = verificationCode;
    
    // Parse if user pasted full tag
    if (verificationCode.includes('content=')) {
      const match = verificationCode.match(/content=["']([^"']+)["']/);
      if (match) finalCode = match[1];
    }

    const { error } = await supabase
      .from("site_settings")
      .update({ google_search_console: finalCode } as any)
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi", { description: error.message });
    } else {
      toast.success("Doğrulama kodu güncellendi.");
    }
    setLoading(false);
  };

  const handleTestCode = () => {
    setVerificationCode("seo-verification-test-2026");
    toast.info("Test kodu alana yerleştirildi. Kaydederek test edebilirsiniz.");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Google Search Console</h2>
          <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
            Google Search Console doğrulaması için meta etiketi yapılandırması.
          </p>
        </div>
        {!verificationCode && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
            <Icon name="warning" className="text-xs" />
            Doğrulama kodu eklenmedi
          </div>
        )}
      </div>

      <div className="admin-card p-6 flex flex-col gap-4">
        <label className="text-sm font-medium">Doğrulama Kodu veya Meta Etiketi</label>
        <textarea
          className="admin-input w-full min-h-[120px] font-mono text-sm"
          placeholder="abc123googleverification veya <meta name='google-site-verification' content='...'>"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <p className="text-[11px] text-muted-foreground">
            * Yalnızca tırnak içindeki kodu (örn: <code>abc...</code>) veya tam meta etiketini yapıştırabilirsiniz.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleTestCode}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              Test Kodu
            </button>
            <button 
              disabled={loading}
              onClick={handleSave}
              className="admin-btn admin-btn-primary"
            >
              {loading ? "Kaydediliyor..." : "Kodu Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-blue-50 border-blue-100 flex gap-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Icon name="help" className="text-blue-600" />
        </div>
        <div className="text-xs text-blue-800 space-y-2">
          <p className="font-bold">Nasıl Yapılır?</p>
          <ol className="list-decimal list-inside space-y-1 opacity-90">
            <li>Google Search Console'a gidin ve mülkünüzü seçin.</li>
            <li>Ayarlar &gt; Sahiplik Doğrulama &gt; HTML Etiketi adımlarını izleyin.</li>
            <li>Verilen meta etiketini kopyalayıp yukarıdaki alana yapıştırın ve kaydedin.</li>
            <li>Google panelinde "Doğrula" butonuna basın.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
