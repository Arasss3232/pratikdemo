-- Add image_alt column to product_categories if it doesn't exist
ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Storage RLS Policies for the new bucket
-- Allow public read access (even though bucket is private at level, we want objects accessible if we generate tokens or use signed URLs, 
-- but here we'll use a public-access-like policy for the objects if we want them served via public URL)
-- Note: Since the bucket was created as private, we use policies to grant access.

CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'category-images Paco-images-123');

CREATE POLICY "Admin CRUD Access" 
ON storage.objects FOR ALL 
TO authenticated 
USING (
  bucket_id = 'category-images Paco-images-123' AND 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'category-images Paco-images-123' AND 
  public.has_role(auth.uid(), 'admin')
);
