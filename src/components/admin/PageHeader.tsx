import type { ReactNode } from "react";
import { Icon } from "../site-shell";
import { findNavGroup, findNavItem, type AdminTab } from "./nav";

const DESCRIPTIONS: Partial<Record<AdminTab, string>> = {
  dashboard: "Sitenizin genel durumu, öncelikleriniz ve son hareketler.",
  myTasks: "Size atanmış görevler, hatırlatmalar ve süresi yaklaşan işler.",
  approvals: "Onayınızı bekleyen firmalar, teklifler, siparişler ve indirimler.",
  notifications: "Sistemden gelen tüm bildirimler ve önemli uyarılar.",
  companies: "Kurumsal müşteriler, bayiler ve distribütörler. Firma bilgilerini, kredi ve satış temsilcisi atamalarını buradan yönetin.",
  dealers: "Yetkili bayi ağınız. Bayi seviyeleri, indirim oranları ve yıllık hacim hedefleri.",
  companyUsers: "Firmaların kullanıcıları ve firma içi yetkileri.",
  customerGroups: "Müşteri segmentleri. Her grubun kendi varsayılan indirimi ve fiyat listesi olabilir.",
  salesReps: "Satış temsilcileri, bölgeleri ve firma portföyleri.",
  quotations: "Firmalara hazırlanan teklifler. Revizyon, onay akışı ve siparişe dönüştürme.",
  orders: "Onaylanmış siparişler, hazırlık ve sevkiyat durumları.",
  quickOrder: "Ürün koduyla hızlı sipariş oluşturma.",
  carts: "Firmaların açık sepetleri ve devam eden alışverişleri.",
  opportunities: "Aktif satış fırsatları ve pipeline takibi.",
  discountApprovals: "Standart dışı indirim talepleri ve fiyat override onayları.",
  categories: "Ürün kategorileri ve alt kategoriler.",
  priceLists: "Genel, müşteri grubu ve bayi seviyesine göre fiyat listeleri.",
  specialPrices: "Firma bazlı özel fiyatlar ve sözleşme fiyatları.",
  discounts: "Kampanya, kategori ve ürün bazlı indirim kuralları.",
  stock: "Depo bazında mevcut, rezerve ve gelen stok bilgileri.",
  accounts: "Firma cari hesap özetleri, bakiye ve vade durumu.",
  creditLimits: "Firma kredi limitleri, kullanılabilir limit ve limit değişiklik geçmişi.",
  dueTracking: "Vade tarihleri, geciken tahsilatlar ve yaklaşan ödemeler.",
  payments: "Tahsilat ve ödeme kayıtları.",
  statements: "Firma bazlı hesap ekstreleri ve dönemsel raporlar.",
  risk: "Kredi riski, geciken bakiyeler ve engelli hesaplar.",
  warehouse: "Depo tanımları, konum ve sorumlu kullanıcılar.",
  shipments: "Sevkiyatlar, kargo bilgileri ve teslimat takibi.",
  deliveries: "Teslim edilmiş siparişler ve tesellüm belgeleri.",
  returns: "İade talepleri ve iade süreçleri.",
  documents: "Sözleşmeler, teklifler, faturalar ve teknik belgeler için ortak depo.",
  reportSales: "Dönemsel satış performansı, temsilci ve müşteri bazlı analiz.",
  reportQuotes: "Teklif hacmi, dönüşüm oranı ve red nedenleri.",
  reportOrders: "Sipariş hacmi, ortalama sepet ve statü dağılımı.",
  reportCustomers: "Müşteri edinim, aktif firma ve segment analizi.",
  reportProducts: "En çok satan ürünler, marka ve kategori performansı.",
  reportFinance: "Tahsilat, vade ve nakit akışı raporları.",
  settings: "Site kimliği, iletişim bilgileri, sosyal medya ve genel ayarlar.",
  products: "Ürün kataloğunuzu buradan yönetin. B2B görünürlük ve fiyat listesi bağlantıları da bu ekrandan.",
  catalogs: "Ürün gruplarınıza ait dijital PDF kataloglarını buradan yönetin.",
    content: "Web sitesindeki tüm metin ve görselleri kod yazmadan buradan güncelleyin.",
  brands: "Ana sayfada gösterilen marka logoları.",
  
  faqs: "Sık sorulan sorular. Kategoriye göre gruplandırabilirsiniz.",
  applications: "Kariyer sayfanızdan gelen iş başvuruları.",
  messages: "Web sitenizden gelen iletişim mesajları.",
  quotes: "Web sitesindeki teklif sepetinden gelen ilk temas talepleri. Firmaya dönüştürmek için Firmalar modülüne aktarın.",
  users: "Yönetici yetkileri ve kullanıcı rolleri.",
  roles: "Sistem rolleri, izin matrisi ve dahili roller.",
  workflows: "Onay akışı kuralları: kim neyi onaylar, hangi eşiklerde.",
  integrations: "Muhasebe, kargo ve e-posta gibi harici sistemler.",
  activityLogs: "Sistem üzerindeki tüm değişiklik ve erişim kayıtları.",
  security: "Oturum, şifre politikası ve güvenlik olayları.",
  backup: "Yedekleme durumu ve veri geri yükleme.",
  seo: "Arama motoru optimizasyonu, meta etiketleri ve site kimliği yönetimi.",
};

export function PageHeader({
  tab,
  title,
  description,
  action,
  eyebrow,
}: {
  tab: AdminTab;
  title?: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  const item = findNavItem(tab);
  const group = findNavGroup(tab);
  const displayTitle = title ?? item?.label ?? "";
  const displayDesc = description ?? DESCRIPTIONS[tab];

  return (
    <header className="mb-6 flex flex-col gap-3">
      <nav
        className="flex items-center gap-1.5 text-[12px]"
        style={{ color: "var(--admin-text-2)" }}
        aria-label="Sayfa yolu"
      >
        <span className="inline-flex items-center gap-1">
          <Icon name="dashboard" className="text-[14px]" />
          Yönetim
        </span>
        {group && (
          <>
            <Icon name="chevron_right" className="text-[14px]" />
            <span>{group.title}</span>
          </>
        )}
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="font-semibold" style={{ color: "var(--admin-text)" }}>
          {displayTitle}
        </span>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1"
              style={{ color: "var(--admin-navy)" }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-[26px] sm:text-[30px] font-bold tracking-tight leading-tight truncate"
            style={{ color: "var(--admin-text)" }}
          >
            {displayTitle}
          </h1>
          {displayDesc && (
            <p className="mt-1.5 text-[14px] max-w-2xl" style={{ color: "var(--admin-text-2)" }}>
              {displayDesc}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2 flex-wrap">{action}</div>}
      </div>
    </header>
  );
}