-- ============================================================
-- O Arquivo de Valiran — Schema Supabase
-- Execute no SQL Editor do painel Supabase
-- ============================================================

-- Profiles (roles de usuário — criado automaticamente no signup)
create table if not exists profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz default now()
);

-- Sessions (diário de sessões)
create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  num integer unique not null,
  date text,
  "dateShort" text,
  title text not null,
  location text,
  "locationDetail" text,
  duration text,
  session_xp text,
  summary text,
  "cast" jsonb default '[]',
  places jsonb default '[]',
  narrative jsonb default '[]',
  keypoints jsonb default '[]',
  loot jsonb default '[]',
  gmnote text,
  next text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Characters (personagens)
create table if not exists characters (
  id text primary key,
  name text not null,
  role text,
  tag text,
  "tagClass" text,
  infobox jsonb default '{}',
  hero text,
  sections jsonb default '[]',
  related jsonb default '[]',
  placeholder boolean default false,
  created_at timestamptz default now()
);

-- Deities (divindades)
create table if not exists deities (
  id text primary key,
  name text not null,
  epithet text,
  sigil text,
  infobox jsonb default '{}',
  hero text,
  sections jsonb default '[]',
  related jsonb default '[]',
  placeholder boolean default false
);

-- Timeline events (linha do tempo)
create table if not exists timeline_events (
  id uuid default gen_random_uuid() primary key,
  era text,
  year text,
  label text,
  title text,
  description text,
  tag text,
  kind text,
  sort_order integer default 0
);

-- Events (tabela de eventos da era)
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  year text,
  cat text,
  "catLabel" text,
  title text not null,
  "desc" text,
  region text,
  target text,
  sort_order integer default 0
);

-- Latest entries (feed de adições recentes)
create table if not exists latest_entries (
  id uuid default gen_random_uuid() primary key,
  entry_type text not null default 'new',
  type_label text not null default 'NOVO',
  date_label text,
  time_label text,
  title text not null,
  excerpt text,
  author text,
  target text,
  tag text,
  meta text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Migration: add new columns to existing latest_entries table
alter table latest_entries add column if not exists entry_type text not null default 'new';
alter table latest_entries add column if not exists type_label text not null default 'NOVO';
alter table latest_entries add column if not exists date_label text;
alter table latest_entries add column if not exists time_label text;
alter table latest_entries add column if not exists sort_order integer default 0;

-- Regions (mapa)
create table if not exists regions (
  id text primary key,
  name text not null,
  "type" text,
  "desc" text,
  stats jsonb default '[]',
  fill text,
  stroke text,
  d text,
  "labelX" float,
  "labelY" float,
  cursed boolean default false
);

-- Kingdoms (reinos)
create table if not exists kingdoms (
  id uuid default gen_random_uuid() primary key,
  sigil text,
  eyebrow text,
  name text not null,
  motto text,
  "desc" text,
  stats jsonb default '[]',
  target text,
  sort_order integer default 0
);

-- Factions (facções)
create table if not exists factions (
  id text primary key,
  name text not null,
  alias text,
  stamp text,
  "stampClass" text,
  rows jsonb default '[]',
  summary text,
  sort_order integer default 0
);

-- Image slots (mapeia slot id → URL pública no Storage)
create table if not exists image_slots (
  id text primary key,
  url text not null,
  updated_at timestamptz default now()
);

-- ============================================================
-- Supabase Storage — criar bucket manualmente no painel:
-- Dashboard → Storage → New bucket → nome: "media" → Public: ON
-- Isso permite URLs públicas para as imagens enviadas.
-- ============================================================

-- ============================================================
-- Row Level Security
-- ============================================================
alter table image_slots enable row level security;
alter table sessions enable row level security;
alter table characters enable row level security;
alter table deities enable row level security;
alter table timeline_events enable row level security;
alter table events enable row level security;
alter table latest_entries enable row level security;
alter table regions enable row level security;
alter table kingdoms enable row level security;
alter table factions enable row level security;
alter table profiles enable row level security;

-- Leitura pública (wiki aberto)
create policy "Leitura pública" on image_slots for select using (true);
create policy "Editores escrevem image_slots" on image_slots for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Leitura pública" on sessions for select using (true);
create policy "Leitura pública" on characters for select using (true);
create policy "Leitura pública" on deities for select using (true);
create policy "Leitura pública" on timeline_events for select using (true);
create policy "Leitura pública" on events for select using (true);
create policy "Leitura pública" on latest_entries for select using (true);
create policy "Leitura pública" on regions for select using (true);
create policy "Leitura pública" on kingdoms for select using (true);
create policy "Leitura pública" on factions for select using (true);
create policy "Leitura pública" on profiles for select using (true);

-- Escrita apenas para editores/admins
create policy "Editores escrevem sessions" on sessions for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem characters" on characters for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem deities" on deities for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem timeline_events" on timeline_events for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem events" on events for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem latest_entries" on latest_entries for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem regions" on regions for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem kingdoms" on kingdoms for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));
create policy "Editores escrevem factions" on factions for all
  using (auth.uid() in (select id from profiles where role in ('editor','admin')));

-- Trigger: cria perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Para promover o primeiro usuário a admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'seu@email.com';
-- ============================================================
