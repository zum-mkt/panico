-- 02-SUPABASE_E_DATABASE.md — buckets
-- Todos os uploads devem ser enviados para o Storage (público para leitura,
-- já que são imagens do site institucional; escrita restrita à equipe).

insert into storage.buckets (id, name, public)
values
  ('hero', 'hero', true),
  ('banners', 'banners', true),
  ('services', 'services', true),
  ('plans', 'plans', true),
  ('obituaries', 'obituaries', true),
  ('cemetery', 'cemetery', true),
  ('gallery', 'gallery', true),
  ('blog', 'blog', true),
  ('partners', 'partners', true)
on conflict (id) do nothing;

create policy "public read for site buckets" on storage.objects
  for select using (
    bucket_id in (
      'hero', 'banners', 'services', 'plans', 'obituaries',
      'cemetery', 'gallery', 'blog', 'partners'
    )
  );

create policy "staff can upload to site buckets" on storage.objects
  for insert with check (
    bucket_id in (
      'hero', 'banners', 'services', 'plans', 'obituaries',
      'cemetery', 'gallery', 'blog', 'partners'
    )
    and public.is_staff()
  );

create policy "staff can update site buckets" on storage.objects
  for update using (
    bucket_id in (
      'hero', 'banners', 'services', 'plans', 'obituaries',
      'cemetery', 'gallery', 'blog', 'partners'
    )
    and public.is_staff()
  );

create policy "staff can delete from site buckets" on storage.objects
  for delete using (
    bucket_id in (
      'hero', 'banners', 'services', 'plans', 'obituaries',
      'cemetery', 'gallery', 'blog', 'partners'
    )
    and public.is_staff()
  );
