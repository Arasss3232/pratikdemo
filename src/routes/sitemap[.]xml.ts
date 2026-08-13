import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        
        // Settings'den site_url'i al
        const { data: settings } = await supabase
          .from("site_settings")
          .select("site_url")
          .eq("id", true)
          .single();
        
        const baseUrl = settings?.site_url || url.origin;
        
        // page_seo tablosundan sitemap'e dahil edilecek sayfaları al
        const { data: pages } = await supabase
          .from("page_seo")
          .select("*")
          .eq("sitemap_include", true)
          .eq("no_index", false);

        const urls = (pages || []).map((page) =>
          [
            `  <url>`,
            `    <loc>${baseUrl}${page.route_path}</loc>`,
            page.sitemap_changefreq ? `    <changefreq>${page.sitemap_changefreq}</changefreq>` : null,
            page.sitemap_priority ? `    <priority>${page.sitemap_priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n")
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
