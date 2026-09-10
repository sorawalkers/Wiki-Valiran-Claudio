-- Fix spelling: Lidhaven → Lindhaven
-- Run once in Supabase SQL Editor

-- characters: diego (role, infobox, sections, related)
UPDATE characters
SET
  role     = replace(role,     'Lidhaven', 'Lindhaven'),
  infobox  = replace(infobox::text, 'Lidhaven', 'Lindhaven')::jsonb,
  sections = replace(sections::text, 'Lidhaven', 'Lindhaven')::jsonb,
  related  = replace(related::text,  'Lidhaven', 'Lindhaven')::jsonb
WHERE id = 'diego-vans-loupd-or';

-- characters: lawrence (sections)
UPDATE characters
SET
  sections = replace(sections::text, 'Lidhaven', 'Lindhaven')::jsonb
WHERE id = 'lawrence-cainhurst';

-- characters: john (sections)
UPDATE characters
SET
  sections = replace(sections::text, 'Lidhaven', 'Lindhaven')::jsonb
WHERE id = 'john';

-- deities: vofureon (sections)
UPDATE deities
SET
  sections = replace(sections::text, 'Lidhaven', 'Lindhaven')::jsonb
WHERE id = 'vofureon';

-- timeline_events
UPDATE timeline_events
SET
  title       = replace(title,       'Lidhaven', 'Lindhaven'),
  description = replace(description, 'Lidhaven', 'Lindhaven'),
  tag         = replace(tag,         'Lidhaven', 'Lindhaven')
WHERE title       ILIKE '%Lidhaven%'
   OR description ILIKE '%Lidhaven%'
   OR tag         ILIKE '%Lidhaven%';
