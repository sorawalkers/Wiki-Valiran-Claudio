-- FIX: Roda do Panteão — tipos, alinhamentos e limpeza do canon
-- Cole no SQL Editor do Supabase e clique em Run (tudo numa transação).
-- Gerado a partir dos ids reais da tabela deities (out/2026).
--
-- 1. Corrige Tipo/Alinhamento das divindades existentes (Alinhamento por extenso)
-- 2. Cria os 4 Aspectos da Realidade e Ingurax (entradas em compilação)
-- 3. Remove do canon Corellon, Pelor, Ioun, Kord, Bane e Tharizdun
--    (e os links "related" que apontavam para eles)

begin;

-- troca (ou acrescenta) uma linha {k, v} da ficha, preservando a ordem das demais
create or replace function pg_temp.vt_set_row(box jsonb, key text, val text) returns jsonb
language sql as $$
  select jsonb_set(coalesce(box, '{}'::jsonb), '{rows}',
    case when exists (select 1 from jsonb_array_elements(coalesce(box->'rows', '[]'::jsonb)) r where r->>'k' = key)
      then (select jsonb_agg(case when r->>'k' = key then jsonb_build_object('k', key, 'v', val) else r end order by o)
              from jsonb_array_elements(box->'rows') with ordinality t(r, o))
      else coalesce(box->'rows', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('k', key, 'v', val))
    end)
$$;

-- ── 1. Alinhamentos (por extenso; a roda lê também a sigla) ─────────
update deities d set infobox = pg_temp.vt_set_row(d.infobox, 'Alinhamento', v.alin)
from (values
  ('alara',             'Caótico Bondoso'),   -- era Neutro Bondoso
  ('lamidriel',         'Neutro Bondoso'),    -- era Leal Bondoso
  ('fyria',             'Neutro Maligno'),    -- era Caótico Maligno
  ('raegrar',           'Caótico Neutro'),    -- era Caótico Maligno
  ('sehanine',          'Caótico Bondoso'),   -- era Caótico Neutro
  ('melora',            'Neutro'),            -- era Neutro Bondoso
  ('senhora-da-rapina', 'Neutro'),            -- era Leal Neutro (decisão de canon)
  ('torog',             'Neutro Maligno'),    -- era Caótico Maligno
  ('athys',             'Leal Neutro'),       -- era Leal Bondoso (decisão de canon)
  ('naomi',             'Caótico Neutro'),    -- era Neutro Bondoso
  ('zehir',             'Caótico Maligno')    -- era Neutro Maligno (decisão de canon)
) as v(id, alin)
where d.id = v.id;

-- ── Tipos ──────────────────────────────────────────────────────────
update deities set infobox = pg_temp.vt_set_row(infobox, 'Tipo', 'Titã')      where id = 'asmodeus';  -- era Deus do Panteão (ex-Sangarzhortz)
update deities set infobox = pg_temp.vt_set_row(infobox, 'Tipo', 'Ascendido') where id = 'zehir';     -- era Deus do Panteão

-- ── 2. Novos registros ─────────────────────────────────────────────
insert into deities (id, name, epithet, sigil, infobox, hero, sections, related, placeholder) values
('luz',       'Luz',       'Aspecto da Realidade', null,
 '{"rows":[{"k":"Tipo","v":"Aspecto da Realidade"},{"k":"Alinhamento","v":"Bem"}]}'::jsonb,       null, '[]'::jsonb, '[]'::jsonb, true),
('destino',   'Destino',   'Aspecto da Realidade', null,
 '{"rows":[{"k":"Tipo","v":"Aspecto da Realidade"},{"k":"Alinhamento","v":"Caos"}]}'::jsonb,      null, '[]'::jsonb, '[]'::jsonb, true),
('escuridao', 'Escuridão', 'Aspecto da Realidade', null,
 '{"rows":[{"k":"Tipo","v":"Aspecto da Realidade"},{"k":"Alinhamento","v":"Mal"}]}'::jsonb,       null, '[]'::jsonb, '[]'::jsonb, true),
('tempo',     'Tempo',     'Aspecto da Realidade', null,
 '{"rows":[{"k":"Tipo","v":"Aspecto da Realidade"},{"k":"Alinhamento","v":"Lei"}]}'::jsonb,       null, '[]'::jsonb, '[]'::jsonb, true),
('ingurax',   'Ingurax',   null, null,
 '{"rows":[{"k":"Tipo","v":"Titã"},{"k":"Alinhamento","v":"Caótico Maligno"}]}'::jsonb,           null, '[]'::jsonb, '[]'::jsonb, true)
on conflict (id) do nothing;

-- ── 3. Removidos do canon ──────────────────────────────────────────
-- tira os links para eles das outras divindades (melora, gruumsh, zehir,
-- moradin, sehanine, vecna, lolth); o texto corrido não é alterado
update deities set related = coalesce((
  select jsonb_agg(r order by o)
  from jsonb_array_elements(related) with ordinality t(r, o)
  where r->>'target' not in ('deity:corellon','deity:pelor','deity:ioun','deity:kord','deity:bane','deity:tharizdun','deity:sangarzhortz')
), '[]'::jsonb)
where jsonb_typeof(related) = 'array'
  and related::text ~ 'deity:(corellon|pelor|ioun|kord|bane|tharizdun|sangarzhortz)"';

delete from deities where id in ('corellon','pelor','ioun','kord','bane','tharizdun','sangarzhortz');

commit;

-- conferência: tipo e alinhamento de todos
-- select id, name,
--   (select r->>'v' from jsonb_array_elements(infobox->'rows') r where r->>'k' = 'Tipo')        as tipo,
--   (select r->>'v' from jsonb_array_elements(infobox->'rows') r where r->>'k' = 'Alinhamento') as alinhamento
-- from deities order by id;
