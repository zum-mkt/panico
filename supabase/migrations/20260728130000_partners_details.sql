-- Mais informações por parceiro (foto e descrição da vantagem oferecida).
alter table public.partners
  add column photo_url text,
  add column description text;
