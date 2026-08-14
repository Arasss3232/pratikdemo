import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { SectionMarker } from "../marketing/SectionMarker";
import { type PageSection } from "@/hooks/use-page-content";
import { useSiteSettings } from "@/hooks/use-site-settings";

const NAVY_950 = "var(--public-navy-950)";
const NAVY_900 = "var(--public-navy-900)";
const NAVY_800 = "var(--public-navy-800)";
const NAVY_BORDER = "var(--public-navy-border)";
const YELLOW = "var(--public-yellow-500)";

export function CorporateIntroduction({ section }: { section: PageSection }) {
  const c = section.content;
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#F2F5F8" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <SectionMarker 
              number="01" 
              label={c.eyebrow?.value_text || "PRATİK TEDARİK YAPI"} 
              tone="light" 
              className="mb-6" 
            />
            <h2 
              className="font-display font-bold text-navy-950 leading-[1.05] tracking-tight mb-8"
              style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
            >
              {c.title?.value_text}
            </h2>
            <div className="space-y-6 text-[16px] md:text-[18px] leading-relaxed text-slate-600">
              <p className="font-semibold text-navy-900">
                {c.description?.value_text}
              </p>
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: c.content?.value_text || "" }} 
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div 
              className="relative aspect-[4/5] overflow-hidden rounded-sm pub-ticks"
              style={{ border: `1px solid ${NAVY_BORDER}` }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <img 
                src={c.image?.media_url || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80"} 
                alt={c.title?.value_text || "Kurumsal Tanıtım"}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute -bottom-4 -right-4 w-32 h-32 border-r-4 border-b-4 pointer-events-none"
                style={{ borderColor: YELLOW }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MissionVision({ section }: { section: PageSection }) {
  const c = section.content;
  const { data: cmsCorporate } = useSiteContent("corporate");
  return (
    <section className="relative pub-navy overflow-hidden" style={{ backgroundColor: NAVY_900 }}>
      <div className="absolute inset-0 pub-blueprint opacity-30 pointer-events-none" aria-hidden />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 relative group hover:border-[var(--public-yellow-500)]/30 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon name="rocket_launch" className="text-[80px] text-white" />
            </div>
            <SectionMarker number="02" label="MİSYON" tone="dark" className="mb-6" />
            <h3 className="font-display font-bold text-white text-3xl mb-6">
              {c.mission_title?.value_text || "Misyonumuz"}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              {cmsCorporate?.mission || c.mission_desc?.value_text}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 relative group hover:border-[var(--public-yellow-500)]/30 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon name="visibility" className="text-[80px] text-white" />
            </div>
            <SectionMarker number="03" label="VİZYON" tone="dark" className="mb-6" />
            <h3 className="font-display font-bold text-white text-3xl mb-6">
              {c.vision_title?.value_text || "Vizyonumuz"}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              {cmsCorporate?.vision || c.vision_desc?.value_text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CorporateValues({ section }: { section: PageSection }) {
  const c = section.content;
  const values = [
    { k: "01", t: c.value_1_title?.value_text, d: c.value_1_desc?.value_text, icon: "verified" },
    { k: "02", t: c.value_2_title?.value_text, d: c.value_2_desc?.value_text, icon: "psychology" },
    { k: "03", t: c.value_3_title?.value_text, d: c.value_3_desc?.value_text, icon: "speed" },
    { k: "04", t: c.value_4_title?.value_text, d: c.value_4_desc?.value_text, icon: "handshake" },
  ].filter(v => v.t);

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionMarker number="04" label="DEĞERLERİMİZ" tone="light" className="mb-4" />
          <h2 className="font-display font-bold text-navy-950 text-4xl md:text-5xl">
            {c.title?.value_text || "Kurumsal Değerlerimiz"}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {values.map((v) => (
            <div key={v.k} className="bg-white p-8 md:p-10 group hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center mb-6 group-hover:bg-[var(--public-yellow-500)] transition-colors">
                <Icon name={v.icon} className="text-[24px] text-navy-900 group-hover:text-navy-950" />
              </div>
              <h4 className="font-display font-bold text-navy-950 text-xl mb-4">{v.t}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkingProcess({ section }: { section: PageSection }) {
  const c = section.content;
  const steps = [
    { k: "01", t: c.step_1_title?.value_text, d: c.step_1_desc?.value_text, icon: "search" },
    { k: "02", t: c.step_2_title?.value_text, d: c.step_2_desc?.value_text, icon: "category" },
    { k: "03", t: c.step_3_title?.value_text, d: c.step_3_desc?.value_text, icon: "send" },
    { k: "04", t: c.step_4_title?.value_text, d: c.step_4_desc?.value_text, icon: "assignment_turned_in" },
  ].filter(v => v.t);

  return (
    <section className="relative pub-navy overflow-hidden" style={{ backgroundColor: NAVY_800 }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="mb-16">
          <SectionMarker number="05" label="SÜRECİMİZ" tone="dark" className="mb-4" />
          <h2 className="font-display font-bold text-white text-4xl md:text-5xl">
            {c.title?.value_text || "Nasıl Çalışıyoruz?"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={s.k} className="relative group">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-white/10 z-0 -translate-x-8" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 bg-navy-800 group-hover:border-[var(--public-yellow-500)] transition-colors">
                  <span className="font-mono text-xl font-bold text-[var(--public-yellow-500)]">{s.k}</span>
                </div>
                <h4 className="font-display font-bold text-white text-xl mb-4">{s.t}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CorporateAdvantages({ section }: { section: PageSection }) {
  const c = section.content;
  const items = [
    c.item_1?.value_text,
    c.item_2?.value_text,
    c.item_3?.value_text,
    c.item_4?.value_text,
  ].filter(Boolean);

  return (
    <section className="relative bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div 
              className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm pub-ticks"
              style={{ border: `1px solid ${NAVY_BORDER}` }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <img 
                src={c.image?.media_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80"} 
                alt={c.title?.value_text || "Neden Pratik Tedarik Yapı"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <SectionMarker number="06" label="AVANTAJLARIMIZ" tone="light" className="mb-6" />
            <h2 className="font-display font-bold text-navy-950 text-4xl md:text-5xl mb-8 leading-[1.1]">
              {c.title?.value_text || "Neden Pratik Tedarik Yapı?"}
            </h2>
            <ul className="space-y-6">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[var(--public-yellow-500)] flex items-center justify-center flex-shrink-0">
                    <Icon name="check" className="text-[14px] text-navy-950 font-bold" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CorporateCTA({ section }: { section: PageSection }) {
  const c = section.content;
  return (
    <section className="relative pub-navy overflow-hidden" style={{ backgroundColor: NAVY_950 }}>
      <div className="absolute inset-0 pub-blueprint opacity-20 pointer-events-none" aria-hidden />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            {c.title?.value_text}
          </h2>
          <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto">
            {c.description?.value_text}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to={c.primary_url?.value_text || "/urunler"} 
              className="pub-btn pub-btn-lg pub-btn-yellow w-full sm:w-auto"
            >
              {c.primary_btn?.value_text || "Ürün Gruplarını Gör"}
              <Icon name="arrow_forward" />
            </Link>
            <Link 
              to={c.secondary_url?.value_text || "/teklif"} 
              className="pub-btn pub-btn-lg pub-btn-outline-light w-full sm:w-auto"
            >
              {c.secondary_btn?.value_text || "Teklif Talep Et"}
              <Icon name="request_quote" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactStrip() {
  const { phone, email, address, working_hours } = useSiteSettings();
  
  if (!phone && !email && !address) return null;

  return (
    <section className="bg-slate-50 border-y border-slate-200 py-10">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-[var(--public-yellow-500)] group-hover:border-[var(--public-yellow-500)] transition-colors">
                <Icon name="phone" className="text-navy-900" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TELEFON</span>
                <span className="block text-navy-950 font-bold">{phone}</span>
              </div>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-[var(--public-yellow-500)] group-hover:border-[var(--public-yellow-500)] transition-colors">
                <Icon name="mail" className="text-navy-900" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">E-POSTA</span>
                <span className="block text-navy-950 font-bold truncate">{email}</span>
              </div>
            </a>
          )}
          {address && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                <Icon name="location_on" className="text-navy-900" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ADRES</span>
                <span className="block text-navy-950 font-bold text-sm leading-tight">{address}</span>
              </div>
            </div>
          )}
          {working_hours && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                <Icon name="schedule" className="text-navy-900" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MESAİ</span>
                <span className="block text-navy-950 font-bold text-sm leading-tight">{working_hours}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}