-- 07-PLANOS_FUNERARIOS.md — cor e CTA por plano.

alter table public.plans
  add column color text,
  add column cta_label text,
  add column cta_url text;
