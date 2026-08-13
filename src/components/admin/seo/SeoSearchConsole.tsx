import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../../site-shell";

export function SeoSearchConsole() {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Google Search Console</h2>
        <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
          Google Search Console doğrulaması için meta etiketi yapılandırması.
        </p>
      </div>

      <div className="admin-card p-6 flex flex-col gap-4">
        <label className="text-sm font-medium">Doğrulama Kodu veya Meta Etiketi</label>
        <textarea
          className="admin-input w-full min-h-[120px] font-mono text-sm"
          placeholder="abc123googleverification veya <meta name='google-site-verification' content='...'>"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <div className="flex justify-end">
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
  );
}
