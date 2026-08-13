// Domain data for the catalog. Keep behavior identical to prior inline data.

export const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UnrlnRzHzPhRckFPpOfhIBO0rU9xcHzsXXl0N9sbB-O65L2akdTyMEQbvnx_OnkBQnzHCN0hg1HjR3JyNp9ZdgBAiP1LebeBZsx6OwrzFSyoLggCIvbJxdOmqC9gJ2s7JN6IrwwVOmFtExsFrF70vF02uE-9hP_lN1GqQHYzDSlqETPiHGdiIEOu5niuU7dSXiiWvOe4E8He_ZiFXTPVPAjOiw-GyiQlISaJ5CnWmiCFj1Ogb3hC";

export const CTA_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDy3vgce_xV0Wc99tUzy5yr8XJoVWFmTYrf6WmmkeRDvZwl-57lg3UtndCd1REWIrJwCfok7RkF5xuYaXWJtJVqo84Px4YXk6V-tRoXOgAdad6xYDg1AUBOZ0axGLLd6FPham9_IR4pRmyyQWus1QN6N0cBkPl2HlUmPRGF2BfhAM_8nGqIlEvYph0hnoAei4O2EwvM38dLBep6wYmnRzM7NgaMMNfzo8aP1IefJcXuu_wa69Okr65l";

export const BRAND_LOGOS = {
  bosch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB48hZBnwMCOOpJvlbUCj5wjnJs6dO7Y9Pw3XJE_MA821WpGQn-Gl-URfcizORpziViMDVKPO11x5Gsp302bJDb6etXbQddbuZ7CquuzRVvqyZdZc9t3aK2q7nzsuQzK23dQgWcLarBlBD1Ts5wkVLxxB_Hyn2Pe-4dTwGgyevkRbxIfjJDmhs2xjBwP8wv7wbqk5o1GHs4anJvuXtQat4VGxyOHMxn0HQ6z3Xbr1mrJLs7rgGwWX06",
  makita:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDOUZ5uHrWiV8T3cSxWhQ38X88CHnKpnVg4h228_YVj_a13rDXfPiKt5FtzMVpyiyGBHjpLKw0SWuvyMeGucyXpuPXPiHwUoUf3x_AjpnA-MZxHGTrO-NGW8RMrzEiRNufh_qepsinjBkXAWeAcdg4yBsFqmd2J7yfqJHFDZlvPh1GQk58oP2c8Wqci1tNirt7nHBV59yU_FDpj93QyE6L0ZYJm7EzCneXDkRK-knpASMp2ml5EbdUh",
  dewalt:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvKl7wEq6A-lYsYC402aA7qmTLhNBDOptqvLeaTfpkGWqty2hWczg6rfrxqfWTwHhPrnBZy45fgk-BvmC4ZWbdA1pA1n-OTSgQo-dJWha1LDRebPdMzEyvV1tPRDWE7rY4NNS0mQGdRSALlSRQNudYeKcPBFPqb_5vfzrLtvRXFleQkQSUkLhHamt19HPk7-ncRph_9mWbPRlS_8kQhWA63841UtMuGXpLcli_8Ebmwnj23wxH7ykQ",
  hilti:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNQQK5pxZNkTlnJHusJ4y1vxZLyHosh6svd7NPHp1QF8G8VhPImsHLOzMTKO-fOzRr38HgwL07fhdBDjhcBfLkEZRKJzoqC9GnZIgwShFf2aT3ciMVkxRZn_Sem0cK8jXFMbCdIW_SCqfxY01rHBqb9zQxglH3WbodQDtN-48jSjb0Wqg_oHRvXQuKHz4-0SWy99cQN5j0rKoZb-qaPRTRTweskGOqFgm83zI9j2ZKTtWxGzEnot2f",
} as const;

export type BrandKey = keyof typeof BRAND_LOGOS;

export const FEATURED_LOGOS: readonly string[] = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfqVtA7-ovw1ulmpo7ZpXXvi6Qnq_tZNLclX1sk6H4Q4wql5Mv-p__4mxxs0TBopYHG_BbBrEG17dPdoWV2HSrjolXO_JPBKe90RGBNe97zI_2alUcSpoOmbBqWlahxJAkKpgUVh9mjkvhKE2IMJvHjA_NlCnxI5Dl-EzUXE2zCUdVCBarboRzdaU3k0PH57lHFNMCvEZqri5CqNy_tg-manFK-bhzBm4UzqeliDre9CdiR66-62sX",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDhRccwWve4CacL_1nW4PUOPc81p_GafX3lyaHSvqiwzDHx4xj_qi8QewtqN6bSObJ2eA5RwuHdxArrk1Rk7VVixpkxgBuzKJB8VvTu8MjkXC70VB60c3-w7Wt2E-U7VqGBJnuVuZLI5tvEe6b3o4ZwpLitlIsxczXJ6yOIWUFLyRjgCKV7s1Yt0x2_5B3ZlWjLF1eZVF2LQR5V8562cFLilwGFa0calD4oifczV5cGIyJc4lStVZLz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUGaHZHLrKeYNds7Wc_3dWpyS2-88PD-A4sY27LMN7k5zt2Twz3W3bCiW1SnN_QF6nVFvPNo9iwWjV0DUKF-pSeRJgbEoOh1vzDZ9AIC9K0dv-uWa3S08m9vLDbiJoEW0oDN07rn2sccnzRs2-qD1r4ke5npKZkqGhENIcxop-s2oNxNOG9FMOrT_mw_s1dqoiCK4GzhwP60QGB8SgJSzA4BZMRZdJrx0_yXs3FmtUMr_QAoqxhB9V",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCHskZpOpQd5qktSzI72GVRbykeijsGE2QPytaFtcmvjwwdYUnbhwY9FGYJDHMFnBDOKcFvaof0dfdDY_UkWwRIDytfk_gFWcr5F692Bz1TMYBg88V0zxyjK15WfajOk1jHBY0RUtRZyVjRyKiF-bisvyd7yMv_-YnGVmR-dKROXM0sjawK0upKRyIc7j0_pAdz8tOkA828prt8ELVYlZuwG8PoECDwQsfAnRfZmTX4M-p0wo0n2Zfj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDLBIqTZf4brgU-C02FIU-HF-_bZbVAevuQP39SlBtSxnbddX_sZEXkcxUSUmJKAPt8Bfp0VpiY1spzVNVXgE_otZcFhWGiKBV0BGUI-xG6o2bULpTosVhh-RoVnuEp5S_YGDosAanfB4LKXULrRQFvC3pXWBjMNvkiOWQvJ5ngYm6UBnK6b1SwMBML4xKK5vU1aDP0qo_hmMgHWJRUq6wkCtRu3jJJC9yGLOynrqDaeqVDP6hO_ZP",
];

export type Product = {
  brand: BrandKey;
  brandAlt: string;
  productAlt: string;
  productImg: string;
  sku: string;
  name: string;
  specs: { icon: string; label: string }[];
  stock: "in" | "limited";
};

export const PRODUCTS: readonly Product[] = [
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

// CategoryDefinition remains for historical type safety if needed in some components
export type CategoryDefinition = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
};


export const SUBCATEGORIES: readonly string[] = [
  "Matkaplar (124)",
  "Vidalama Makineleri (86)",
  "Taşlama Makineleri (52)",
  "Kırıcı Deliciler (41)",
  "Testereler (38)",
];

export const BRANDS: readonly string[] = [
  "Bosch Professional",
  "Makita",
  "DeWalt",
  "Hilti",
  "Milwaukee",
];

export const APPLICATIONS: readonly string[] = ["Ahşap", "Metal", "Beton", "Montaj"];

// Serve smaller product images on small viewports via Google usercontent's =w<N> resizer.
export function productSrcSet(url: string) {
  const base = url.split("=")[0];
  return `${base}=w400 400w, ${base}=w600 600w, ${base}=w800 800w`;
}