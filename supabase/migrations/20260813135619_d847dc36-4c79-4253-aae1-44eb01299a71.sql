UPDATE public.page_sections 
SET is_active = false 
WHERE page_id = (SELECT id FROM public.site_pages WHERE route = '/kurumsal')
AND section_key IN ('intro', 'history');