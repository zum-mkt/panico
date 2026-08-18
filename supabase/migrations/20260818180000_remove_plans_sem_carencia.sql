-- A seção "Por que contratar" em /planos vinha com "Sem carência".
-- Os planos têm carência — o item não pode permanecer no site.

update public.settings
set value = (
  select coalesce(jsonb_agg(item), '[]'::jsonb)
  from jsonb_array_elements(value) as item
  where item->>'title' is distinct from 'Sem carência'
)
where key = 'plans_benefits';
