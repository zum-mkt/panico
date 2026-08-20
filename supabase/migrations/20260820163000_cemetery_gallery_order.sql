-- Galeria: fachada em primeiro; estátua reenviada na orientação vertical.

update public.cemetery
set content = jsonb_set(
  content,
  '{images}',
  '[
    "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/hero/f631df38-7a46-4439-a20a-5338142ae103-cemiterio-facade.webp",
    "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/0e7bfc0b-e39a-449d-bfac-d7c0e76857c6-cemiterio-path.webp",
    "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/3281bd45-0655-4306-854a-0b363dbd8e77-cemiterio-lawn.webp",
    "https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/8481f3ee-4a10-4a04-80c4-c0ad98ed4fa9-cemiterio-statue.webp"
  ]'::jsonb
)
where section = 'gallery';
