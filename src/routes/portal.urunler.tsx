import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, EmptyState } from "@/components/portal/portal-ui";
export const Route = createFileRoute("/portal/urunler")({ component: () => (
  <>
    <PageTitle icon="inventory_2" title="Ürün Kataloğu" subtitle="Firmanıza özel fiyatlandırılmış ürünler" />
    <EmptyState icon="inventory_2" title="Katalog hazırlanıyor"
      description="Firmanıza özel fiyat listesi ve stok görünümü yakında bu ekranda olacak. Şu ana kadar teklif talep etmeye devam edebilirsiniz."
      action={<Link to="/portal/teklif-al" className="portal-btn portal-btn-primary">Teklif Talep Et</Link>} />
  </>
)});