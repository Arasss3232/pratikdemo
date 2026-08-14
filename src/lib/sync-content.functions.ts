import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const syncPublicContent = createServerFn({ method: "POST" })
  .handler(async () => {
    console.log("Starting Content Synchronization...");

    // 1. Ensure Site Pages exist
    const pages = [
      { route: "/", name: "Ana Sayfa" },
      { route: "/kurumsal", name: "Kurumsal Sayfası" },
      { route: "/urunler", name: "Ürün Kategorileri Sayfası" },
      { route: "/kataloglar", name: "Kataloglar Sayfası" },
      { route: "/bayiliklerimiz", name: "Bayiliklerimiz Sayfası" },
      { route: "/teklif", name: "Teklif Talep Sayfası" },
      { route: "/iletisim", name: "İletişim Sayfası" },
      { route: "/kvkk", name: "Yasal Sayfalar" },
      { route: "/sistem", name: "Sistem Mesajları" },
      { route: "global_settings", name: "Genel İçerikler" },
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

    // Get page IDs
    const { data: dbPages } = await supabase.from("site_pages").select("id, route");
    const getPageId = (route: string) => dbPages?.find(p => p.route === route)?.id;

    // 2. Sync Top Bar
    const topBarId = getPageId("top_bar");
    if (topBarId) {
      const topBarSection = {
        page_id: topBarId,
        section_key: "top_bar_content",
        internal_label: "Üst Bar İçeriği",
        display_order: 1,
        is_active: true,
        section_type: "header"
      };
      
      const { data: section } = await supabase.from("page_sections").upsert(topBarSection, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const fields = [
          { field_key: "working_hours", field_type: "text", label: "Çalışma Saatleri", value_text: "Hafta içi 08:30 - 18:00 · Cumartesi 09:00 - 14:00" },
          { field_key: "address", field_type: "text", label: "Adres Özeti", value_text: "Dudullu OSB, Ümraniye / İstanbul" },
          { field_key: "phone", field_type: "text", label: "Telefon", value_text: "0553 306 92 10" },
          { field_key: "whatsapp_label", field_type: "text", label: "WhatsApp Etiketi", value_text: "WhatsApp" },
          { field_key: "cta_label", field_type: "text", label: "Buton Etiketi", value_text: "Teklif Talep Et" }
        ];
        
        for (const f of fields) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: f.field_key,
            field_type: f.field_type,
            label: f.label,
            value_text: f.value_text
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    // 3. Sync Footer
    const footerId = getPageId("footer");
    if (footerId) {
      const footerSection = {
        page_id: footerId,
        section_key: "footer_content",
        internal_label: "Footer İçeriği",
        display_order: 1,
        is_active: true,
        section_type: "footer"
      };
      
      const { data: section } = await supabase.from("page_sections").upsert(footerSection, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const fields = [
          { field_key: "summary", field_type: "text", label: "Şirket Özeti", value_text: "Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim." },
          { field_key: "address", field_type: "text", label: "Adres", value_text: "Dudullu OSB, Ümraniye / İstanbul" },
          { field_key: "phone", field_type: "text", label: "Telefon", value_text: "0553 306 92 10" },
          { field_key: "email", field_type: "text", label: "E-posta", value_text: "bilgi@pratiktedarik.com" },
          { field_key: "hours", field_type: "text", label: "Çalışma Günleri", value_text: "Pzt – Cmt · 08:30 – 18:00" },
          { field_key: "copyright", field_type: "text", label: "Telif Hakkı", value_text: "© 2026 Pratik Endüstriyel. Tüm hakları saklıdır." },
          { field_key: "attribution_text", field_type: "text", label: "Ajans Metni", value_text: "Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır." },
          { field_key: "attribution_url", field_type: "text", label: "Ajans Linki", value_text: "https://www.bilgintek.com" }
        ];
        
        for (const f of fields) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: f.field_key,
            field_type: f.field_type,
            label: f.label,
            value_text: f.value_text
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    // 4. Sync Homepage Hero
    const homeId = getPageId("/");
    if (homeId) {
      const heroSection = {
        page_id: homeId,
        section_key: "hero",
        internal_label: "Ana Sayfa Hero",
        display_order: 1,
        is_active: true,
        section_type: "hero"
      };
      
      const { data: section } = await supabase.from("page_sections").upsert(heroSection, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const fields = [
          { field_key: "eyebrow", field_type: "text", label: "Üst Başlık", value_text: "Bosch · Makita · DeWalt · Hilti yetkili tedariki" },
          { field_key: "title", field_type: "text", label: "Ana Başlık", value_text: "Endüstriyel Donanımda Güvenilir Tedarik" },
          { field_key: "description", field_type: "text", label: "Açıklama", value_text: "Tesis, şantiye ve üretim hatlarınız için elektrikli el aletlerinden bağlantı elemanlarına uçtan uca profesyonel donanım çözümleri." },
          { field_key: "primary_cta_text", field_type: "text", label: "Birincil Buton", value_text: "Ürün Gruplarını İncele" },
          { field_key: "secondary_cta_text", field_type: "text", label: "İkincil Buton", value_text: "Teklif Talep Et" }
        ];
        
        for (const f of fields) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: f.field_key,
            field_type: f.field_type,
            label: f.label,
            value_text: f.value_text
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    // 5. Sync Navigation Items
    const navItems = [
      { label: "Ana Sayfa", route: "/", display_order: 1, menu_type: "header" },
      { label: "Kurumsal", route: "/kurumsal", display_order: 2, menu_type: "header" },
      { label: "Ürünler", route: "/urunler", display_order: 3, menu_type: "header" },
      { label: "Kataloglarımız", route: "/kataloglar", display_order: 4, menu_type: "header" },
      { label: "Bayiliklerimiz", route: "/bayiliklerimiz", display_order: 5, menu_type: "header" },
      { label: "İletişim", route: "/iletisim", display_order: 6, menu_type: "header" }
    ];

    for (const item of navItems) {
      await supabase.from("navigation_items").upsert({
        ...item,
        is_active: true,
        desktop_visibility: true,
        mobile_visibility: true,
        is_external: false
      }, { onConflict: "route,label" });
    }

    return { success: true };
  });



