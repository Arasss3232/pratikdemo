import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { SiteShell, Icon } from "../components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "@/lib/button-styles";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useCategories } from "@/hooks/use-categories";
import { LucideIcon, CheckCircle, Clock, ShieldCheck, Mail, Phone, ArrowRight, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/teklif")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: typeof s.category === "string" ? s.category : undefined,
    categoryId: typeof s.categoryId === "string" ? s.categoryId : undefined,
  }) as { category?: string; categoryId?: string },
  head: () => ({
    meta: [
      { title: "Teklif Al — İhtiyacınıza Özel Kurumsal Çözümler | Pratik" },
      { name: "description", content: "Endüstriyel hırdavat ihtiyaçlarınız için hızlı teklif alın. Uzman ekibimiz talebinizi en kısa sürede değerlendirsin." },
      { property: "og:title", content: "Teklif Al — İhtiyacınıza Özel Kurumsal Çözümler | Pratik" },
      { property: "og:description", content: "Endüstriyel hırdavat ihtiyaçlarınız için hızlı teklif alın." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/teklif" }],
  }),
  component: TeklifPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad zorunlu").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Geçerli e-posta giriniz").max(200),
  phone: z.string().trim().min(7, "Telefon zorunlu").max(30),
  categoryId: z.string().min(1, "Ürün grubu seçiniz"),
  message: z.string().min(10, "Lütfen talebinizi detaylandırın").max(2000),
  kvkk: z.literal("on", { message: "KVKK onayı gereklidir" }),
});

function TeklifPage() {
  const search = Route.useSearch();
  const { settings } = useSiteSettings();
  const { categories, isLoading: catsLoading } = useCategories(true);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCatId, setSelectedCatId] = useState<string>("");

  const verifiedCategory = useMemo(() => {
    if (!search.categoryId || !categories) return null;
    return categories.find((c: any) => c.id === search.categoryId && c.is_active) || null;
  }, [search.categoryId, categories]);

  useEffect(() => {
    if (verifiedCategory) {
      setSelectedCatId(verifiedCategory.id);
    }
  }, [verifiedCategory]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = contactSchema.safeParse(data);
    
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(issue => {
        errs[issue.path.join(".")] = issue.message;
      });
      setErrors(errs);
      return;
    }

    setState("loading");

    const category = categories?.find(c => c.id === parsed.data.categoryId);
    
    const payload = {
      contact_name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      category_id: parsed.data.categoryId,
      category_name: category?.title || "Genel",
      status: "pending",
      items: [{ category: category?.title || "Genel", quantity: 1 }]
    };



    const { error } = await supabase.from("quote_requests").insert(payload as any);



    
    if (error) {
      console.error("Submission error:", error);
      setState("err");
      return;
    }

    setState("ok");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteShell>
      <div className="min-h-screen pt-24 pb-20 px-4 md:px-8" style={{ background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[24px] shadow-2xl border border-slate-200 bg-white">
            
            {/* Left Column: Info */}
            <div className="lg:col-span-5 bg-[#08182C] text-white p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase mb-6 border border-primary/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Hızlı Teklif
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 font-display">
                  İhtiyacınıza Özel <br/>
                  <span className="text-primary">Teklif Alın</span>
                </h1>
                
                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                  İhtiyacınız olan ürün grubunu ve iletişim bilgilerinizi paylaşın. Uzman ekibimiz talebinizi inceleyerek sizinle en kısa sürede iletişime geçsin.
                </p>

                <div className="space-y-6 mb-12">
                  <TrustItem icon={Clock} title="Hızlı Geri Dönüş" desc="Aynı iş günü içinde değerlendirme" />
                  <TrustItem icon={CheckCircle} title="İhtiyaca Özel" desc="Projeniz için optimize edilmiş çözümler" />
                  <TrustItem icon={ShieldCheck} title="Güvenli İletişim" desc="Verileriniz KVKK kapsamında korunur" />
                </div>

                <div className="mt-auto pt-10 border-t border-white/10 space-y-4">
                  {settings.phone && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bizi Arayın</p>
                        <p className="text-lg font-semibold">{settings.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Çalışma Saatleri</p>
                      <p className="text-sm text-slate-300">{settings.working_hours || "Pzt – Cmt · 08:30 – 18:00"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 relative">
              {state === "ok" ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-6">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-bold text-[#08182C] mb-4">Teklif Talebiniz Alındı</h2>
                  <p className="text-slate-600 mb-10 max-w-sm">
                    Talebiniz ekibimize iletildi. Sizinle en kısa sürede iletişime geçeceğiz.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                    <Link 
                      to="/" 
                      className={buttonStyles({ variant: "primary", className: "w-full h-14 rounded-xl flex items-center justify-center gap-2" })}
                    >
                      Ana Sayfaya Dön
                    </Link>
                    <button 
                      onClick={() => { setState("idle"); setSelectedCatId(""); }}
                      className={buttonStyles({ variant: "outline-dark", className: "w-full h-14 rounded-xl" })}
                    >
                      Yeni Talep Oluştur
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#08182C] border-l-4 border-primary pl-4">
                      Talebiniz
                    </h3>
                    
                    {/* Category Selection */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 ml-1">Ürün Grubu / Kategori *</label>
                      <div className="relative group">
                        <select
                          name="categoryId"
                          value={selectedCatId}
                          onChange={(e) => setSelectedCatId(e.target.value)}
                          className={`w-full h-14 pl-4 pr-10 rounded-xl border-2 appearance-none bg-slate-50 transition-all outline-none focus:bg-white
                            ${errors.categoryId ? "border-red-200 focus:border-red-500" : "border-slate-100 focus:border-primary"}`}
                        >
                          <option value="">Kategori Seçiniz</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                          <Icon name="expand_more" />
                        </div>
                      </div>
                      {errors.categoryId && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.categoryId}</p>}
                    </div>

                    {/* Detailed Message */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-slate-700 ml-1">Talep Detayı *</label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="İhtiyacınızı, yaklaşık miktarı ve varsa tercih ettiğiniz özellikleri kısaca belirtin."
                        className={`w-full p-4 rounded-xl border-2 bg-slate-50 transition-all outline-none focus:bg-white resize-none
                          ${errors.message ? "border-red-200 focus:border-red-500" : "border-slate-100 focus:border-primary"}`}
                      />
                      {errors.message && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#08182C] border-l-4 border-primary pl-4">
                      İletişim Bilgileriniz
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput 
                        label="Ad Soyad *" 
                        name="name" 
                        placeholder="Örn: Ahmet Yılmaz" 
                        error={errors.name} 
                      />
                      <FormInput 
                        label="Firma Adı" 
                        name="company" 
                        placeholder="Opsiyonel" 
                        error={errors.company} 
                      />
                      <FormInput 
                        label="Telefon *" 
                        name="phone" 
                        type="tel" 
                        placeholder="05xx xxx xx xx" 
                        error={errors.phone} 
                        icon={<Phone size={16} />}
                      />
                      <FormInput 
                        label="E-posta *" 
                        name="email" 
                        type="email" 
                        placeholder="ornek@firma.com" 
                        error={errors.email} 
                        icon={<Mail size={16} />}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center h-5 mt-0.5">
                        <input
                          type="checkbox"
                          name="kvkk"
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-slate-200 rounded-md bg-white peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                          <Check size={14} className="text-[#08182C] opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={4} />
                        </div>
                      </div>
                      <span className="text-sm text-slate-500 leading-relaxed select-none group-hover:text-slate-700 transition-colors">
                        Kişisel verilerimin <Link to="/kurumsal" className="text-primary font-bold hover:underline">KVKK aydınlatma metni</Link> kapsamında işlenmesini kabul ediyorum.
                      </span>
                    </label>
                    {errors.kvkk && <p className="text-xs font-medium text-red-500 mt-2 ml-8">{errors.kvkk}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className={buttonStyles({ 
                      variant: "primary", 
                      className: "w-full h-16 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-70" 
                    })}
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        Teklif Talebini Gönder
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  
                  {state === "err" && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
                      Bir hata oluştu. Lütfen daha sonra tekrar deneyin veya telefonla ulaşın.
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function TrustItem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-1">
        <Icon size={14} className="text-primary" />
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-white leading-none mb-1.5">{title}</h4>
        <p className="text-sm text-slate-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function FormInput({ label, name, type = "text", placeholder, error, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`w-full h-14 ${icon ? "pl-11" : "pl-4"} pr-4 rounded-xl border-2 bg-slate-50 transition-all outline-none focus:bg-white
            ${error ? "border-red-200 focus:border-red-500" : "border-slate-100 focus:border-primary"}`}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
