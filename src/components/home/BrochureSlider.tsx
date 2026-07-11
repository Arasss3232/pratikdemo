import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";

type Brochure = {
  id: string;
  title: string;
  eyebrow: string | null;
  subtitle: string | null;
  description: string | null;
  image_desktop: string;
  image_tablet: string | null;
  image_mobile: string | null;
  image_alt: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  accent_color: string | null;
  overlay_style: "left-navy" | "right-navy" | "center-navy" | "bottom-gradient" | "minimal";
  text_theme: "light" | "dark";
  display_order: number;
};

const AUTOPLAY_MS = 6500;

function isInternal(href: string | null | undefined) {
  if (!href) return false;
  return href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/__");
}

function CtaButton({
  label,
  href,
  variant,
  accent,
}: {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  accent?: string | null;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const style: React.CSSProperties =
    variant === "primary"
      ? {
          background: accent || "var(--brand-yellow, #F5D311)",
          color: "#061426",
          boxShadow: "0 12px 30px -12px rgba(245, 211, 17, 0.55)",
        }
      : {
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(6px)",
        };
  const isExternal = /^https?:\/\//i.test(href);
  const inner = (
    <>
      <span>{label}</span>
      <Icon name="arrow_forward" className="text-[18px]" />
    </>
  );
  // Use a plain <a> for both internal and external hrefs to avoid TanStack
  // Router typed-link compile errors on admin-defined dynamic paths. Internal
  // links still do a normal browser navigation (acceptable for a hero CTA).
  return (
    <a
      href={href}
      className={base}
      style={style}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-internal={isInternal(href) ? "true" : undefined}
    >
      {inner}
    </a>
  );
}

function Overlay({ b }: { b: Brochure }) {
  const isDark = b.text_theme === "dark";
  const textColor = isDark ? "#061426" : "#ffffff";
  const subColor = isDark ? "rgba(6,20,38,0.75)" : "rgba(255,255,255,0.82)";
  const eyebrowBg = isDark ? "rgba(6,20,38,0.08)" : "rgba(255,255,255,0.12)";

  const alignment =
    b.overlay_style === "right-navy"
      ? "items-end text-right"
      : b.overlay_style === "center-navy" || b.overlay_style === "bottom-gradient"
      ? "items-center text-center"
      : "items-start text-left";

  const panelPos =
    b.overlay_style === "right-navy"
      ? "md:right-0 md:top-0 md:h-full md:w-[52%] md:pl-16 md:pr-14"
      : b.overlay_style === "left-navy"
      ? "md:left-0 md:top-0 md:h-full md:w-[52%] md:pl-14 md:pr-16"
      : b.overlay_style === "center-navy"
      ? "md:inset-0"
      : b.overlay_style === "bottom-gradient"
      ? "md:inset-x-0 md:bottom-0 md:h-[55%]"
      : "md:left-0 md:top-0 md:h-full md:w-[46%] md:pl-14";

  const panelBg =
    b.overlay_style === "left-navy"
      ? "linear-gradient(90deg, rgba(6,20,38,0.92) 0%, rgba(6,20,38,0.78) 65%, rgba(6,20,38,0) 100%)"
      : b.overlay_style === "right-navy"
      ? "linear-gradient(270deg, rgba(6,20,38,0.92) 0%, rgba(6,20,38,0.78) 65%, rgba(6,20,38,0) 100%)"
      : b.overlay_style === "center-navy"
      ? "linear-gradient(180deg, rgba(6,20,38,0.55) 0%, rgba(6,20,38,0.35) 45%, rgba(6,20,38,0.65) 100%)"
      : b.overlay_style === "bottom-gradient"
      ? "linear-gradient(180deg, rgba(6,20,38,0) 0%, rgba(6,20,38,0.85) 65%, rgba(6,20,38,0.95) 100%)"
      : "linear-gradient(90deg, rgba(6,20,38,0.7) 0%, rgba(6,20,38,0.15) 100%)";

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center gap-5 p-6 sm:p-10 md:p-14 ${alignment} ${panelPos}`}
      style={{
        background: `${panelBg}, linear-gradient(180deg, rgba(6,20,38,0.35) 0%, rgba(6,20,38,0.15) 100%)`,
      }}
    >
      <div className="max-w-2xl flex flex-col gap-4 md:gap-5" style={{ color: textColor }}>
        {b.eyebrow ? (
          <span
            className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{
              background: eyebrowBg,
              color: b.accent_color || "var(--brand-yellow, #F5D311)",
              border: `1px solid ${b.accent_color || "var(--brand-yellow, #F5D311)"}55`,
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: b.accent_color || "var(--brand-yellow, #F5D311)" }}
            />
            {b.eyebrow}
          </span>
        ) : null}
        <h2
          className="font-black leading-[0.95] tracking-tight text-[clamp(1.5rem,4.2vw,3.75rem)] line-clamp-3"
          style={{ fontFamily: "'Barlow Condensed', 'Inter Tight', system-ui, sans-serif" }}
        >
          {b.title}
        </h2>
        {b.subtitle ? (
          <p className="text-base md:text-xl font-medium line-clamp-2" style={{ color: subColor }}>
            {b.subtitle}
          </p>
        ) : null}
        {b.description ? (
          <p className="text-sm md:text-base max-w-xl leading-relaxed line-clamp-3 md:line-clamp-4" style={{ color: subColor }}>
            {b.description}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-2">
          {b.primary_cta_label && b.primary_cta_href ? (
            <CtaButton
              label={b.primary_cta_label}
              href={b.primary_cta_href}
              variant="primary"
              accent={b.accent_color}
            />
          ) : null}
          {b.secondary_cta_label && b.secondary_cta_href ? (
            <CtaButton
              label={b.secondary_cta_label}
              href={b.secondary_cta_href}
              variant="secondary"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Slide({ b, active, eager }: { b: Brochure; active: boolean; eager: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div
      className="absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
      // Keep inactive slide contents out of the tab order for keyboard users.
      {...(!active ? { inert: "" as unknown as boolean } : {})}
    >
      {imgFailed ? (
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, #061426 0%, #0A2342 55%, #0F3460 100%)",
          }}
          aria-hidden="true"
        />
      ) : (
        <picture>
          {b.image_mobile ? (
            <source media="(max-width: 640px)" srcSet={b.image_mobile} />
          ) : null}
          {b.image_tablet ? (
            <source media="(max-width: 1024px)" srcSet={b.image_tablet} />
          ) : null}
          <img
            src={b.image_desktop}
            alt={b.image_alt || b.title}
            className="h-full w-full object-cover"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "low"}
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        </picture>
      )}
      {/* Mobile-only scrim so overlay text stays legible on any photo */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,38,0.35) 0%, rgba(6,20,38,0.55) 55%, rgba(6,20,38,0.85) 100%)",
        }}
        aria-hidden="true"
      />
      <Overlay b={b} />
    </div>
  );
}

export function BrochureSlider() {
  const [slides, setSlides] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const timerRef = useRef<number | null>(null);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("homepage_brochures")
        .select("*")
        .eq("is_active", true)
        .or(`start_at.is.null,start_at.lte.${nowIso}`)
        .or(`end_at.is.null,end_at.gte.${nowIso}`)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.warn("BrochureSlider load error", error);
      }
      setSlides((data as Brochure[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduceMotion(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  const total = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || userPaused || reduceMotion || total < 2) return;
    timerRef.current = window.setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, paused, userPaused, reduceMotion, next, total]);

  // Pause when tab hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Keyboard nav when slider focused
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (loading) {
    return (
      <section
        aria-label="Öne çıkan kampanyalar"
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#061426,#0A2342)",
          minHeight: "clamp(320px, 42vw, 560px)",
        }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2"
            style={{ borderColor: "rgba(245,211,17,0.4)", borderTopColor: "#F5D311" }}
          />
        </div>
      </section>
    );
  }

  if (total === 0) return null;

  const current = slides[index];
  const autoplayActive = !paused && !userPaused && !reduceMotion && total > 1;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      tabIndex={0}
      className="relative w-full overflow-hidden outline-none"
      style={{
        background: "#061426",
        height: "clamp(360px, 46vw, 620px)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 40) {
          if (delta < 0) next();
          else prev();
        }
        touchStart.current = null;
      }}
    >
      {slides.map((s, i) => (
        <Slide key={s.id} b={s} active={i === index} eager={i === 0} />
      ))}

      {/* Accent bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--brand-yellow, #F5D311) 50%, transparent 100%)",
          opacity: 0.7,
        }}
      />

      {/* Live region for a11y */}
      <div className="sr-only" aria-live="polite">
        {`${index + 1} / ${total}: ${current.title}`}
      </div>

      {/* Controls */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Önceki broşür"
            onClick={prev}
            className="absolute top-1/2 left-3 md:left-5 -translate-y-1/2 grid place-items-center h-11 w-11 md:h-12 md:w-12 rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow,#F5D311)]"
            style={{
              background: "rgba(6,20,38,0.55)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Icon name="chevron_left" className="text-[26px]" />
          </button>
          <button
            type="button"
            aria-label="Sonraki broşür"
            onClick={next}
            className="absolute top-1/2 right-3 md:right-5 -translate-y-1/2 grid place-items-center h-11 w-11 md:h-12 md:w-12 rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow,#F5D311)]"
            style={{
              background: "rgba(6,20,38,0.55)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Icon name="chevron_right" className="text-[26px]" />
          </button>

          {/* Progress dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${i + 1}. broşüre git`}
                aria-current={i === index}
                className="group relative h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow,#F5D311)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061426]"
                style={{
                  width: i === index ? 36 : 12,
                  background:
                    i === index
                      ? "var(--brand-yellow, #F5D311)"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                {i === index && autoplayActive ? (
                  <span
                    key={`p-${index}`}
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: "rgba(6,20,38,0.35)",
                      animation: `brochure-progress ${AUTOPLAY_MS}ms linear forwards`,
                    }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* Play / Pause toggle */}
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Otomatik oynatmayı başlat" : "Otomatik oynatmayı duraklat"}
            aria-pressed={userPaused}
            className="absolute bottom-5 right-4 md:bottom-6 md:right-6 grid place-items-center h-11 w-11 rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow,#F5D311)]"
            style={{
              background: "rgba(6,20,38,0.55)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Icon name={userPaused ? "play_arrow" : "pause"} className="text-[22px]" />
          </button>

          {/* Counter */}
          <div
            className="absolute top-5 right-5 hidden md:flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{
              background: "rgba(6,20,38,0.55)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span style={{ color: "var(--brand-yellow, #F5D311)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ opacity: 0.6 }}>/</span>
            <span style={{ opacity: 0.85 }}>{String(total).padStart(2, "0")}</span>
          </div>
        </>
      )}
      <style>{`@keyframes brochure-progress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}

export default BrochureSlider;