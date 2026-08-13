import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { fetchSiteSettings, type SiteSettings } from "../hooks/use-site-settings";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("DEBUG_ERROR_FULL:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'ssr',
    });
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Bu sayfa yüklenemedi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    return await fetchSiteSettings();
  },
  head: ({ loaderData }) => {
    const settings = loaderData as SiteSettings;
    const siteTitle = settings?.company_name 
      ? `${settings.company_name}${settings.title_suffix || " | Pratik Tedarik Yapı"}`
      : "Pratik Tedarik Yapı | Endüstriyel Ürün Grupları ve Teklif Çözümleri";
    
    const siteDesc = settings?.description || "Endüstriyel ürün gruplarını, güncel katalogları ve bayiliklerimizi inceleyin; ihtiyacınıza özel teklif talebinizi Pratik Tedarik Yapı’ya iletin.";
    
    const meta: any[] = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: settings?.company_name || "Pratik Tedarik Yapı" },
      { name: "theme-color", content: "#061426" },
      { name: "application-name", content: settings?.company_name || "Pratik Tedarik Yapı" },
      { name: "apple-mobile-web-app-title", content: settings?.company_name || "Pratik Tedarik Yapı" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: settings?.company_name || "Pratik Tedarik Yapı" },
      { property: "og:locale", content: "tr_TR" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: siteTitle },
      { property: "og:title", content: siteTitle },
      { name: "twitter:title", content: siteTitle },
      { name: "description", content: siteDesc },
      { property: "og:description", content: siteDesc },
      { name: "twitter:description", content: siteDesc },
    ];

    if (settings?.is_indexing_enabled === false) {
      meta.push({ name: "robots", content: "noindex, nofollow" });
    }

    if (settings?.google_search_console) {
      meta.push({ name: "google-site-verification", content: settings.google_search_console });
    }

    // Social & OG Images
    if (settings?.og_image_default) {
      meta.push({ property: "og:image", content: settings.og_image_default });
    }
    if (settings?.twitter_image_default) {
      meta.push({ name: "twitter:image", content: settings.twitter_image_default });
    }


    return {
      meta,
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: settings?.favicon_url || "/favicon.ico", sizes: "any" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: settings?.favicon_url || "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: settings?.favicon_url || "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: settings?.favicon_url || "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://lh3.googleusercontent.com", crossOrigin: "anonymous" },
        { rel: "dns-prefetch", href: "https://lh3.googleusercontent.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap",
        },
      ],
      scripts: [
        // Google Tag Manager
        ...(settings?.gtm_active && settings?.google_tag_manager_id ? [{
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');`
        }] : []),
        // Google Analytics 4
        ...(settings?.ga4_active && settings?.ga4_id ? [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`,
            async: true
          },
          {
            children: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.ga4_id}');`
          }
        ] : []),
        // JSON-LD Schema
        ...(settings?.schema_active ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${settings.site_url || ""}/#organization`,
                name: settings.company_name || "Pratik Tedarik Yapı",
                url: settings.site_url || "/",
                logo: settings.logo_url || "/android-chrome-512x512.png",
                description: siteDesc,
                contactPoint: {
                  "@type": "ContactPoint",
                  "telephone": settings.phone || "",
                  "contactType": "customer service"
                }
              },
              {
                "@type": "WebSite",
                "@id": `${settings.site_url || ""}/#website`,
                url: settings.site_url || "/",
                name: settings.company_name || "Pratik Tedarik Yapı",
                inLanguage: "tr-TR",
                publisher: { "@id": `${settings.site_url || ""}/#organization` },
              },
            ],
          }),
        }] : []),
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }}
      />
    </QueryClientProvider>
  );
}