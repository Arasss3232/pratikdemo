import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/giris")({
  head: () => ({
    meta: [
      { title: "Bayi Girişi — Pratik Endüstriyel" },
      { name: "description", content: "Pratik bayi ve kurumsal müşteri paneline giriş yapın: sipariş takibi, özel fiyat listeleri ve teklif geçmişi." },
      { property: "og:title", content: "Bayi Girişi — Pratik Endüstriyel" },
      { property: "og:description", content: "Bayi ve kurumsal müşteri paneline giriş." },
      { property: "og:url", content: "/giris" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/giris" }],
  }),
  component: GirisPage,
});

function GirisPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Bayi ve Kurumsal Giriş"
        crumb="Giriş"
        description="Hesap sistemimiz yakında aktif olacak. Şu an için satış ekibimizle iletişime geçerek bayi hesabınızı oluşturabilirsiniz."
      />
    </SiteShell>
  );
}