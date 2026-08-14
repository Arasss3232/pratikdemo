import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const syncPublicContent = createServerFn({ method: "POST" })
  .handler(async () => {
    console.log("Starting Full Content Synchronization...");

    const pages = [
      { route: "/", name: "Ana Sayfa" },
      { route: "/kurumsal", name: "Kurumsal Sayfası" },
      { route: "/urunler", name: "Ürün Kategorileri Sayfası" },
      { route: "/kataloglar", name: "Kataloglar Sayfası" },
      { route: "/bayiliklerimiz", name: "Bayiliklerimiz Sayfası" },
      { route: "/hakkimizda", name: "Hakkımızda Sayfası" },
      { route: "/teklif", name: "Teklif Talep Sayfası" },
      { route: "/iletisim", name: "İletişim Sayfası" },
      { route: "/kvkk", name: "KVKK ve Gizlilik" },
      { route: "/sektorel", name: "Sektörel Çözümler" },
      { route: "sistem", name: "Sistem Mesajları" },
      { route: "top_bar", name: "Üst Bilgi Çubuğu" },
      { route: "header_nav", name: "Header ve Navigasyon" },
      { route: "footer", name: "Footer" }
    ];

    for (const p of pages) {
      await supabase.from("site_pages").upsert({
        route: p.route,
        internal_name: p.name,
        status: "published"
      }, { onConflict: "route" });
    }

    const { data: dbPages } = await supabase.from("site_pages").select("id, route");
    const getPageId = (route: string) => dbPages?.find(p => p.route === route)?.id;

    const upsertSection = async (pageRoute: string, key: string, label: string, order: number, type: string = "content") => {
      const pageId = getPageId(pageRoute);
      if (!pageId) return null;
      const { data } = await supabase.from("page_sections").upsert({
        page_id: pageId,
        section_key: key,
        internal_label: label,
        display_order: order,
        is_active: true,
        section_type: type
      }, { onConflict: "page_id,section_key" }).select().single();
      return data;
    };

    const upsertFields = async (sectionId: string, fields: any[]) => {
      for (const f of fields) {
        await supabase.from("section_content").upsert({
          section_id: sectionId,
          field_key: f.k,
          field_type: f.t || "text",
          label: f.l,
          value_text: f.v,
          link_url: f.link || null,
          icon: f.icon || null
        }, { onConflict: "section_id,field_key" });
      }
    };

    // 1. TOP BAR
    const topBarSec = await upsertSection("top_bar", "top_bar_content", "Üst Bar İçeriği", 1, "header");
    if (topBarSec) {
      await upsertFields(topBarSec.id, [
        { k: "working_hours", l: "Çalışma Saatleri", v: "Hafta içi 08:30 - 18:00 · Cumartesi 09:00 - 14:00" },
        { k: "address", l: "Adres", v: "Dudullu OSB, Ümraniye / İstanbul" },
        { k: "phone", l: "Telefon", v: "0553 306 92 10", link: "tel:05533069210" },
        { k: "whatsapp_label", l: "WhatsApp Etiketi", v: "WhatsApp" },
        { k: "whatsapp", l: "WhatsApp No", v: "05533069210", link: "https://wa.me/905533069210" },
        { k: "teklif_label", l: "Teklif Buton Etiketi", v: "Teklif Talep Et" },
        { k: "teklif_url", l: "Teklif Buton Linki", v: "/teklif" }
      ]);
    }

    // 2. FOOTER
    const footerSecIdentity = await upsertSection("footer", "footer_identity", "Footer Kimliği", 1, "footer");
    if (footerSecIdentity) {
      await upsertFields(footerSecIdentity.id, [
        { k: "summary", l: "Şirket Özeti", v: "Sanayi, inşaat and teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim." },
        { k: "logo_alt", l: "Logo Alt Metni", v: "Pratik Tedarik Yapı" }
      ]);
    }

    const footerSecBottom = await upsertSection("footer", "footer_bottom", "Footer Alt Bilgi", 2, "footer");
    if (footerSecBottom) {
      await upsertFields(footerSecBottom.id, [
        { k: "copyright", l: "Telif Hakkı", v: `© ${new Date().getFullYear()} Pratik Endüstriyel. Tüm hakları saklıdır.` },
        { k: "footer_bottom_text", l: "Alt Bilgi Sloganı", v: "Endüstriyel Donanım · Kurumsal Tedarik" },
        { k: "agency_attribution_visible", l: "Ajans İmzası Görünür", v: "true" },
        { k: "agency_attribution_text", l: "Ajans Metni", v: "Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır." },
        { k: "agency_attribution_url", l: "Ajans Linki", v: "https://www.bilgintek.com" }
      ]);
    }

    // 3. HOME SECTIONS
    const homeHeroSec = await upsertSection("/", "hero", "Ana Sayfa - Hero", 1);
    if (homeHeroSec) {
      await upsertFields(homeHeroSec.id, [
        { k: "title", l: "Ana Başlık", v: "İşinize güç katan\nprofesyonel hırdavat çözümleri." },
        { k: "description", l: "Açıklama", v: "Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik." },
        { k: "primary_cta_text", l: "Birincil Buton Metni", v: "Ürün Gruplarını İncele" },
        { k: "primary_cta_url", l: "Birincil Buton Linki", v: "/urunler" },
        { k: "secondary_cta_text", l: "İkincil Buton Metni", v: "Teklif Talep Et" },
        { k: "secondary_cta_url", l: "İkincil Buton Linki", v: "/teklif" },
        { k: "hero_image", l: "Hero Görseli", v: "", t: "image" }
      ]);
    }

    const homeValuePropsSec = await upsertSection("/", "value_props", "Ana Sayfa - Kurumsal Yetkinlik", 2);
    if (homeValuePropsSec) {
      await upsertFields(homeValuePropsSec.id, [
        { k: "eyebrow", l: "Üst Başlık", v: "Kurumsal Yetkinlik" },
        { k: "title", l: "Ana Başlık", v: "Ürün tedariki değil, üretim güvenliği." },
        { k: "subtitle", l: "Açıklama", v: "Sanayi tesislerine, şantiyelere ve üretim hatlarına yönelik profesyonel donanım tedariki." },
        { k: "hakkimizda_title", l: "Hakkımızda Başlık", v: "Pratik Endüstriyel, sahayı bilen bir tedarik ortağıdır." },
        { k: "hakkimizda_desc", l: "Hakkımızda Metin", v: "Her projede aynı kişi, aynı süreç, aynı sorumluluk. Uzun soluklu tedarikçi ilişkileri kurmak için çalışıyoruz." }
      ]);
    }

    // 4. PAGES HEROES
    const routes = ["/kurumsal", "/urunler", "/kataloglar", "/bayiliklerimiz", "/hakkimizda", "/teklif", "/iletisim", "/kvkk", "/sektorel"];
    const titles: Record<string, string> = {
      "/kurumsal": "Kurumsal",
      "/urunler": "Ürün Kategorileri",
      "/kataloglar": "Dijital Kataloglar",
      "/bayiliklerimiz": "Bayiliklerimiz",
      "/hakkimizda": "Hakkımızda",
      "/teklif": "Teklif Talep Et",
      "/iletisim": "Bize Ulaşın",
      "/kvkk": "KVKK ve Gizlilik",
      "/sektorel": "Sektörel Çözümler"
    };

    for (const r of routes) {
      const heroSec = await upsertSection(r, "hero", "Sayfa Hero", 1);
      if (heroSec) {
        await upsertFields(heroSec.id, [
          { k: "title", l: "Sayfa Başlığı", v: titles[r] },
          { k: "description", l: "Sayfa Açıklaması", v: "" }
        ]);
      }
    }

    // 5. SYSTEM MESSAGES
    const systemSec = await upsertSection("sistem", "global_messages", "Global Sistem Mesajları", 1, "system");
    if (systemSec) {
      await upsertFields(systemSec.id, [
        { k: "404_title", l: "404 Sayfa Bulunamadı Başlığı", v: "Sayfa bulunamadı" },
        { k: "404_desc", l: "404 Sayfa Bulunamadı Açıklaması", v: "Aradığınız sayfa mevcut değil veya taşınmış olabilir." },
        { k: "loading", l: "Yükleniyor Yazısı", v: "Yükleniyor..." },
        { k: "root_error_title", l: "Sistem Hatası Başlığı", v: "Bu sayfa yüklenemedi" },
        { k: "root_error_desc", l: "Sistem Hatası Açıklaması", v: "Beklenmedik bir sorun oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz." }
      ]);
    }

    return { success: true };
  });