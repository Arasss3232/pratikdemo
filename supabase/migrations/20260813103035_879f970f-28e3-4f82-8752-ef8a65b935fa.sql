GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests DISABLE ROW LEVEL SECURITY;