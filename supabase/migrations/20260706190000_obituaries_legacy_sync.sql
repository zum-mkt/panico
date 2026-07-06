-- Suporte à sincronização automática com o sistema legado (MySQL/HostGator).
-- legacy_id guarda o obi_id da tabela ms_obituario para permitir upsert
-- idempotente (o script de sincronização só lê o MySQL, nunca escreve nele).

alter table public.obituaries
  add column legacy_id integer unique;

comment on column public.obituaries.legacy_id is
  'obi_id da tabela ms_obituario (sistema legado). Usado para upsert via sincronização automática, evitando duplicados.';
