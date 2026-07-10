import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kurumsal")({
  head: () => ({
    meta: [
      { title: "Kurumsal — Pratik Endüstriyel Hakkında" },
      { name: "description", content: "Pratik Endüstriyel: 25 yılı aşkın deneyim, güvenilir tedarik ağı ve uzman ekibimizle sanayinin çözüm ortağı." },
      { property: "og:title", content: "Kurumsal — Pratik Endüstriyel Hakkında" },
      { property: "og:description", content: "Misyonumuz, ekibimiz ve değerlerimizle sanayinin çözüm ortağı." },
      { property: "og:url", content: "/kurumsal" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kurumsal" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Pratik Endüstriyel Hakkında",
          url: "/kurumsal",
        }),
      },
    ],
  }),
  component: KurumsalPage,
});

function KurumsalPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Kurumsal"
        crumb="Kurumsal"
        description="Endüstriyel donanım tedarikinde güvenilir çözüm ortağı olarak hikâyemizi ve değerlerimizi keşfedin."
      />
    </SiteShell>
  );
}