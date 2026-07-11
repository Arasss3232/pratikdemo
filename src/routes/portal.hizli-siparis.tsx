import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, EmptyState } from "@/components/portal/portal-ui";
export const Route = createFileRoute("/portal/hizli-siparis")({ component: () => (
  <>
    <PageTitle icon="bolt" title="Hızlı Sipariş" subtitle="SKU ile toplu sipariş girişi" />
    <EmptyState icon="bolt" title="Hızlı sipariş modülü yakında"
      description="Bu ekrandan SKU listelerini yapıştırarak dakikalar içinde sipariş oluşturabileceksiniz."
      action={<Link to="/portal/teklif-al" className="portal-btn portal-btn-primary">Teklif Talep Et</Link>} />
  </>
)});