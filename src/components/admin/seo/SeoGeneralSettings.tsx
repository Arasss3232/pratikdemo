import { SiteSettingsForm } from "../SiteSettingsForm";

export function SeoGeneralSettings() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Genel SEO Ayarları</h2>
      <SiteSettingsForm />
    </div>
  );
}
