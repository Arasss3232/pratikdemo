import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim — Pratik Endüstriyel" },
      { name: "description", content: "Pratik Endüstriyel ile iletişime geçin: satış, teknik destek, kurumsal talepler için telefon, e-posta ve ofis bilgileri." },
      { property: "og:title", content: "İletişim — Pratik Endüstriyel" },
      { property: "og:description", content: "Satış, teknik destek ve kurumsal talepler için ekibimize ulaşın." },
      { property: "og:url", content: "/iletisim" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/iletisim" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "İletişim — Pratik Endüstriyel",
          url: "/iletisim",
        }),
      },
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