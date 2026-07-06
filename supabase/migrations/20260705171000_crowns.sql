-- 08-COROAS.md — catálogo de coroas de flores.

create table public.crowns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  price numeric(12, 2),
  photos jsonb not null default '[]'::jsonb,
  allow_custom_message boolean not null default true,
  is_available boolean not null default true,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.crowns enable row level security;

create policy "active crowns are publicly readable" on public.crowns
  for select using (is_active);

create policy "staff can manage crowns" on public.crowns
  for all using (public.is_staff()) with check (public.is_staff());

insert into storage.buckets (id, name, public)
values ('crowns', 'crowns', true)
on conflict (id) do nothing;

create policy "public read for crowns bucket" on storage.objects
  for select using (bucket_id = 'crowns');

create policy "staff can upload to crowns bucket" on storage.objects
  for insert with check (bucket_id = 'crowns' and public.is_staff());

create policy "staff can update crowns bucket" on storage.objects
  for update using (bucket_id = 'crowns' and public.is_staff());

create policy "staff can delete from crowns bucket" on storage.objects
  for delete using (bucket_id = 'crowns' and public.is_staff());
