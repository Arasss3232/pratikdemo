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
  // Site Yönetimi
  | "settings"
  | "brochures"
  | "catalogs"
  | "references"
  | "certificates"
  | "team"
  | "testimonials"
  | "faqs"
  | "messages"
  | "quotes"
  // SEO Yönetimi
  | "seo"
  // Sistem
  | "users"
  | "roles"
  | "workflows"
  | "integrations"
  | "activityLogs"
  | "security"
  | "backup";

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
      { key: "dashboard", label: "Genel Bakış", icon: "dashboard", description: "Site yönetim paneli genel görünümü" },
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
    title: "Dijital Varlıklar",
    items: [
      { key: "brochures", label: "Slider Yönetimi", icon: "view_carousel", description: "Anasayfa tanıtım slaytları" },
      { key: "catalogs", label: "Katalog Dosyaları", icon: "folder_zip", description: "İndirilebilir dosyalar" },
    ],
  },
  {
    title: "Kurumsal & Site",
    items: [
      { key: "seo", label: "SEO Yönetimi", icon: "trending_up", description: "Arama motoru optimizasyonu ve site kimliği" },
      { key: "settings", label: "Site Ayarları", icon: "settings", description: "Genel site ve iletişim bilgileri" },
      { key: "team", label: "Kurumsal İçerik", icon: "business", description: "Hakkımızda ve kurumsal sayfalar" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { key: "users", label: "Kullanıcılar", icon: "manage_accounts" },
      { key: "roles", label: "Roller ve Yetkiler", icon: "admin_panel_settings" },
      { key: "activityLogs", label: "İşlem Geçmişi", icon: "history" },
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

export type _AdminAny = ComponentType<unknown>;
