import type { ComponentType } from "react";

export type AdminTab =
  // Ana Yönetim
  | "dashboard"
  | "myTasks"
  | "approvals"
  | "notifications"
  // Müşteri Yönetimi
  | "companies"
  | "dealers"
  | "companyUsers"
  | "customerGroups"
  | "applications"
  | "salesReps"
  // Satış
  | "quotations"
  | "orders"
  | "quickOrder"
  | "carts"
  | "opportunities"
  | "discountApprovals"
  // Ürün ve Fiyat
  | "products"
  | "categories"
  | "brands"
  | "priceLists"
  | "specialPrices"
  | "discounts"
  | "stock"
  // Finans
  | "accounts"
  | "creditLimits"
  | "dueTracking"
  | "payments"
  | "statements"
  | "risk"
  // Operasyon
  | "warehouse"
  | "shipments"
  | "deliveries"
  | "returns"
  | "documents"
  // Raporlar
  | "reportSales"
  | "reportQuotes"
  | "reportOrders"
  | "reportCustomers"
  | "reportProducts"
  | "reportFinance"
  // Site Yönetimi (mevcut CMS modülleri)
  | "settings"
  | "brochures"
  | "catalogs"
  | "references"
  | "certificates"
  | "team"
  | "testimonials"
  | "faqs"
  | "blog"
  | "blogcats"
  | "jobs"
  | "messages"
  | "quotes"
  // Sistem
  | "users"
  | "roles"
  | "workflows"
  | "integrations"
  | "activityLogs"
  | "security"
  | "backup"
  // Akıllı Araçlar
  | "aiAssistant"
  | "aiHistory";

export type AdminNavItem = {
  key: AdminTab;
  label: string;
  icon: string;
  description?: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Ana Yönetim",
    items: [
      { key: "dashboard", label: "Yapay Zekâ Kontrol Merkezi", icon: "auto_awesome", description: "Site kontrol merkezi ve AI asistanı" },
      { key: "myTasks", label: "Görevlerim", icon: "task_alt", description: "Size atanmış görevler" },
      { key: "approvals", label: "Onay Bekleyenler", icon: "approval", description: "Onayınızı bekleyen işlemler" },
      { key: "notifications", label: "Bildirimler", icon: "notifications", description: "Sistem bildirimleri" },
    ],
  },
  {
    title: "İçerik Yönetimi",
    items: [
      { key: "categories", label: "Kategori Yönetimi", icon: "category", description: "Ürün grupları ve teklif kategorileri" },
      { key: "catalogs", label: "Katalog Yönetimi", icon: "menu_book", description: "Dijital ürün katalogları (PDF)" },
      { key: "brands", label: "Bayilik Yönetimi", icon: "workspace_premium", description: "Yetkili bayisi olunan markalar" },
    ],
  },
  {
    title: "İşlemler",
    items: [
      { key: "quotes", label: "Teklif Talepleri", icon: "mail_outline", description: "Web sitesinden gelen yeni talepler" },
      { key: "messages", label: "İletişim Mesajları", icon: "mail", description: "İletişim formu mesajları" },
    ],
  },
  {
    title: "Yayın Yönetimi",
    items: [
      { key: "brochures", label: "Slider Yönetimi", icon: "view_carousel", description: "Anasayfa tanıtım slaytları" },
      { key: "settings", label: "Site Ayarları", icon: "settings", description: "Genel site ve iletişim bilgileri" },
      { key: "team", label: "Kurumsal İçerik", icon: "business", description: "Hakkımızda ve kurumsal sayfalar" },
    ],
  },
  {
    title: "Site Yönetimi",
    items: [
      { key: "settings", label: "Site Ayarları", icon: "settings" },
      { key: "brochures", label: "Broşür ve Slider Yönetimi", icon: "view_carousel", description: "Anasayfa broşür slaytları" },
      { key: "catalogs", label: "Katalog Yönetimi", icon: "menu_book", description: "Dijital ürün katalogları" },
      
      { key: "certificates", label: "Sertifikalar", icon: "verified" },
      { key: "messages", label: "Gelen Mesajlar", icon: "mail" },
      { key: "quotes", label: "Web Teklif Talepleri", icon: "mail_outline" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { key: "users", label: "Kullanıcılar", icon: "manage_accounts" },
      { key: "roles", label: "Roller ve Yetkiler", icon: "admin_panel_settings" },
      { key: "workflows", label: "Onay Akışları", icon: "account_tree" },
      { key: "integrations", label: "Entegrasyonlar", icon: "hub" },
      { key: "activityLogs", label: "İşlem Geçmişi", icon: "history" },
      { key: "security", label: "Güvenlik", icon: "shield" },
      { key: "backup", label: "Yedekleme", icon: "cloud_upload" },
    ],
  },
  {
    title: "Akıllı Araçlar",
    items: [
      { key: "aiAssistant", label: "Yapay Zekâ Site Asistanı", icon: "smart_toy", description: "Sohbetle site içeriğini yönetin" },
    ],
  },
];

export const ADMIN_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);

export function findNavItem(tab: AdminTab): AdminNavItem | undefined {
  return ADMIN_ITEMS.find((i) => i.key === tab);
}

export function findNavGroup(tab: AdminTab): AdminNavGroup | undefined {
  return ADMIN_NAV.find((g) => g.items.some((i) => i.key === tab));
}

// Marker to keep unused import from tree-shaking away — allows consumers to
// type check components lazily via ComponentType if needed later.
export type _AdminAny = ComponentType<unknown>;