DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;

CREATE POLICY "Public can submit quote requests"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (contact_name IS NOT NULL) AND 
  (email IS NOT NULL) AND 
  (status = 'pending')
);