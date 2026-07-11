import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/urunler/kkd")({
  head: () => ({
    meta: [
      { title: "Kişisel Koruyucu Donanım (KKD) | Pratik" },
      { name: "description", content: "Baret, gözlük, eldiven, iş ayakkabısı ve iş güvenliği ürünleri. CE sertifikalı KKD çözümleri." },
      { property: "og:title", content: "Kişisel Koruyucu Donanım | Pratik" },
      { property: "og:description", content: "Baret, gözlük, eldiven, ayakkabı ve iş güvenliği ürünleri." },
      { property: "og:url", content: "/urunler/kkd" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler/kkd" }],
  }),
  component: () => (
    <SiteShell>
      <PagePlaceholder
        title="Kişisel Koruyucu Donanım"
        crumb="KKD"
        description="Baret, gözlük, eldiven, iş ayakkabısı ve tüm iş güvenliği ürünleri CE sertifikalı olarak sunulmaktadır."
      />
    </SiteShell>
  ),
});