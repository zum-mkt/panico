-- Conteúdo detalhado exibido no modal ao clicar em um card de serviço na home.
alter table public.services
  add column content_html text;
