DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;

CREATE POLICY "Public can submit quote requests"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ensure correct grants
GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT ALL ON public.quote_requests TO service_role;