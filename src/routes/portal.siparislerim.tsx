import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, EmptyState } from "@/components/portal/portal-ui";
export const Route = createFileRoute("/portal/siparislerim")({ component: () => (
  <>
    <PageTitle icon="shopping_bag" title="Siparişlerim" subtitle="Onaylanmış siparişleriniz ve sevkiyat durumu" />
    <EmptyState icon="local_shipping" title="Sipariş takibi yakında"
      description="Onaylanan tekliflerinizden dönüştürülen siparişler, sevkiyat ve teslimat bilgileri burada listelenecek." />
  </>
)});