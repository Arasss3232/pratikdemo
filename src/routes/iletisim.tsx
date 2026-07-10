import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim — Pratik" },
      { name: "description", content: "Pratik ile iletişime geçin: telefon, e-posta ve satış ofisi bilgileri." },
    ],
  }),
  component: IletisimPage,
});

function IletisimPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Bize Ulaşın"
        crumb="İletişim"
        description="Satış, teknik destek ve kurumsal talepleriniz için ekibimize ulaşın."
      />
    </SiteShell>
  );
}