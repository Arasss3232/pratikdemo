import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/urunler/sarf-malzemeleri")({
  head: () => ({
    meta: [
      { title: "Sarf Malzemeleri — Kesme, Taşlama Diskleri | Pratik" },
      { name: "description", content: "Kesme ve taşlama diskleri, uçlar ve tüm tüketim malzemeleri." },
      { property: "og:title", content: "Sarf Malzemeleri | Pratik" },
      { property: "og:description", content: "Kesme, taşlama diskleri, uçlar ve tüketim malzemeleri." },
      { property: "og:url", content: "/urunler/sarf-malzemeleri" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler/sarf-malzemeleri" }],
  }),
  component: () => (
    <SiteShell>
      <PagePlaceholder
        title="Sarf Malzemeleri"
        crumb="Sarf Malzemeleri"
        description="Kesme ve taşlama diskleri, uçlar ve tüm tüketim malzemeleri."
      />
    </SiteShell>
  ),
});