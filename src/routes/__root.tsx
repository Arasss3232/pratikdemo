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
  useEffect(() => {
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Pratik Tedarik Yapı" },
      { name: "theme-color", content: "#061426" },
      { name: "application-name", content: "Pratik Tedarik Yapı" },
      { name: "apple-mobile-web-app-title", content: "Pratik Tedarik Yapı" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Pratik Tedarik Yapı" },
      { property: "og:locale", content: "tr_TR" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Pratik Tedarik Yapı | Endüstriyel Ürün Grupları ve Teklif Çözümleri" },
      { property: "og:title", content: "Pratik Tedarik Yapı | Endüstriyel Ürün Grupları ve Teklif Çözümleri" },
      { name: "twitter:title", content: "Pratik Tedarik Yapı | Endüstriyel Ürün Grupları ve Teklif Çözümleri" },
      { name: "description", content: "Endüstriyel ürün gruplarını, güncel katalogları ve bayiliklerimizi inceleyin; ihtiyacınıza özel teklif talebinizi Pratik Tedarik Yapı’ya iletin." },
      { property: "og:description", content: "Endüstriyel ürün gruplarını, güncel katalogları ve bayiliklerimizi inceleyin; ihtiyacınıza özel teklif talebinizi Pratik Tedarik Yapı’ya iletin." },
      { name: "twitter:description", content: "Endüstriyel ürün gruplarını, güncel katalogları ve bayiliklerimizi inceleyin; ihtiyacınıza özel teklif talebinizi Pratik Tedarik Yapı’ya iletin." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7bffd58-c723-417c-aeba-650e302ab34e/id-preview-93e539a0--9e9292e2-586e-4a0c-bd4d-0f3fd746a285.lovable.app-1783768358335.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f7bffd58-c723-417c-aeba-650e302ab34e/id-preview-93e539a0--9e9292e2-586e-4a0c-bd4d-0f3fd746a285.lovable.app-1783768358335.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "/#organization",
              name: "Pratik Tedarik Yapı",
              url: "/",
              logo: "/android-chrome-512x512.png",
              description:
                "Endüstriyel ürün grupları, güncel kataloglar ve profesyonel teklif çözümleri sunan kurumsal tedarik platformu.",
            },
            {
              "@type": "WebSite",
              "@id": "/#website",
              url: "/",
              name: "Pratik Tedarik Yapı",
              inLanguage: "tr-TR",
              publisher: { "@id": "/#organization" },
            },
          ],
        }),
      },
    ],
  }),
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
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
