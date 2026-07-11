// Shared registry of AI-editable actions. This file is safe to import
// on the client (constants only). Server enforcement lives in
// ai-assistant.functions.ts.

export type ActionType =
  | "update_product_content"
  | "update_service_content"
  | "update_blog_content"
  | "update_brochure_content"
  | "update_faq_content";

export type RegistryEntry = {
  label: string;               // Turkish label
  table: string;               // Supabase table
  labelField: string;          // Column used to display record in UI
  allowedFields: string[];     // Whitelist of fields the AI may propose
  fieldLabels: Record<string, string>;
  risk: "low" | "medium";
  maxLen: Record<string, number>;
};

export const ACTION_REGISTRY: Record<ActionType, RegistryEntry> = {
  update_product_content: {
    label: "Ürün İçeriği Güncelle",
    table: "products",
    labelField: "name",
    allowedFields: ["name", "description"],
    fieldLabels: { name: "Ürün adı", description: "Açıklama" },
    risk: "low",
    maxLen: { name: 180, description: 4000 },
  },
  update_service_content: {
    label: "Hizmet İçeriği Güncelle",
    table: "services",
    labelField: "title",
    allowedFields: ["title", "excerpt", "body", "seo_title", "seo_description"],
    fieldLabels: {
      title: "Başlık",
      excerpt: "Kısa açıklama",
      body: "İçerik",
      seo_title: "SEO Başlığı",
      seo_description: "SEO Açıklaması",
    },
    risk: "low",
    maxLen: { title: 160, excerpt: 400, body: 8000, seo_title: 70, seo_description: 180 },
  },
  update_blog_content: {
    label: "Blog Yazısını Güncelle",
    table: "blog_posts",
    labelField: "title",
    allowedFields: ["title", "excerpt", "body", "seo_title", "seo_description"],
    fieldLabels: {
      title: "Başlık",
      excerpt: "Özet",
      body: "İçerik",
      seo_title: "SEO Başlığı",
      seo_description: "SEO Açıklaması",
    },
    risk: "low",
    maxLen: { title: 180, excerpt: 400, body: 16000, seo_title: 70, seo_description: 180 },
  },
  update_brochure_content: {
    label: "Broşür İçeriği Güncelle",
    table: "homepage_brochures",
    labelField: "title",
    allowedFields: [
      "title", "eyebrow", "subtitle", "description",
      "primary_cta_label", "secondary_cta_label", "image_alt",
    ],
    fieldLabels: {
      title: "Başlık",
      eyebrow: "Üst etiket",
      subtitle: "Alt başlık",
      description: "Açıklama",
      primary_cta_label: "Birincil buton",
      secondary_cta_label: "İkincil buton",
      image_alt: "Görsel alt metni",
    },
    risk: "low",
    maxLen: {
      title: 140, eyebrow: 60, subtitle: 200, description: 400,
      primary_cta_label: 40, secondary_cta_label: 40, image_alt: 180,
    },
  },
  update_faq_content: {
    label: "SSS İçeriği Güncelle",
    table: "faqs",
    labelField: "question",
    allowedFields: ["question", "answer"],
    fieldLabels: { question: "Soru", answer: "Cevap" },
    risk: "low",
    maxLen: { question: 300, answer: 2000 },
  },
};

export const CONTEXT_MODULES: { key: ActionType; label: string; hint: string }[] = [
  { key: "update_brochure_content", label: "Broşür / Slider", hint: "Anasayfa slider slaytları" },
  { key: "update_product_content", label: "Ürünler", hint: "Katalog ürünleri" },
  { key: "update_service_content", label: "Hizmetler", hint: "Hizmet sayfaları" },
  { key: "update_blog_content", label: "Blog", hint: "Blog yazıları" },
  { key: "update_faq_content", label: "SSS", hint: "Sıkça sorulan sorular" },
];

export const RISK_LABEL: Record<string, string> = {
  low: "Düşük Risk",
  medium: "Orta Risk",
  high: "Yüksek Risk",
  critical: "Kritik",
};

export const STATUS_LABEL: Record<string, string> = {
  draft: "Taslak",
  pending: "İnceleme Bekliyor",
  approved: "Onaylandı",
  applied: "Uygulandı",
  rejected: "Reddedildi",
  undone: "Geri Alındı",
  failed: "Hata Oluştu",
};
