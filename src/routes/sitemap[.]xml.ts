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
          .limit(1)
          .single();

        
        // Eğer site_url girilmemişse, sitemap üretme (güvenlik ve SEO sağlığı için)
        if (!settings?.site_url || settings.site_url.includes('lovable.app')) {
          return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Please configure a valid Production URL in SEO settings first.</error>", {
            status: 400,
            headers: { "Content-Type": "application/xml" },
          });
        }

        const baseUrl = settings.site_url.replace(/\/$/, ""); // Sondaki slash'ı temizle
        
        // page_seo tablosundan sitemap'e dahil edilecek sayfaları al
        const { data: pages } = await supabase
          .from("page_seo")
          .select("*")
          .eq("sitemap_include", true)
          .eq("no_index", false);

        const urls = (pages || []).map((page) => {
          const path = page.route_path.startsWith('/') ? page.route_path : `/${page.route_path}`;
          return [
            `  <url>`,
            `    <loc>${baseUrl}${path}</loc>`,
            page.sitemap_changefreq ? `    <changefreq>${page.sitemap_changefreq}</changefreq>` : `    <changefreq>monthly</changefreq>`,
            page.sitemap_priority ? `    <priority>${page.sitemap_priority}</priority>` : `    <priority>0.5</priority>`,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

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
