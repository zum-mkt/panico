-- Adiciona itens de comparação com valor ("Atributo: valor") aos benefícios de
-- cada plano, extraídos do conteúdo já cadastrado em details_html. Itens sem
-- ":" continuam sendo a checklist de dependentes; itens com ":" alimentam a
-- nova tabela de "Principais diferenças" em /planos.
update public.plans
set benefits = benefits || '[
  "Urna: Modelo Bronze",
  "Flores nos vasos laterais: 2 vasos",
  "Transporte terrestre: até 125 km",
  "Assistência no velório: a cada 4 horas",
  "Tanatopraxia: Opcional",
  "Coroa de flores: Opcional"
]'::jsonb
where title = 'Bronze';

update public.plans
set benefits = benefits || '[
  "Urna: Modelo Bronze",
  "Flores nos vasos laterais: 4 vasos",
  "Transporte terrestre: até 150 km",
  "Assistência no velório: a cada 2 horas",
  "Tanatopraxia: Opcional",
  "Coroa de flores: Opcional"
]'::jsonb
where title = 'Prata';

update public.plans
set benefits = benefits || '[
  "Urna: Modelo Diamante",
  "Flores nos vasos laterais: 6 vasos",
  "Transporte terrestre: até 200 km",
  "Assistência no velório: a cada 2 horas",
  "Tanatopraxia: Especial inclusa",
  "Coroa de flores: Inclusa"
]'::jsonb
where title = 'Diamante';
