-- Add menu_type to navigation_items if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'navigation_items' AND column_name = 'menu_type') THEN
        ALTER TABLE public.navigation_items ADD COLUMN menu_type TEXT NOT NULL DEFAULT 'header';
    END IF;
END $$;

-- Update existing items to be 'header'
UPDATE public.navigation_items SET menu_type = 'header' WHERE menu_type IS NULL;

-- Seed some header items if empty
INSERT INTO public.navigation_items (label, route, display_order, menu_type, is_active)
SELECT 'Ana Sayfa', '/', 10, 'header', true
WHERE NOT EXISTS (SELECT 1 FROM public.navigation_items WHERE label = 'Ana Sayfa');

INSERT INTO public.navigation_items (label, route, display_order, menu_type, is_active)
SELECT 'Kurumsal', '/kurumsal', 20, 'header', true
WHERE NOT EXISTS (SELECT 1 FROM public.navigation_items WHERE label = 'Kurumsal');

INSERT INTO public.navigation_items (label, route, display_order, menu_type, is_active)
SELECT 'Ürün Kategorileri', '/urunler', 30, 'header', true
WHERE NOT EXISTS (SELECT 1 FROM public.navigation_items WHERE label = 'Ürün Kategorileri');

INSERT INTO public.navigation_items (label, route, display_order, menu_type, is_active)
SELECT 'İletişim', '/iletisim', 40, 'header', true
WHERE NOT EXISTS (SELECT 1 FROM public.navigation_items WHERE label = 'İletişim');
