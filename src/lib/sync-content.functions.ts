import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

interface CMSField {
  k: string;
  l: string;
  v: string;
  t?: string;
  link?: string;
  icon?: string;
}

interface CMSSection {
  key: string;
  label: string;
  type?: string;
  fields: CMSField[];
}

interface CMSPage {
  route: string;
  name: string;
  sections: CMSSection[];
}

// CMS Manifest: Sitenin tüm statik bölümlerini tanımlayan ana yapı
export const CMS_MANIFEST: CMSPage[] = [
  { route: "/", name: "Ana Sayfa", sections: [
    { key: "hero", label: "Hero Bölümü", fields: [
      { k: "title", l: "Ana Başlık", v: "İşinize güç katan\nprofesyonel hırdavat çözümleri." },
      { k: "description", l: "Açıklama", v: "Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik." },
      { k: "primary_cta_text", l: "Birincil Buton Metni", v: "Ürün Gruplarını İncele" },
      { k: "primary_cta_url", l: "Birincil Buton Linki", v: "/urunler" },
      { k: "secondary_cta_text", l: "İkincil Buton Metni", v: "Teklif Talep Et" },
      { k: "secondary_cta_url", l: "İkincil Buton Linki", v: "/teklif" },
      { k: "hero_image", l: "Hero Görseli", v: "", t: "image" }
    ]},
    { key: "value_props", label: "Kurumsal Yetkinlik", fields: [
      { k: "eyebrow", l: "Üst Başlık", v: "Kurumsal Yetkinlik" },
      { k: "title", l: "Ana Başlık", v: "Ürün tedariki değil, üretim güvenliği." },
      { k: "subtitle", l: "Açıklama", v: "Sanayi tesislerine, şantiyelere ve üretim hatlarına yönelik profesyonel donanım tedariki." },
      { k: "hakkimizda_title", l: "Hakkımızda Başlık", v: "Pratik Endüstriyel, sahayı bilen bir tedarik ortağıdır." },
      { k: "hakkimizda_desc", l: "Hakkımızda Metin", v: "Her projede aynı kişi, aynı süreç, aynı sorumluluk. Uzun soluklu tedarikçi ilişkileri kurmak için çalışıyoruz." }
    ]}
  ]},
  { route: "/kurumsal", name: "Kurumsal Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Kurumsal" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/urunler", name: "Ürün Kategorileri", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Ürün Kategorileri" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/kataloglar", name: "Kataloglar Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Dijital Kataloglar" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/bayiliklerimiz", name: "Bayiliklerimiz Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Bayiliklerimiz" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/hakkimizda", name: "Hakkımızda Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Hakkımızda" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/teklif", name: "Teklif Talep Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Teklif Talep Et" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/iletisim", name: "İletişim Sayfası", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Bize Ulaşın" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/kvkk", name: "KVKK ve Gizlilik", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "KVKK ve Gizlilik" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/sektorel", name: "Sektörel Çözümler", sections: [
    { key: "hero", label: "Sayfa Hero", fields: [
      { k: "title", l: "Sayfa Başlığı", v: "Sektörel Çözümler" },
      { k: "description", l: "Sayfa Açıklaması", v: "" }
    ]}
  ]},
  { route: "/sistem", name: "Sistem Mesajları", sections: [
    { key: "global_messages", label: "Global Sistem Mesajları", type: "system", fields: [
      { k: "404_title", l: "404 Sayfa Bulunamadı Başlığı", v: "Sayfa bulunamadı" },
      { k: "404_desc", l: "404 Sayfa Bulunamadı Açıklaması", v: "Aradığınız sayfa mevcut değil veya taşınmış olabilir." },
      { k: "loading", l: "Yükleniyor Yazısı", v: "Yükleniyor..." },
      { k: "root_error_title", l: "Sistem Hatası Başlığı", v: "Bu sayfa yüklenemedi" },
      { k: "root_error_desc", l: "Sistem Hatası Açıklaması", v: "Beklenmedik bir sorun oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz." }
    ]}
  ]},
  { route: "top_bar", name: "Üst Bilgi Çubuğu", sections: [
    { key: "top_bar_content", label: "Üst Bar İçeriği", type: "header", fields: [
      { k: "working_hours", l: "Çalışma Saatleri", v: "Hafta içi 08:30 - 18:00 · Cumartesi 09:00 - 14:00", icon: "schedule" },
      { k: "address", l: "Adres", v: "Dudullu OSB, Ümraniye / İstanbul", icon: "location_on" },
      { k: "phone", l: "Telefon", v: "0553 306 92 10", link: "tel:05533069210", icon: "call" },
      { k: "whatsapp_label", l: "WhatsApp Etiketi", v: "WhatsApp" },
      { k: "whatsapp", l: "WhatsApp No", v: "05533069210", link: "https://wa.me/905533069210", icon: "chat" },
      { k: "teklif_label", l: "Teklif Buton Etiketi", v: "Teklif Talep Et" },
      { k: "teklif_url", l: "Teklif Buton Linki", v: "/teklif", icon: "arrow_forward" }
    ]}
  ]},
  { route: "header_nav", name: "Header ve Navigasyon", sections: [
    { key: "header_config", label: "Header Yapılandırması", type: "header", fields: [
      { k: "logo_alt", l: "Logo Alt Metni", v: "Pratik Tedarik Yapı" },
      { k: "teklif_button_label", l: "Ana Teklif Butonu", v: "Teklif Talep Et" },
      { k: "admin_login_visible", l: "Yönetici Girişi Görünür", v: "true" }
    ]}
  ]},
  { route: "footer", name: "Footer", sections: [
    { key: "footer_identity", label: "Footer Kimliği", type: "footer", fields: [
      { k: "summary", l: "Şirket Özeti", v: "Sanayi, inşaat and teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim." },
      { k: "logo_alt", l: "Logo Alt Metni", v: "Pratik Tedarik Yapı" }
    ]},
    { key: "footer_bottom", label: "Footer Alt Bilgi", type: "footer", fields: [
      { k: "copyright", l: "Telif Hakkı", v: `© ${new Date().getFullYear()} Pratik Endüstriyel. Tüm hakları saklıdır.` },
      { k: "footer_bottom_text", l: "Alt Bilgi Sloganı", v: "Endüstriyel Donanım · Kurumsal Tedarik" },
      { k: "agency_attribution_visible", l: "Ajans İmzası Görünür", v: "true" },
      { k: "agency_attribution_text", l: "Ajans Metni", v: "Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır." },
      { k: "agency_attribution_url", l: "Ajans Linki", v: "https://www.bilgintek.com" }
    ]}
  ]}
];

export const syncPublicContent = createServerFn({ method: "POST" })
  .handler(async () => {
    console.log("Starting Automatic Idempotent CMS Bootstrap...");
    
    // 1. Sayfaları Upsert Et
    for (const p of CMS_MANIFEST) {
      await supabase.from("site_pages").upsert({
        route: p.route,
        internal_name: p.name,
        status: "published"
      }, { onConflict: "route" });
    }

    const { data: dbPages } = await supabase.from("site_pages").select("id, route");

    for (const p of CMS_MANIFEST) {
      const pageId = dbPages?.find(dbP => dbP.route === p.route)?.id;
      if (!pageId) continue;

      for (let i = 0; i < p.sections.length; i++) {
        const s = p.sections[i];
        
        // 2. Section'ı Upsert Et
        const { data: section } = await supabase.from("page_sections").upsert({
          page_id: pageId,
          section_key: s.key,
          internal_label: s.label,
          display_order: i + 1,
          is_active: true,
          section_type: s.type || "content"
        } as any, { onConflict: "page_id,section_key" }).select().single();

        if (section) {
          // 3. Field'ları "Yalnızca Eksikse Ekle" mantığıyla işle
          for (const f of s.fields) {
            const { data: existingField } = await supabase
              .from("section_content")
              .select("id")
              .eq("section_id", section.id)
              .eq("field_key", f.k)
              .maybeSingle();

            if (!existingField) {
              await supabase.from("section_content").insert({
                section_id: section.id,
                field_key: f.k,
                field_type: f.t || "text",
                label: f.l,
                value_text: f.v,
                link_url: f.link || null,
                icon: f.icon || null
              } as any);
            }
          }
        }
      }
    }

    return { success: true };
  });