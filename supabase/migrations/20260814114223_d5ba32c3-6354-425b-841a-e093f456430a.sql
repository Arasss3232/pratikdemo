INSERT INTO public.site_content (page_name, section_key, content_value)
VALUES 
('top_bar', 'info', '{"working_hours": "Pzt - Cmt: 08:30 - 18:30", "address": "İkitelli OSB, İstanbul", "phone": "+90 (212) 123 45 67", "whatsapp_link": "https://wa.me/905000000000"}')
ON CONFLICT (page_name, section_key) DO NOTHING;