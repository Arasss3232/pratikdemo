import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        
        const { data: settings } = await supabase
          .from("site_settings")
          .select("site_url, is_indexing_enabled, robots_txt")
          .eq("id", true)
          .single();
        
        const s = settings as any;
        
        if (s?.robots_txt) {
          return new Response(s.robots_txt, {
            headers: {
              "Content-Type": "text/plain",
              "Cache-Control": "public, max-age=3600",
            },
          });
        }

        const baseUrl = s?.site_url ? s.site_url.replace(/\/$/, "") : "https://GERCEK-ALAN-ADI";
        const isIndexing = s?.is_indexing_enabled !== false;
        
        const content = [
          "User-agent: *",
          isIndexing ? "Allow: /" : "Disallow: /",
          "Disallow: /admin",
          "Disallow: /giris",
          "Disallow: /portal",
          "",
          `Sitemap: ${baseUrl}/sitemap.xml`
        ].join("\n");

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
