import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { Icon, SiteShell } from "../components/site-shell";

export const Route = createFileRoute("/urunler")({
  head: () => ({
    meta: [
      { title: "Ürünler — Pratik Endüstriyel Donanım" },
      {
        name: "description",
        content:
          "Elektrikli el aletleri, bağlantı elemanları, KKD, sarf malzemeleri ve daha fazlası. Tüm endüstriyel ürün kategorilerimizi keşfedin.",
      },
      { property: "og:title", content: "Ürünler — Pratik Endüstriyel Donanım" },
      {
        property: "og:description",
        content:
          "20.000+ profesyonel ürün, tek tedarikçiden. Tüm endüstriyel ürün kategorilerimizi keşfedin.",
      },
    ],
  }),
  component: UrunlerLayout,
});

const CATEGORIES = [
  {
    icon: "hardware",
    title: "Elektrikli El Aletleri",
    desc: "Matkap, taşlama, vidalama, kırıcı delici ve kesim makineleri.",
    count: 341,
    to: "/urunler/elektrikli-el-aletleri" as const,
  },
  {
    icon: "settings",
    title: "Bağlantı Elemanları",
    desc: "Cıvata, somun, pul ve özel bağlantı çözümleri.",
    count: 1240,
    to: "/urunler" as const,
  },
  {
    icon: "shield",
    title: "Kişisel Koruyucu Donanım",
    desc: "Baret, gözlük, eldiven, ayakkabı ve iş güvenliği ürünleri.",
    count: 512,
    to: "/urunler" as const,
  },
  {
    icon: "precision_manufacturing",
    title: "Endüstriyel Makineler",
    desc: "Kompresör, jeneratör ve atölye ekipmanları.",
    count: 178,
    to: "/urunler" as const,
  },
  {
    icon: "build",
    title: "El Aletleri",
    desc: "Anahtar takımları, tornavidalar, pense ve el aletleri.",
    count: 623,
    to: "/urunler" as const,
  },
  {
    icon: "inventory_2",
    title: "Sarf Malzemeleri",
    desc: "Kesme, taşlama diskleri, uçlar ve tüketim malzemeleri.",
    count: 1892,
    to: "/urunler" as const,
  },
];

function UrunlerLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/urunler" });
  if (!isIndex) return <Outlet />;
  return (
    <SiteShell>
      <>
        <div className="bg-inverse-surface text-inverse-on-surface pt-4 pb-16">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4">
            <nav
              aria-label="Breadcrumb"
              className="flex text-on-surface-variant text-label-bold font-label-bold mb-8"
            >
              <ol className="inline-flex items-center gap-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="hover:text-inverse-on-surface transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Icon name="chevron_right" className="text-[16px]" />
                </li>
                <li aria-current="page">
                  <span className="text-inverse-on-surface font-semibold">Ürünler</span>
                </li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-4">
                Tüm Ürün Kategorileri
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                20.000'i aşkın profesyonel endüstriyel ürünümüzü kategoriler halinde inceleyin.
                Aradığınız ürünü bulamıyorsanız satın alma ekibimiz size özel tedarik sağlar.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group bg-surface-container-lowest border border-outline-variant p-6 hover:border-primary transition-colors flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center rounded">
                    <Icon name={c.icon} className="text-[24px]" />
                  </div>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">
                    {c.count} ürün
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-background group-hover:text-primary transition-colors">
                  {c.title}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{c.desc}</p>
                <div className="mt-auto pt-2 text-primary font-label-bold text-label-bold inline-flex items-center gap-1">
                  Kategoriyi İncele
                  <Icon name="arrow_forward" className="text-[16px]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    </SiteShell>
  );
}