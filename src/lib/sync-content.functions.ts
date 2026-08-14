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
      { route: "/teklif", name: "Teklif Talep Sayfası" },
      { route: "/iletisim", name: "İletişim Sayfası" },
      { route: "/kvkk", name: "Yasal Sayfalar" },
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

    // 1. TOP BAR
    const topBarId = getPageId("top_bar");
    if (topBarId) {
      const { data: section } = await supabase.from("page_sections").upsert({
        page_id: topBarId,
        section_key: "top_bar_content",
        internal_label: "Üst Bar İçeriği",
        display_order: 1,
        is_active: true,
        section_type: "header"
      }, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const fields = [
          { field_key: "working_hours", label: "Çalışma Saatleri", value: "Hafta içi 08:30 - 18:00 · Cumartesi 09:00 - 14:00" },
          { field_key: "address", label: "Adres", value: "Dudullu OSB, Ümraniye / İstanbul" },
          { field_key: "phone", label: "Telefon", value: "0553 306 92 10", link: "tel:05533069210" },
          { field_key: "whatsapp_label", label: "WhatsApp Etiketi", value: "WhatsApp" },
          { field_key: "whatsapp", label: "WhatsApp No", value: "05533069210", link: "https://wa.me/905533069210" },
          { field_key: "teklif_label", label: "Teklif Buton Etiketi", value: "Teklif Talep Et" },
          { field_key: "teklif_url", label: "Teklif Buton Linki", value: "/teklif" }
        ];
        for (const f of fields) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: f.field_key,
            field_type: "text",
            label: f.label,
            value_text: f.value,
            link_url: f.link || null
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    // 2. FOOTER
    const footerId = getPageId("footer");
    if (footerId) {
      const footerGroups = [
        { key: "footer_identity", label: "Footer Kimliği", fields: [
          { k: "summary", l: "Şirket Özeti", v: "Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim." },
          { k: "logo_alt", l: "Logo Alt Metni", v: "Pratik Tedarik Yapı" }
        ]},
        { key: "footer_bottom", label: "Footer Alt Bilgi", fields: [
          { k: "copyright", l: "Telif Hakkı", v: `© ${new Date().getFullYear()} Pratik Endüstriyel. Tüm hakları saklıdır.` },
          { k: "footer_bottom_text", l: "Alt Bilgi Sloganı", v: "Endüstriyel Donanım · Kurumsal Tedarik" },
          { k: "agency_attribution_visible", l: "Ajans İmzası Görünür", v: "true" },
          { k: "agency_attribution_text", l: "Ajans Metni", v: "Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır." },
          { k: "agency_attribution_url", l: "Ajans Linki", v: "https://www.bilgintek.com" }
        ]}
      ];
      for (const group of footerGroups) {
        const { data: sec } = await supabase.from("page_sections").upsert({
          page_id: footerId,
          section_key: group.key,
          internal_label: group.label,
          display_order: 1,
          is_active: true,
          section_type: "footer"
        }, { onConflict: "page_id,section_key" }).select().single();
        if (sec) {
          for (const f of group.fields) {
            await supabase.from("section_content").upsert({
              section_id: sec.id,
              field_key: f.k,
              field_type: "text",
              label: f.l,
              value_text: f.v
            }, { onConflict: "section_id,field_key" });
          }
        }
      }
    }

    // 3. HOME SECTIONS (Value Props)
    const homeId = getPageId("/");
    if (homeId) {
      const { data: section } = await supabase.from("page_sections").upsert({
        page_id: homeId,
        section_key: "value_props",
        internal_label: "Ana Sayfa - Kurumsal Yetkinlik",
        display_order: 3,
        is_active: true,
        section_type: "content"
      }, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const fields = [
          { k: "eyebrow", l: "Üst Başlık", v: "Kurumsal Yetkinlik" },
          { k: "title", l: "Ana Başlık", v: "Ürün tedariki değil, üretim güvenliği." },
          { k: "subtitle", l: "Açıklama", v: "Sanayi tesislerine, şantiyelere ve üretim hatlarına yönelik profesyonel donanım tedariki." },
          { k: "hakkimizda_title", l: "Hakkımızda Başlık", v: "Pratik Endüstriyel, sahayı bilen bir tedarik ortağıdır." },
          { k: "hakkimizda_desc", l: "Hakkımızda Metin", v: "Her projede aynı kişi, aynı süreç, aynı sorumluluk. Uzun soluklu tedarikçi ilişkileri kurmak için çalışıyoruz." }
        ];
        for (const f of fields) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: f.k,
            field_type: "text",
            label: f.l,
            value_text: f.v
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    // 4. SYSTEM MESSAGES
    const systemId = getPageId("sistem");
    if (systemId) {
      const { data: section } = await supabase.from("page_sections").upsert({
        page_id: systemId,
        section_key: "global_messages",
        internal_label: "Global Sistem Mesajları",
        display_order: 1,
        is_active: true,
        section_type: "system"
      }, { onConflict: "page_id,section_key" }).select().single();
      
      if (section) {
        const messages = [
          { k: "404_title", l: "404 Sayfa Bulunamadı Başlığı", v: "Sayfa bulunamadı" },
          { k: "404_desc", l: "404 Sayfa Bulunamadı Açıklaması", v: "Aradığınız sayfa mevcut değil veya taşınmış olabilir." },
          { k: "loading", l: "Yükleniyor Yazısı", v: "Yükleniyor..." },
          { k: "root_error_title", l: "Sistem Hatası Başlığı", v: "Bu sayfa yüklenemedi" },
          { k: "root_error_desc", l: "Sistem Hatası Açıklaması", v: "Beklenmedik bir sorun oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz." }
        ];
        for (const m of messages) {
          await supabase.from("section_content").upsert({
            section_id: section.id,
            field_key: m.k,
            field_type: "text",
            label: m.l,
            value_text: m.v
          }, { onConflict: "section_id,field_key" });
        }
      }
    }

    return { success: true };
  });
