import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        
        // Settings'den site_url'i al
        const { data: settings } = await supabase
          .from("site_settings")
          .select("site_url, is_indexing_enabled")
          .eq("id", true)
          .single();
        
        const baseUrl = settings?.site_url || url.origin;
        const isIndexing = settings?.is_indexing_enabled !== false;
        
        const content = [
          "User-agent: *",
          isIndexing ? "Allow: /" : "Disallow: /",
          "Disallow: /admin",
          "Disallow: /giris",
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
