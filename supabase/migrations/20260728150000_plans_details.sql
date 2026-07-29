-- Conteúdo detalhado por plano, exibido em uma seção expansível no card,
-- na página /planos (não confundir com "description", o resumo curto).
alter table public.plans
  add column details_html text;
