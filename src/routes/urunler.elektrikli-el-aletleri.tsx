import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Icon, SiteShell } from "../components/site-shell";

export const Route = createFileRoute("/urunler/elektrikli-el-aletleri")({
  component: Index,
});

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UnrlnRzHzPhRckFPpOfhIBO0rU9xcHzsXXl0N9sbB-O65L2akdTyMEQbvnx_OnkBQnzHCN0hg1HjR3JyNp9ZdgBAiP1LebeBZsx6OwrzFSyoLggCIvbJxdOmqC9gJ2s7JN6IrwwVOmFtExsFrF70vF02uE-9hP_lN1GqQHYzDSlqETPiHGdiIEOu5niuU7dSXiiWvOe4E8He_ZiFXTPVPAjOiw-GyiQlISaJ5CnWmiCFj1Ogb3hC";
const CTA_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDy3vgce_xV0Wc99tUzy5yr8XJoVWFmTYrf6WmmkeRDvZwl-57lg3UtndCd1REWIrJwCfok7RkF5xuYaXWJtJVqo84Px4YXk6V-tRoXOgAdad6xYDg1AUBOZ0axGLLd6FPham9_IR4pRmyyQWus1QN6N0cBkPl2HlUmPRGF2BfhAM_8nGqIlEvYph0hnoAei4O2EwvM38dLBep6wYmnRzM7NgaMMNfzo8aP1IefJcXuu_wa69Okr65l";

const BRAND_LOGOS = {
  bosch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB48hZBnwMCOOpJvlbUCj5wjnJs6dO7Y9Pw3XJE_MA821WpGQn-Gl-URfcizORpziViMDVKPO11x5Gsp302bJDb6etXbQddbuZ7CquuzRVvqyZdZc9t3aK2q7nzsuQzK23dQgWcLarBlBD1Ts5wkVLxxB_Hyn2Pe-4dTwGgyevkRbxIfjJDmhs2xjBwP8wv7wbqk5o1GHs4anJvuXtQat4VGxyOHMxn0HQ6z3Xbr1mrJLs7rgGwWX06",
  makita:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDOUZ5uHrWiV8T3cSxWhQ38X88CHnKpnVg4h228_YVj_a13rDXfPiKt5FtzMVpyiyGBHjpLKw0SWuvyMeGucyXpuPXPiHwUoUf3x_AjpnA-MZxHGTrO-NGW8RMrzEiRNufh_qepsinjBkXAWeAcdg4yBsFqmd2J7yfqJHFDZlvPh1GQk58oP2c8Wqci1tNirt7nHBV59yU_FDpj93QyE6L0ZYJm7EzCneXDkRK-knpASMp2ml5EbdUh",
  dewalt:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvKl7wEq6A-lYsYC402aA7qmTLhNBDOptqvLeaTfpkGWqty2hWczg6rfrxqfWTwHhPrnBZy45fgk-BvmC4ZWbdA1pA1n-OTSgQo-dJWha1LDRebPdMzEyvV1tPRDWE7rY4NNS0mQGdRSALlSRQNudYeKcPBFPqb_5vfzrLtvRXFleQkQSUkLhHamt19HPk7-ncRph_9mWbPRlS_8kQhWA63841UtMuGXpLcli_8Ebmwnj23wxH7ykQ",
  hilti:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNQQK5pxZNkTlnJHusJ4y1vxZLyHosh6svd7NPHp1QF8G8VhPImsHLOzMTKO-fOzRr38HgwL07fhdBDjhcBfLkEZRKJzoqC9GnZIgwShFf2aT3ciMVkxRZn_Sem0cK8jXFMbCdIW_SCqfxY01rHBqb9zQxglH3WbodQDtN-48jSjb0Wqg_oHRvXQuKHz4-0SWy99cQN5j0rKoZb-qaPRTRTweskGOqFgm83zI9j2ZKTtWxGzEnot2f",
};

const FEATURED_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfqVtA7-ovw1ulmpo7ZpXXvi6Qnq_tZNLclX1sk6H4Q4wql5Mv-p__4mxxs0TBopYHG_BbBrEG17dPdoWV2HSrjolXO_JPBKe90RGBNe97zI_2alUcSpoOmbBqWlahxJAkKpgUVh9mjkvhKE2IMJvHjA_NlCnxI5Dl-EzUXE2zCUdVCBarboRzdaU3k0PH57lHFNMCvEZqri5CqNy_tg-manFK-bhzBm4UzqeliDre9CdiR66-62sX",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDhRccwWve4CacL_1nW4PUOPc81p_GafX3lyaHSvqiwzDHx4xj_qi8QewtqN6bSObJ2eA5RwuHdxArrk1Rk7VVixpkxgBuzKJB8VvTu8MjkXC70VB60c3-w7Wt2E-U7VqGBJnuVuZLI5tvEe6b3o4ZwpLitlIsxczXJ6yOIWUFLyRjgCKV7s1Yt0x2_5B3ZlWjLF1eZVF2LQR5V8562cFLilwGFa0calD4oifczV5cGIyJc4lStVZLz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUGaHZHLrKeYNds7Wc_3dWpyS2-88PD-A4sY27LMN7k5zt2Twz3W3bCiW1SnN_QF6nVFvPNo9iwWjV0DUKF-pSeRJgbEoOh1vzDZ9AIC9K0dv-uWa3S08m9vLDbiJoEW0oDN07rn2sccnzRs2-qD1r4ke5npKZkqGhENIcxop-s2oNxNOG9FMOrT_mw_s1dqoiCK4GzhwP60QGB8SgJSzA4BZMRZdJrx0_yXs3FmtUMr_QAoqxhB9V",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCHskZpOpQd5qktSzI72GVRbykeijsGE2QPytaFtcmvjwwdYUnbhwY9FGYJDHMFnBDOKcFvaof0dfdDY_UkWwRIDytfk_gFWcr5F692Bz1TMYBg88V0zxyjK15WfajOk1jHBY0RUtRZyVjRyKiF-bisvyd7yMv_-YnGVmR-dKROXM0sjawK0upKRyIc7j0_pAdz8tOkA828prt8ELVYlZuwG8PoECDwQsfAnRfZmTX4M-p0wo0n2Zfj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDLBIqTZf4brgU-C02FIU-HF-_bZbVAevuQP39SlBtSxnbddX_sZEXkcxUSUmJKAPt8Bfp0VpiY1spzVNVXgE_otZcFhWGiKBV0BGUI-xG6o2bULpTosVhh-RoVnuEp5S_YGDosAanfB4LKXULrRQFvC3pXWBjMNvkiOWQvJ5ngYm6UBnK6b1SwMBML4xKK5vU1aDP0qo_hmMgHWJRUq6wkCtRu3jJJC9yGLOynrqDaeqVDP6hO_ZP",
];

type Product = {
  brand: keyof typeof BRAND_LOGOS;
  brandAlt: string;
  productAlt: string;
  productImg: string;
  sku: string;
  name: string;
  specs: { icon: string; label: string }[];
  stock: "in" | "limited";
};

const PRODUCTS: Product[] = [
  {
    brand: "bosch",
    brandAlt: "Bosch Professional logo",
    productAlt: "Bosch impact drill on white background",
    productImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkYboXopVvcxWg-DRjx8QKXsPsV-SvF39Nx2M64xck0BTyy9IP2pQfMIWu7o6ZB7dWFnVewW31xrHHu5x5dcbPDMh65Bf84inqdw-kSZW7lOwwKW6oGZXQvuPA1Kq1jDQxUAmgoqUCbxb8g38N9WUfjru8h-kV-7FyiiKzHgb0jDpuPp-9fNTY5jYWrH619cD7-urKnAMcV930fhjZJfgWus1kNCvVmhqiTiPilZ-UG8ov2xTu2jZw",
    sku: "GSB-19-2-RE",
    name: "Profesyonel Darbeli Matkap 850 W",
    specs: [
      { icon: "bolt", label: "850W Giriş Gücü" },
      { icon: "settings", label: "13mm Anahtarsız Mandren" },
      { icon: "speed", label: "0-3000 Dev/Dk" },
    ],
    stock: "in",
  },
  {
    brand: "makita",
    brandAlt: "Makita logo",
    productAlt: "Makita angle grinder on white background",
    productImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBti4Pxdk6B69kIvPkismUvX6dx-xzVvak6TSX65FHk-GNuPO4TJHVbwNrYWR-NXmtUeud5XgnakvBUB0ii332Qtg7ZpcsJ23_gTpbIGP4Dj619s-Lh0GHldCZejAQJDF26yrWoFR78qng8_ALnjha95NpUdfTfMDocC1_vDWB62XCSbbq9owTRY6LVVPgchuYbs8sExiwilQWvKYIdi83Q8KXSrjDlCAmv_gVPGVbmSPyhNYEHmLhA",
    sku: "GA4530R",
    name: "Avuç Taşlama Makinesi 720 W",
    specs: [
      { icon: "bolt", label: "720W Giriş Gücü" },
      { icon: "radio_button_unchecked", label: "115mm Disk Çapı" },
      { icon: "weight", label: "1.8 Kg Ağırlık" },
    ],
    stock: "in",
  },
  {
    brand: "dewalt",
    brandAlt: "DeWalt logo",
    productAlt: "DeWalt cordless drill on white background",
    productImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhFsllL644XLmza-TDLVYpOHyseSnEC56lX-226Q31zEpMLGbVJliC5AbkxmnWTEa_yLGOAFi5Gbi8qw9TX52ICpEAATCacMPJBIDjvgUqf7dAZeb3ejNN0yqAhVPMwvfkXwZdxkIl7yE3Q7ZdjPtOMHh_Y55-H8u3ayZIwMkGlq9HHF4Msbs8fCU_U_pGQ8zN2tR2-96cIIPKioG76aeDXnx1VZvh4hz0Nno0FCoN24RUcMXarvHo",
    sku: "DCD791D2",
    name: "Akülü Kömürsüz Vidalama 18V",
    specs: [
      { icon: "battery_charging_full", label: "18V / 2.0Ah Çift Akü" },
      { icon: "autorenew", label: "Kömürsüz Motor" },
      { icon: "compress", label: "70Nm Tork Gücü" },
    ],
    stock: "limited",
  },
  {
    brand: "hilti",
    brandAlt: "Hilti logo",
    productAlt: "Hilti rotary hammer drill on white background",
    productImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyNDvkJsniuVQiILotJZMpgwcgilgIUPZxWXKGKg4DQORikndCv__n0OJJvqnGGObdUZA2NZC28OonjFRmyK7qPo4_os1qODz1zeP681IpkLLl1PAWSecuq3egHHCg27NutHXCr84NxsJ3NhFiuwgcJciGanw_5xpT_DleGW_4ac5ycf9Q1Z0tJbu_4IjNRYoA9uZ47gy8CCL7kB83hsUt0v-wc7Z6PEY2F6dSJpTk324zvsWh8Fw4",
    sku: "TE-3-M",
    name: "Çok Yönlü Kırıcı Delici 850W",
    specs: [
      { icon: "bolt", label: "850W Giriş Gücü" },
      { icon: "offline_bolt", label: "2.5 J Darbe Enerjisi" },
      { icon: "construction", label: "SDS Plus Uç Girişi" },
    ],
    stock: "in",
  },
];

const SUBCATEGORIES = [
  "Matkaplar (124)",
  "Vidalama Makineleri (86)",
  "Taşlama Makineleri (52)",
  "Kırıcı Deliciler (41)",
  "Testereler (38)",
];

const BRANDS = ["Bosch Professional", "Makita", "DeWalt", "Hilti", "Milwaukee"];
const APPLICATIONS = ["Ahşap", "Metal", "Beton", "Montaj"];

function Index() {
  return (
    <SiteShell>
      <>
        {/* Breadcrumb & Header Banner */}
        <div className="relative bg-inverse-surface text-inverse-on-surface pt-4 pb-20">
          <div
            className="absolute inset-0 z-0 opacity-40 mix-blend-overlay bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_BG})` }}
            aria-hidden
          />
          <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4">
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
                <li>
                  <Link to="/" className="hover:text-inverse-on-surface transition-colors">
                    Ürünler
                  </Link>
                </li>
                <li>
                  <Icon name="chevron_right" className="text-[16px]" />
                </li>
                <li aria-current="page">
                  <span className="text-inverse-on-surface font-semibold">
                    Elektrikli El Aletleri
                  </span>
                </li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-4">
                Elektrikli El Aletleri
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Zorlu endüstriyel koşullara dayanıklı, yüksek performanslı ve uzun ömürlü
                profesyonel elektrikli el aletleri. Matkaplardan taşlama makinelerine kadar
                geniş ürün yelpazesiyle projelerinize güç katın.
              </p>
            </div>
          </div>
        </div>

        {/* Main Layout (Sidebar + Grid) */}
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="flex flex-col lg:flex-row gap-gutter">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-surface-container-lowest border border-outline-variant p-4 lg:sticky lg:top-[140px]">
                <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
                  <h2 className="font-headline-md text-headline-md font-semibold text-on-background">
                    Filtreler
                  </h2>
                  <button className="text-primary text-label-bold font-label-bold hover:underline">
                    Temizle
                  </button>
                </div>

                <div className="mb-8 border-b border-outline-variant pb-4">
                  <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
                    Alt Kategoriler
                  </h3>
                  <ul className="space-y-2">
                    {SUBCATEGORIES.map((label) => (
                      <li key={label}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            className="h-4 w-4 text-primary border-outline rounded focus:ring-primary focus:ring-offset-0 bg-surface"
                            type="checkbox"
                          />
                          <span className="text-body-sm font-body-sm text-on-background group-hover:text-primary transition-colors">
                            {label}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8 border-b border-outline-variant pb-4">
                  <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
                    Markalar
                  </h3>
                  <div className="relative mb-3">
                    <Icon
                      name="search"
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
                    />
                    <input
                      className="w-full pl-8 pr-2 py-1.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm font-body-sm h-8"
                      placeholder="Marka ara..."
                      type="text"
                    />
                  </div>
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {BRANDS.map((b) => (
                      <li key={b}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            className="h-4 w-4 text-primary border-outline rounded focus:ring-primary focus:ring-offset-0 bg-surface"
                            type="checkbox"
                          />
                          <span className="text-body-sm font-body-sm text-on-background group-hover:text-primary transition-colors">
                            {b}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
                    Uygulama Alanı
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {APPLICATIONS.map((a) => {
                      const active = a === "Metal";
                      return (
                        <button
                          key={a}
                          className={
                            active
                              ? "px-3 py-1 border border-primary bg-primary-container text-on-primary-container rounded text-body-sm font-body-sm transition-colors"
                              : "px-3 py-1 border border-outline-variant rounded text-body-sm font-body-sm hover:border-primary hover:text-primary transition-colors bg-surface"
                          }
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Content Area */}
            <div className="flex-grow flex flex-col">
              {/* Toolbar */}
              <div className="bg-surface-container-lowest border border-outline-variant p-2 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-body-sm font-body-sm text-on-surface-variant">
                  <span className="font-semibold text-on-background">341</span> ürün
                  listeleniyor
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label
                      className="text-label-bold font-label-bold text-on-surface-variant whitespace-nowrap"
                      htmlFor="sort"
                    >
                      Sırala:
                    </label>
                    <select
                      id="sort"
                      className="bg-surface border border-outline-variant rounded text-body-sm font-body-sm py-1.5 pl-3 pr-8 focus:border-primary focus:ring-0 outline-none w-full sm:w-auto"
                      defaultValue="Önerilen"
                    >
                      <option>Önerilen</option>
                      <option>A - Z (Ürün Adı)</option>
                      <option>Z - A (Ürün Adı)</option>
                      <option>Ürün Kodu</option>
                    </select>
                  </div>
                  <div className="hidden sm:flex items-center bg-surface border border-outline-variant rounded overflow-hidden">
                    <button
                      className="p-1.5 bg-surface-container text-on-background hover:bg-surface-variant transition-colors"
                      title="Grid Görünümü"
                    >
                      <Icon name="grid_view" className="text-[20px] fill" />
                    </button>
                    <button
                      className="p-1.5 bg-surface text-on-surface-variant hover:bg-surface-variant transition-colors"
                      title="Liste Görünümü"
                    >
                      <Icon name="view_list" className="text-[20px]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-outline-variant rounded text-label-bold font-label-bold text-on-background">
                  Uygulama: Metal
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <Icon name="close" className="text-[14px]" />
                  </button>
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCTS.map((p) => (
                  <article
                    key={p.sku}
                    className="group bg-surface-container-lowest border border-outline-variant rounded hover:border-primary transition-colors duration-300 flex flex-col relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded z-10 tracking-wider ${
                        p.stock === "in"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-secondary text-on-secondary"
                      }`}
                    >
                      {p.stock === "in" ? "Stokta" : "Sınırlı Stok"}
                    </div>
                    <div className="absolute top-2 left-2 bg-surface-container p-1 rounded z-10 border border-outline-variant">
                      <img
                        alt={p.brandAlt}
                        className="h-4 object-contain"
                        src={BRAND_LOGOS[p.brand]}
                      />
                    </div>
                    <div className="h-48 bg-surface-container-low flex items-center justify-center p-4 relative">
                      <img
                        alt={p.productAlt}
                        className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        src={p.productImg}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow border-t border-outline-variant">
                      <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                        SKU: {p.sku}
                      </div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2 leading-tight group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <ul className="text-body-sm font-body-sm text-on-surface-variant mb-4 space-y-1">
                        {p.specs.map((s) => (
                          <li key={s.label} className="flex items-center gap-2">
                            <Icon name={s.icon} className="text-[14px] text-outline" />
                            {s.label}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-2 border-t border-outline-variant flex flex-col gap-2">
                        <button className="w-full bg-transparent border-2 border-primary text-primary py-2 rounded font-label-bold text-label-bold hover:bg-surface-variant transition-colors flex justify-center items-center gap-1">
                          <Icon name="visibility" className="text-[16px]" />
                          Detayları İncele
                        </button>
                        <button className="w-full bg-secondary text-on-secondary py-2 rounded font-label-bold text-label-bold hover:brightness-90 transition-all flex justify-center items-center gap-1">
                          <Icon name="request_quote" className="text-[16px]" />
                          Teklif Al
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 border-t border-outline-variant pt-4 flex justify-center">
                <nav aria-label="Pagination" className="flex items-center gap-1">
                  <button
                    className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors disabled:opacity-50"
                    disabled
                  >
                    <Icon name="chevron_left" className="text-[20px]" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary rounded font-label-bold text-label-bold">
                    1
                  </button>
                  {[2, 3].map((n) => (
                    <button
                      key={n}
                      className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-variant rounded font-label-bold text-label-bold transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                  <span className="px-2 text-on-surface-variant">...</span>
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-variant rounded font-label-bold text-label-bold transition-colors">
                    12
                  </button>
                  <button className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors">
                    <Icon name="chevron_right" className="text-[20px]" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Brands */}
        <section className="bg-surface-container py-20 border-y border-outline-variant">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <h3 className="font-headline-lg text-headline-lg font-bold text-center text-on-background mb-8">
              Kategoride Öne Çıkan Markalar
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              {FEATURED_LOGOS.map((src, i) => (
                <img
                  key={src}
                  alt="Featured brand logo"
                  className={`h-8 md:h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 ${
                    i === 4 ? "hidden lg:block" : ""
                  }`}
                  src={src}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="bg-primary rounded overflow-hidden flex flex-col md:flex-row relative">
            <div
              className="absolute inset-0 z-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), repeating-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)",
                backgroundPosition: "0 0, 10px 10px",
                backgroundSize: "20px 20px",
              }}
              aria-hidden
            />
            <div className="p-8 md:p-20 flex-1 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-on-primary/20 text-on-primary w-max px-3 py-1 rounded font-label-bold text-label-bold mb-4 uppercase tracking-wider">
                <Icon name="business_center" className="text-[16px]" /> Kurumsal Çözümler
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-primary mb-2 leading-tight">
                Özel projeniz için toplu teklif mi istiyorsunuz?
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed mb-8 max-w-xl">
                Satın alma uzmanlarımız, proje ölçeğinize uygun özel fiyatlandırma ve teknik
                şartname desteği sağlamak için hazırdır.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/teklif"
                  className="bg-secondary text-on-secondary px-8 py-3 rounded font-label-bold text-label-bold hover:brightness-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Toplu Teklif Formu
                  <Icon name="arrow_forward" />
                </Link>
                <a
                  href="tel:+905550000000"
                  className="bg-transparent border-2 border-on-primary/30 text-on-primary px-8 py-3 rounded font-label-bold text-label-bold hover:border-on-primary transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="support_agent" />
                  Bizi Arayın
                </a>
              </div>
            </div>
            <div className="hidden md:block w-1/3 relative z-10 bg-surface-variant border-l border-outline-variant/30">
              <img
                alt="Procurement officer reviewing tablet in warehouse"
                className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                src={CTA_IMG}
              />
            </div>
          </div>
        </section>
      </>
    </SiteShell>
  );
}