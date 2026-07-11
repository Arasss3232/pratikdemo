
DROP POLICY IF EXISTS "anyone submits application" ON public.job_applications;
CREATE POLICY "anyone submits application" ON public.job_applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 2 AND 200
    AND length(email) BETWEEN 5 AND 320
    AND position('@' in email) > 1
  );

DROP POLICY IF EXISTS "anyone submits message" ON public.contact_messages;
CREATE POLICY "anyone submits message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    kvkk_accepted = true
    AND length(trim(name)) BETWEEN 2 AND 200
    AND length(email) BETWEEN 5 AND 320
    AND position('@' in email) > 1
    AND length(trim(message)) BETWEEN 2 AND 5000
  );

DROP POLICY IF EXISTS "anyone upload cv" ON storage.objects;
CREATE POLICY "anyone upload cv" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = 'cv'
    AND octet_length(name) < 500
  );
