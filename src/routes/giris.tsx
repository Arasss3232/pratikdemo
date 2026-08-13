import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { buttonStyles } from "../lib/button-styles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/giris")({
  head: () => ({
    meta: [
      { title: "Bayi Girişi — Pratik Endüstriyel" },
      { name: "description", content: "Pratik bayi ve kurumsal müşteri paneline giriş yapın: sipariş takibi, özel fiyat listeleri ve teklif geçmişi." },
      { property: "og:title", content: "Bayi Girişi — Pratik Endüstriyel" },
      { property: "og:description", content: "Bayi ve kurumsal müşteri paneline giriş." },
      { property: "og:url", content: "/giris" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/giris" }],
  }),
  component: GirisPage,
});

function GirisPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/giris" },
        });
        if (error) throw error;
        setNotice("Hesabınız oluşturuldu. E-posta onayı gerekiyorsa gelen kutunuzu kontrol edin, ardından giriş yapın.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <SiteShell>
      <PageHero
        title="Yönetim Girişi"
        description="Bu alan sadece yetkili personel erişimine özeldir."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Giriş" }]}
      />
      <div className="max-w-md mx-auto px-margin-mobile md:px-margin-desktop py-16">
        {authLoading ? (
          <p className="text-center text-on-surface-variant">Yükleniyor…</p>
        ) : user ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded">
            <h2 className="font-headline-md text-headline-md text-on-background mb-2">
              Hoş geldiniz
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">{user.email}</p>
            <div className="flex flex-col gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/admin", search: { tab: "dashboard", aiAction: undefined, aiTarget: undefined, aiPrompt: undefined } })}
                  className={buttonStyles({ variant: "primary" })}
                >
                  Admin Paneline Git
                </button>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className={buttonStyles({ variant: "outline-dark" })}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest border border-outline-variant p-8 rounded flex flex-col gap-4"
          >
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-2 rounded font-label-bold text-label-bold ${
                  mode === "signin" ? "bg-primary text-on-primary" : "bg-surface-variant text-on-surface-variant"
                }`}
              >
                Giriş
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded font-label-bold text-label-bold ${
                  mode === "signup" ? "bg-primary text-on-primary" : "bg-surface-variant text-on-surface-variant"
                }`}
              >
                Kayıt Ol
              </button>
            </div>
            <label className="flex flex-col gap-1 text-body-sm">
              <span className="font-label-bold">E-posta</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-outline-variant rounded px-3 py-2 focus:border-secondary outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-body-sm">
              <span className="font-label-bold">Şifre</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-outline-variant rounded px-3 py-2 focus:border-secondary outline-none"
              />
            </label>
            {error && <p className="text-body-sm text-error">{error}</p>}
            {notice && <p className="text-body-sm text-primary">{notice}</p>}
            <button
              type="submit"
              disabled={busy}
              className={buttonStyles({ variant: "primary", className: "disabled:opacity-60" })}
            >
              {busy ? "Lütfen bekleyin…" : mode === "signin" ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </form>
        )}
      </div>
    </SiteShell>
  );
}