import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, EmptyState } from "@/components/portal/portal-ui";
export const Route = createFileRoute("/portal/finans")({ component: () => (
  <>
    <PageTitle icon="account_balance_wallet" title="Finansım" subtitle="Bakiye, açık faturalar ve ödemeler" />
    <EmptyState icon="account_balance_wallet" title="Finans modülü yakında"
      description="Cari bakiye, açık faturalar, ödeme geçmişi ve kredi limiti verileri bu ekranda yer alacak." />
  </>
)});