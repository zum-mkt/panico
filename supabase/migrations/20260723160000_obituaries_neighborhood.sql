-- 06-OBITUARIOS.md — bairro do falecido (vem do legado como obi_bairro).

alter table public.obituaries
  add column neighborhood text;
