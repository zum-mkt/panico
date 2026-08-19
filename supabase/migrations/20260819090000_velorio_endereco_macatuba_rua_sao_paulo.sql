-- Endereço correto do Centro Velatório de Macatuba.

update public.page_sections
set content = jsonb_set(
  content,
  '{address}',
  '"Rua São Paulo, 9-04 — Centro"'
)
where id = '9f670ff5-7f72-4f81-9e53-e96dc9987426';
