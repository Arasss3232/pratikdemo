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
    title: "Müşteri Yönetimi",
    items: [
      { key: "companies", label: "Firmalar", icon: "domain" },
      { key: "dealers", label: "Bayiler", icon: "storefront" },
      { key: "companyUsers", label: "Firma Kullanıcıları", icon: "supervised_user_circle" },
      { key: "customerGroups", label: "Müşteri Grupları", icon: "groups" },
      { key: "applications", label: "Başvurular", icon: "assignment_ind" },
      { key: "salesReps", label: "Satış Temsilcileri", icon: "badge" },
    ],
  },
  {
    title: "Satış",
    items: [
      { key: "quotations", label: "Teklifler", icon: "request_quote" },
      { key: "orders", label: "Siparişler", icon: "shopping_bag" },
      { key: "quickOrder", label: "Hızlı Sipariş", icon: "bolt" },
      
      { key: "opportunities", label: "Satış Fırsatları", icon: "trending_up" },
      { key: "discountApprovals", label: "İndirim Onayları", icon: "percent" },
    ],
  },
  {
    title: "Ürün ve Fiyat",
    items: [
      
      { key: "categories", label: "Kategoriler", icon: "category" },
      { key: "brands", label: "Markalar", icon: "sell" },
      { key: "priceLists", label: "Fiyat Listeleri", icon: "price_change" },
      { key: "specialPrices", label: "Özel Fiyatlar", icon: "local_offer" },
      { key: "discounts", label: "İskontolar", icon: "discount" },
      { key: "stock", label: "Stok Durumu", icon: "inventory" },
    ],
  },
  {
    title: "Finans",
    items: [
      { key: "accounts", label: "Cari Hesaplar", icon: "account_balance" },
      { key: "creditLimits", label: "Kredi Limitleri", icon: "credit_score" },
      { key: "dueTracking", label: "Vade Takibi", icon: "event" },
      { key: "payments", label: "Ödemeler", icon: "payments" },
      { key: "statements", label: "Ekstreler", icon: "receipt_long" },
      { key: "risk", label: "Risk Raporları", icon: "warning" },
    ],
  },
  {
    title: "Operasyon",
    items: [
      { key: "warehouse", label: "Depo", icon: "warehouse" },
      { key: "shipments", label: "Sevkiyatlar", icon: "local_shipping" },
      { key: "deliveries", label: "Teslimatlar", icon: "done_all" },
      { key: "returns", label: "İadeler", icon: "assignment_return" },
      { key: "documents", label: "Belgeler", icon: "folder" },
    ],
  },
  {
    title: "Raporlar",
    items: [
      { key: "reportSales", label: "Satış Raporları", icon: "bar_chart" },
      { key: "reportQuotes", label: "Teklif Raporları", icon: "insights" },
      { key: "reportOrders", label: "Sipariş Raporları", icon: "query_stats" },
      { key: "reportCustomers", label: "Müşteri Raporları", icon: "diversity_3" },
      { key: "reportProducts", label: "Ürün Raporları", icon: "monitoring" },
      { key: "reportFinance", label: "Finans Raporları", icon: "leaderboard" },
    ],
  },
  {
    title: "Site Yönetimi",
    items: [
      { key: "settings", label: "Site Ayarları", icon: "settings" },
      { key: "brochures", label: "Broşür ve Slider Yönetimi", icon: "view_carousel", description: "Anasayfa broşür slaytları" },
      { key: "catalogs", label: "Katalog Yönetimi", icon: "menu_book", description: "Dijital ürün katalogları" },
      { key: "references", label: "Bayiliklerimiz Yönetimi", icon: "workspace_premium" },
      { key: "certificates", label: "Sertifikalar", icon: "verified" },
      { key: "team", label: "Ekip", icon: "group" },
      { key: "testimonials", label: "Müşteri Yorumları", icon: "reviews" },
      { key: "faqs", label: "SSS", icon: "quiz" },
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
      { key: "aiHistory", label: "Yapay Zekâ Geçmişi", icon: "manage_history", description: "Öneri ve uygulama kayıtları" },
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