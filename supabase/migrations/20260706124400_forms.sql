-- 13-FORMULARIOS.md — construtor de formulários dinâmicos.

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  fields jsonb not null default '[]'::jsonb,
  notify_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.forms enable row level security;
alter table public.form_submissions enable row level security;

create policy "active forms are publicly readable" on public.forms
  for select using (is_active);
create policy "staff can manage forms" on public.forms
  for all using (public.is_staff()) with check (public.is_staff());

create policy "anyone can submit a form" on public.form_submissions
  for insert with check (true);
create policy "staff can view submissions" on public.form_submissions
  for select using (public.is_staff());
create policy "staff can delete submissions" on public.form_submissions
  for delete using (public.is_staff());
