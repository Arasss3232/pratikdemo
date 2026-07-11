import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/urunler/el-aletleri")({
  head: () => ({
    meta: [
      { title: "El Aletleri — Anahtar, Tornavida, Pense | Pratik" },
      { name: "description", content: "Anahtar takımları, tornavidalar, pense ve profesyonel el aletleri." },
      { property: "og:title", content: "El Aletleri | Pratik" },
      { property: "og:description", content: "Anahtar takımları, tornavidalar, pense ve el aletleri." },
      { property: "og:url", content: "/urunler/el-aletleri" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler/el-aletleri" }],
  }),
  component: () => (
    <SiteShell>
      <PagePlaceholder
        title="El Aletleri"
        crumb="El Aletleri"
        description="Anahtar takımları, tornavidalar, pense ve profesyonel el aletleri."
      />
    </SiteShell>
  ),
});