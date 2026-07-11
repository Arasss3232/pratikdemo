import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalContext } from "@/hooks/use-portal-context";
import { Icon } from "@/components/site-shell";
import { PageTitle } from "@/components/portal/portal-ui";

export const Route = createFileRoute("/portal/teklif-al")({
  component: NewQuote,
});

type Line = { name: string; sku: string; qty: number; note: string };

function NewQuote() {
  const ctx = usePortalContext();
  const navigate = useNavigate();
  const [contact, setContact] = useState(ctx.email?.split("@")[0] ?? "");
  const [phone, setPhone] = useState(ctx.activeCompany?.phone ?? "");
  const [message, setMessage] = useState("");
  const [lines, setLines] = useState<Line[]>([{ name: "", sku: "", qty: 1, note: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function addLine() { setLines((prev) => [...prev, { name: "", sku: "", qty: 1, note: "" }]); }
  function removeLine(i: number) { setLines((prev) => prev.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ctx.activeCompany || !ctx.userId) { setError("Aktif firma bulunamadı."); return; }
    if (!contact.trim()) { setError("İletişim adı gerekli."); return; }
    const cleanLines = lines
      .map((l) => ({ ...l, name: l.name.trim(), sku: l.sku.trim(), note: l.note.trim() }))
      .filter((l) => l.name.length > 0);
    if (cleanLines.length === 0 && !message.trim()) {
      setError("En az bir ürün veya bir açıklama girmelisiniz.");
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase.from("quote_requests").insert({
      contact_name: contact.trim(),
      email: ctx.email ?? "",
      phone: phone.trim() || null,
      company: ctx.activeCompany.trade_name || ctx.activeCompany.legal_name,
      company_id: ctx.activeCompany.id,
      submitted_by: ctx.userId,
      source: "portal",
      message: message.trim() || null,
      items: cleanLines,
      status: "new",
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    navigate({ to: "/portal/tekliflerim" });
  }

  return (
    <>
      <PageTitle icon="request_quote" title="Yeni Teklif Talebi" subtitle={ctx.activeCompany?.trade_name || ctx.activeCompany?.legal_name || ""} />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4 min-w-0">
          <section className="portal-card p-5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--portal-text-mute)" }}>Ürün Kalemleri</p>
            <div className="space-y-2">
              {lines.map((l, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_90px_auto] items-start p-3 rounded-lg" style={{ background: "var(--portal-surface-2)" }}>
                  <input className="portal-input" placeholder="Ürün adı *" value={l.name} onChange={(e) => updateLine(i, { name: e.target.value })} />
                  <input className="portal-input" placeholder="SKU / Kod (opsiyonel)" value={l.sku} onChange={(e) => updateLine(i, { sku: e.target.value })} />
                  <input className="portal-input tabular-nums text-right" type="number" min={1} value={l.qty} onChange={(e) => updateLine(i, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                  <button type="button" onClick={() => removeLine(i)} disabled={lines.length === 1} className="portal-btn portal-btn-outline portal-btn-sm" title="Kalemi sil">
                    <Icon name="delete" className="text-[16px]" />
                  </button>
                  <input className="portal-input sm:col-span-4" placeholder="Not (opsiyonel — marka, model, renk vb.)" value={l.note} onChange={(e) => updateLine(i, { note: e.target.value })} />
                </div>
              ))}
            </div>
            <button type="button" onClick={addLine} className="portal-btn portal-btn-outline portal-btn-sm mt-3">
              <Icon name="add" className="text-[16px]" /> Kalem Ekle
            </button>
          </section>

          <section className="portal-card p-5">
            <label className="text-[10.5px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--portal-text-mute)" }}>Genel Açıklama</label>
            <textarea className="portal-input" rows={4} placeholder="Termin, teslimat adresi, özel talepler..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="portal-card p-5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--portal-text-mute)" }}>İletişim Kişisi</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--portal-text-2)" }}>Ad Soyad *</label>
                <input className="portal-input" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--portal-text-2)" }}>Telefon</label>
                <input className="portal-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-semibold block mb-1" style={{ color: "var(--portal-text-2)" }}>E-posta</label>
                <input className="portal-input" value={ctx.email ?? ""} disabled />
              </div>
            </div>
          </section>

          {error && (
            <div className="portal-card p-3 text-[13px]" style={{ background: "var(--portal-danger-soft)", color: "var(--portal-danger)", borderColor: "var(--portal-danger)" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="portal-btn portal-btn-primary w-full">
            {submitting ? "Gönderiliyor..." : (<><Icon name="send" className="text-[18px]" /> Teklif Talebini Gönder</>)}
          </button>
          <p className="text-[11.5px]" style={{ color: "var(--portal-text-mute)" }}>
            Talebiniz satış ekibimize ulaşacak. Fiyat ve stok durumu bildirimini portalınızdan takip edebilirsiniz.
          </p>
        </aside>
      </form>
    </>
  );
}