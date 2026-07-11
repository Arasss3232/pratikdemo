import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/teklif-sepeti")({
  head: () => ({
    meta: [
      { title: "Teklif Sepeti — Pratik Endüstriyel" },
      { name: "description", content: "Seçtiğiniz ürünler için toplu teklif talebi oluşturun. Sepetinizdeki ürünler tek formla satın alma ekibimize iletilir." },
      { property: "og:title", content: "Teklif Sepeti — Pratik Endüstriyel" },
      { property: "og:description", content: "Seçtiğiniz ürünler için tek adımda toplu teklif talebi." },
      { property: "og:url", content: "/teklif-sepeti" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/teklif-sepeti" }],
  }),
  component: TeklifSepetiPage,
});

function TeklifSepetiPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Teklif Sepetiniz"
        crumb="Teklif Sepeti"
        description="Sepetiniz şu an boş. Ürün sayfalarındaki 'Teklif Al' butonuyla ürün ekleyerek toplu teklif oluşturabilirsiniz."
      />
    </SiteShell>
  );
}