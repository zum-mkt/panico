-- 16-CONSTRUTOR_DE_PAGINAS.md — a policy original de page_sections só
-- checava is_active, sem checar se a página pai está publicada. Isso
-- deixava blocos de páginas em rascunho legíveis via REST direto,
-- sabendo o page_id.

drop policy "active page sections are publicly readable" on public.page_sections;

create policy "sections of published pages are publicly readable" on public.page_sections
  for select using (
    is_active
    and exists (
      select 1 from public.pages p
      where p.id = page_sections.page_id and p.status = 'published'
    )
  );
