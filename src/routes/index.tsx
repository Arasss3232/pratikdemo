import { createFileRoute, Link } from "@tanstack/react-router";
import { Icon, SiteShell } from "../components/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        name: "description",
        content:
          "Elektrikli el aletlerinden bağlantı elemanlarına, endüstriyel tesisleriniz ve şantiyeleriniz için profesyonel donanım tedariki, teknik destek ve toplu teklif hizmetleri.",
      },
      { property: "og:title", content: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        property: "og:description",
        content:
          "Bosch, Makita, DeWalt, Hilti ve daha fazlası. Türkiye genelinde endüstriyel tedarik, teknik danışmanlık ve toplu teklif.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      {
        rel: "preload",
        as: "image",
        href: HERO_IMG,
        fetchpriority: "high",
      },
    ],
  }),
  component: Home,
});

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UnrlnRzHzPhRckFPpOfhIBO0rU9xcHzsXXl0N9sbB-O65L2akdTyMEQbvnx_OnkBQnzHCN0hg1HjR3JyNp9ZdgBAiP1LebeBZsx6OwrzFSyoLggCIvbJxdOmqC9gJ2s7JN6IrwwVOmFtExsFrF70vF02uE-9hP_lN1GqQHYzDSlqETPiHGdiIEOu5niuU7dSXiiWvOe4E8He_ZiFXTPVPAjOiw-GyiQlISaJ5CnWmiCFj1Ogb3hC";

const CATEGORIES = [
  {
    icon: "hardware",
    title: "Elektrikli El Aletleri",
    desc: "Matkap, taşlama, vidalama ve kırıcı deliciler.",
    to: "/urunler/elektrikli-el-aletleri" as const,
  },
  {
    icon: "settings",
    title: "Bağlantı Elemanları",
    desc: "Cıvata, somun, pul ve özel bağlantı çözümleri.",
    to: "/urunler" as const,
  },
  {
    icon: "shield",
    title: "Kişisel Koruyucu Donanım",
    desc: "İş güvenliği ekipmanları ve KKD ürünleri.",
    to: "/urunler" as const,
  },
  {
    icon: "precision_manufacturing",
    title: "Endüstriyel Makineler",
    desc: "Kompresör, jeneratör ve atölye ekipmanları.",
    to: "/urunler" as const,
  },
  {
    icon: "build",
    title: "El Aletleri",
    desc: "Anahtar takımları, tornavidalar ve el aletleri.",
    to: "/urunler" as const,
  },
  {
    icon: "inventory_2",
    title: "Sarf Malzemeleri",
    desc: "Kesme, taşlama diskleri ve sarf ürünler.",
    to: "/urunler" as const,
  },
];

const FEATURES = [
  {
    icon: "local_shipping",
    title: "Hızlı Tedarik",
    desc: "Geniş stok, aynı gün sevkiyat ve Türkiye geneli lojistik ağı.",
  },
  {
    icon: "verified",
    title: "Orijinal Ürün Garantisi",
    desc: "Yalnızca yetkili distribütörlüğü onaylı, orijinal ürünler.",
  },
  {
    icon: "engineering",
    title: "Teknik Danışmanlık",
    desc: "Ürün seçiminden uygulamaya kadar mühendislik desteği.",
  },
  {
    icon: "request_quote",
    title: "Kurumsal Fiyatlandırma",
    desc: "Proje ölçeğine uygun toplu teklif ve özel iskonto koşulları.",
  },
];

function Home() {
  return (
    <SiteShell>
      <>
        {/* Hero */}
        <section className="relative bg-inverse-surface text-inverse-on-surface">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 z-0 bg-gradient-to-r from-inverse-surface via-inverse-surface/90 to-inverse-surface/60 md:to-inverse-surface/30"
            aria-hidden
          />
          <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-3 py-1 rounded font-label-bold text-label-bold mb-6 uppercase tracking-wider">
                <Icon name="factory" className="text-[16px]" aria-hidden="true" />
                Endüstriyel Tedarik
              </div>
              <h1 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-6 leading-tight">
                Sanayinin ve şantiyenin güvenilir donanım ortağı
              </h1>
              <p className="font-body-lg text-body-lg text-inverse-on-surface mb-8 max-w-2xl">
                Bosch, Makita, DeWalt, Hilti ve daha fazlası. Elektrikli el aletlerinden bağlantı
                elemanlarına kadar 20.000+ profesyonel ürün, tek tedarikçiden.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/urunler"
                  className="min-h-11 bg-secondary text-on-secondary px-8 py-3 rounded font-label-bold text-label-bold hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary transition-all inline-flex items-center justify-center gap-2"
                >
                  Ürünleri Keşfet
                  <Icon name="arrow_forward" aria-hidden="true" />
                </Link>
                <Link
                  to="/teklif"
                  className="min-h-11 bg-transparent border-2 border-inverse-on-surface/60 text-inverse-on-surface px-8 py-3 rounded font-label-bold text-label-bold hover:border-inverse-on-surface hover:bg-inverse-on-surface/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverse-on-surface transition-all inline-flex items-center justify-center gap-2"
                >
                  <Icon name="request_quote" aria-hidden="true" />
                  Toplu Teklif Al
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="font-label-bold text-label-bold text-secondary uppercase tracking-wider mb-2">
                Ürün Kategorileri
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">
                İhtiyacınız olan her şey tek çatı altında
              </h2>
            </div>
            <Link
              to="/urunler"
              className="text-primary font-label-bold text-label-bold hover:underline inline-flex items-center gap-1"
            >
              Tüm Kategoriler
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all flex flex-col gap-3"
              >
                <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center rounded">
                  <Icon name={c.icon} className="text-[24px]" aria-hidden="true" />
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-background group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{c.desc}</p>
                <div className="mt-auto pt-2 text-primary font-label-bold text-label-bold inline-flex items-center gap-1">
                  Ürünleri Görüntüle
                  <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-surface-container border-y border-outline-variant py-20">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-12">
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-3">
                Neden Pratik?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                25 yılı aşkın endüstriyel tedarik deneyimi, uzman kadromuz ve geniş ürün gamımızla
                sanayinin yanındayız.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-3"
                >
                  <Icon name={f.icon} className="text-[32px] text-secondary" />
                  <h3 className="font-headline-md text-headline-md font-bold text-on-background">
                    {f.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="bg-primary rounded p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-primary mb-2">
                Projeleriniz için özel çözümler mi arıyorsunuz?
              </h2>
              <p className="font-body-md text-body-md text-primary-fixed max-w-xl">
                Satın alma uzmanlarımız size en uygun ürün ve fiyatlandırma paketini hazırlasın.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <Link
                to="/teklif"
                className="bg-secondary text-on-secondary px-8 py-3 rounded font-label-bold text-label-bold hover:brightness-90 transition-all inline-flex items-center justify-center gap-2"
              >
                Teklif İste
                <Icon name="arrow_forward" />
              </Link>
              <Link
                to="/iletisim"
                className="bg-transparent border-2 border-on-primary/40 text-on-primary px-8 py-3 rounded font-label-bold text-label-bold hover:border-on-primary transition-all inline-flex items-center justify-center gap-2"
              >
                <Icon name="support_agent" />
                İletişime Geç
              </Link>
            </div>
          </div>
        </section>
      </>
    </SiteShell>
  );
}