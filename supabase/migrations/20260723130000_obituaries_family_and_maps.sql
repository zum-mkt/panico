-- 06-OBITUARIOS.md — dados da família e mapas exatos do Google Maps por local.

alter table public.obituaries
  add column spouse_name text,
  add column children_names text,
  add column wake_map_url text,
  add column burial_map_url text;
