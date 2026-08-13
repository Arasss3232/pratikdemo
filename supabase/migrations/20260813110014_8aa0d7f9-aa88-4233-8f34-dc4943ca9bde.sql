UPDATE public.site_settings SET google_search_console = NULL WHERE google_search_console = 'seo-verification-test-2026';

INSERT INTO public.page_seo (route_path, sitemap_include, no_index, sitemap_priority) VALUES 
('/', true, false, '1.0'),
('/kurumsal', true, false, '0.8'),
('/urunler', true, false, '0.8'),
('/iletisim', true, false, '0.5'),
('/admin', false, true, '0.0'),
('/giris', false, true, '0.0')
ON CONFLICT (route_path) DO UPDATE SET sitemap_include = EXCLUDED.sitemap_include, no_index = EXCLUDED.no_index;