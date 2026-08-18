-- Endereços das unidades na página /velorio.

update public.page_sections
set content = jsonb_set(
  content,
  '{address}',
  '"R. Geraldo Pereira de Barros, 310 — Centro"'
)
where id = '6ffa1d1e-f0d2-4518-b788-bda4aec8f388';

update public.page_sections
set content = jsonb_set(
  content,
  '{address}',
  '"R. Geraldo Pereira de Barros"'
)
where id = '9f670ff5-7f72-4f81-9e53-e96dc9987426';
