
-- Public read for the whole 'media' bucket EXCEPT the cv/ prefix
CREATE POLICY "media public read (non-cv)" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] IS DISTINCT FROM 'cv');

-- Admins can view CVs
CREATE POLICY "admins view cvs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'cv' AND has_role(auth.uid(), 'admin'::app_role));

-- Anyone (including anon job applicants) can upload to cv/
CREATE POLICY "anyone upload cv" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'cv');

-- Admins upload/manage everything else in media bucket
CREATE POLICY "admins upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));
