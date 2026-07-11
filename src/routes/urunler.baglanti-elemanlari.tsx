import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/urunler/baglanti-elemanlari")({
  head: () => ({
    meta: [
      { title: "Bağlantı Elemanları — Cıvata, Somun, Pul | Pratik" },
      { name: "description", content: "Endüstriyel cıvata, somun, pul ve özel bağlantı çözümleri. DIN, ISO standartlarında geniş stok." },
      { property: "og:title", content: "Bağlantı Elemanları | Pratik" },
      { property: "og:description", content: "Cıvata, somun, pul ve özel bağlantı çözümleri." },
      { property: "og:url", content: "/urunler/baglanti-elemanlari" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler/baglanti-elemanlari" }],
  }),
  component: () => (
    <SiteShell>
      <PagePlaceholder
        title="Bağlantı Elemanları"
        crumb="Bağlantı Elemanları"
        description="Cıvata, somun, pul ve özel bağlantı çözümleri. DIN ve ISO standartlarında geniş stok."
      />
    </SiteShell>
  ),
});