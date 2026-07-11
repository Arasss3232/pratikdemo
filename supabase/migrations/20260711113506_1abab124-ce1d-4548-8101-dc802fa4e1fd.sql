
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP POLICY "anyone can submit a quote" ON public.quote_requests;
CREATE POLICY "anon can submit guest quote" ON public.quote_requests
  FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "auth users submit their own quote" ON public.quote_requests
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
