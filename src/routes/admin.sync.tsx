import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { syncPublicContent } from "@/lib/sync-content.functions";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/sync")({
  component: SyncPage,
});

function SyncPage() {
  const sync = useServerFn(syncPublicContent);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSync = async () => {
    setLoading(true);
    try {
      await sync();
      toast.success("CMS içerikleri başarıyla senkronize edildi.");
      navigate({ to: "/admin" });
    } catch (error) {
      console.error(error);
      toast.error("Senkronizasyon sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-center space-y-6">
      <RefreshCw size={48} className="mx-auto text-navy-500" />
      <h1 className="text-2xl font-bold text-navy-900">CMS İçerik Senkronizasyonu</h1>
      <p className="text-navy-600">
        Bu işlem, ziyaretçilerin gördüğü mevcut sabit içerikleri veritabanına aktarır. 
        Böylece Admin Panelinden bu içerikleri düzenleyebilirsiniz.
      </p>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 text-left">
        <strong>Neler yapılacak?</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Footer (Adres, İletişim, Özet) veritabanına aktarılacak.</li>
          <li>Header Top Bar (Çalışma saatleri) veritabanına aktarılacak.</li>
          <li>Ana Sayfa Hero metinleri veritabanına aktarılacak.</li>
          <li>CMS sayfa listesi (13 modül) güncellenecek.</li>
        </ul>
      </div>
      <Button 
        onClick={handleSync} 
        disabled={loading}
        className="w-full bg-navy-900 hover:bg-navy-800 text-white"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Senkronize Ediliyor...
          </>
        ) : (
          "Şimdi Senkronize Et"
        )}
      </Button>
    </div>
  );
}
