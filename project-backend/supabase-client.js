// Supabase client — inicializado antes de qualquer JSX
(() => {
  const SUPABASE_URL = 'https://ytphxqybjxokokbnnbrz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cGh4cXlianhva29rYm5uYnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTUzMzgsImV4cCI6MjA5NDUzMTMzOH0.b8TdWF6DW_FEIdOi2QkP1CxWfPWytYUW2qkAPPodCzg';
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
