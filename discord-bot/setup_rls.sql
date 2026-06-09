-- Permite que o bot (via service_role key) insira em system_entries
-- A service_role key já bypassa RLS por padrão no Supabase —
-- este script é opcional, mas garante que a política está correta.

-- Se quiser também permitir inserções autenticadas normais:
DROP POLICY IF EXISTS "Auth write" ON system_entries;
CREATE POLICY "Auth write" ON system_entries
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
