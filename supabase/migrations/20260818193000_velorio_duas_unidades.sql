-- Página /velorio: duas unidades (Lençóis Paulista e Macatuba).
-- Mantém a galeria já publicada de Lençóis e adiciona a de Macatuba.

update public.page_sections
set position = 0,
    content = jsonb_build_object(
      'title', 'Centros Velatórios',
      'subtitle', 'Lençóis Paulista e Macatuba',
      'body', $vel$<p>O Grupo Funerário Paníco conta agora com dois Centros Velatórios: um em Lençóis Paulista e o novíssimo espaço inaugurado em agosto de 2026, em Macatuba.</p>
<p>São unidades modernas, novas e cuidadosamente planejadas para oferecer conforto, acolhimento e tranquilidade às famílias. Ambientes climatizados, salas reservadas e uma estrutura completa para que cada despedida aconteça com dignidade e serenidade.</p>
<p>Acolher é dar amparo, conforto e segurança na hora mais necessária. Em cada cidade, o espaço foi concebido para que os entes possam se reunir, se apoiar e prestar suas homenagens com todo o cuidado que o momento pede.</p>$vel$
    )
where id = '24fee700-2823-437c-8a80-ce968763d043';

update public.page_sections
set position = 1,
    content = jsonb_build_object(
      'title', 'Lençóis Paulista',
      'images', jsonb_build_array('https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/d0f40377-69ee-4d91-b07b-999f52e75a2e-v10.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/88caf376-a092-4bfa-b515-59a20f408d65-v7.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/b3c30e55-e5c6-4420-ac65-c973f164cab6-v6.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/eddbf86a-0d50-4c44-a2c8-13167e7230c8-v4.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/2ea1e985-526f-404b-be0c-186e30366b8d-v3.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/c75563b3-ce80-498b-ba51-c9754105508e-v2.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/4f7b21f0-2d9d-4c12-8fe1-7fbb93b17d87-v1.webp'),
      'links', '[]'::jsonb
    )
where id = '6ffa1d1e-f0d2-4518-b788-bda4aec8f388';

insert into public.page_sections (id, page_id, type, position, is_active, content)
values (
  '9f670ff5-7f72-4f81-9e53-e96dc9987426',
  '4286f866-82bc-4d89-a216-633ebd033117',
  'gallery',
  2,
  true,
  jsonb_build_object(
    'title', 'Macatuba',
    'images', jsonb_build_array('https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/45b60d88-47b1-41c1-bbb2-317118ba30f8-vel-macatuba-01-jpg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/3e55432a-eaa1-418c-988d-4c8b4bb74e3a-vel-macatuba-gemini-generated-image-4k26384k26384k26-.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/4aab9284-d84a-4fe4-b6ae-155fcd2521a1-vel-macatuba-gemini-generated-image-4k26384k26384k26-.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/6e883b41-9a90-42bd-968e-b12565aa03d8-vel-macatuba-15-05-21-2-jpeg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/371fd89b-8473-4c60-9a4f-d03a5ca026ad-vel-macatuba-2026-08-18-at-15-05-27-1-jpeg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/a5d2db83-0b17-47e2-ae67-2ce041ec3c77-vel-macatuba-2026-08-18-at-15-05-30-3-jpeg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/21a50441-8ca7-4df6-ad49-beb692f1a796-vel-macatuba-2026-08-18-at-15-05-33-2-jpeg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/69cda566-342a-4c49-b407-2da8731d745b-vel-macatuba-2026-08-18-at-15-05-35-jpeg.webp', 'https://zlfhmstvxuamukekeojy.supabase.co/storage/v1/object/public/gallery/87f2504d-0f68-4142-96bb-09602837afa1-vel-macatuba-2026-08-18-at-15-05-31-4-jpeg.webp'),
    'links', '[]'::jsonb
  )
)
on conflict (id) do update
set position = excluded.position,
    content = excluded.content,
    is_active = excluded.is_active;

update public.pages
set seo_title = 'Centros Velatórios em Lençóis Paulista e Macatuba',
    seo_description = 'Dois Centros Velatórios modernos da Funerária Paníco: Lençóis Paulista e o novíssimo espaço de Macatuba, inaugurado em agosto de 2026.'
where slug = 'velorio';
