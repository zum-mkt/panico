-- 06-OBITUARIOS.md — idade do falecido (vem do legado como obi_idade).

alter table public.obituaries
  add column age smallint;
