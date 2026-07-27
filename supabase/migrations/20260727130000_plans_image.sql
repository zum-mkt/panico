-- Permite anexar uma imagem ao plano (exibida no card do site).
alter table public.plans
  add column image_url text;
