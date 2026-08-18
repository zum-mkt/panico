-- Comparativo de planos: urna dos planos Bronze e Prata deixa de se
-- chamar "Modelo Bronze" e passa a "Modelo Padrão".

update public.plans
set benefits = (
  select coalesce(jsonb_agg(
    case
      when item #>> '{}' = 'Urna: Modelo Bronze' then to_jsonb('Urna: Modelo Padrão'::text)
      else item
    end
  ), '[]'::jsonb)
  from jsonb_array_elements(benefits) as item
)
where title in ('Bronze', 'Prata');
