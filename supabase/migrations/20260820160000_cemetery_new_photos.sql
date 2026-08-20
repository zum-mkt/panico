-- Novas fotos do Cemitério Parque Irmãos Panico (hero, história e galeria).

update public.settings
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{image_url}',
  '"https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/hero/f631df38-7a46-4439-a20a-5338142ae103-cemiterio-facade.webp"'
)
where key = 'cemiterio_hero';

update public.settings
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{image_url}',
  '"https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/hero/f631df38-7a46-4439-a20a-5338142ae103-cemiterio-facade.webp"'
)
where key = 'home_cemetery_teaser';

update public.cemetery
set content = jsonb_set(
  content,
  '{image_url}',
  '"https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/270db6e1-7622-45e8-bac1-a15c3341042a-cemiterio-panorama.webp"'
)
where section = 'history';

insert into public.cemetery (section, position, is_active, content)
select 'gallery', 3, true, '{
    "images": [
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/0e7bfc0b-e39a-449d-bfac-d7c0e76857c6-cemiterio-path.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/3281bd45-0655-4306-854a-0b363dbd8e77-cemiterio-lawn.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/d47db549-52b0-4479-9e49-83c49f538ded-cemiterio-statue.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/hero/f631df38-7a46-4439-a20a-5338142ae103-cemiterio-facade.webp"
    ]
  }'::jsonb
where not exists (select 1 from public.cemetery where section = 'gallery');

update public.cemetery
set content = '{
    "images": [
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/0e7bfc0b-e39a-449d-bfac-d7c0e76857c6-cemiterio-path.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/3281bd45-0655-4306-854a-0b363dbd8e77-cemiterio-lawn.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/d47db549-52b0-4479-9e49-83c49f538ded-cemiterio-statue.webp",
      "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/hero/f631df38-7a46-4439-a20a-5338142ae103-cemiterio-facade.webp"
    ]
  }'::jsonb,
    is_active = true,
    position = 3
where section = 'gallery';
