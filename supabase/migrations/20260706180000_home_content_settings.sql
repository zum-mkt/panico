-- Home antes tinha Hero, Atalhos, bloco do Cemitério e CTA final com texto
-- fixo no componente — ver 05-HOME_PAGE.md ("Cada seção deve ser um
-- componente independente e administrável via CMS"). Este seed cria as
-- chaves em `settings` com o conteúdo que já estava no ar, para que o
-- admin (/admin/home) comece editando o que o visitante já vê.

insert into public.settings (key, value)
values
  (
    'home_hero',
    '{
      "eyebrow": "Funerária Paníco",
      "title": "Cuidado, respeito e acolhimento em cada momento",
      "description": "Estamos ao seu lado com serenidade e profissionalismo, 24 horas por dia.",
      "image_url": "/hero-placeholder.svg",
      "primary_label": "Ver planos",
      "primary_href": "/planos",
      "secondary_label": "Atendimento 24h",
      "secondary_href": "tel:+551140000000"
    }'::jsonb
  ),
  (
    'home_shortcuts',
    '[
      {"label": "Obituários", "href": "/obituarios", "icon": "HeartHandshake"},
      {"label": "Atendimento 24h", "href": "tel:+551140000000", "icon": "Phone"},
      {"label": "Segunda Via", "href": "/area-do-cliente", "icon": "IdCard"},
      {"label": "Planos", "href": "/planos", "icon": "ClipboardList"},
      {"label": "Coroas", "href": "/coroas", "icon": "Flower2"},
      {"label": "Localização", "href": "#localizacao", "icon": "MapPin"}
    ]'::jsonb
  ),
  (
    'home_cemetery_teaser',
    '{
      "eyebrow": "Cemitério Parque",
      "title": "Um espaço de paz e memória",
      "description": "Estrutura completa, jardins cuidados e localização de fácil acesso para toda a família.",
      "cta_label": "Conhecer o Cemitério Parque"
    }'::jsonb
  ),
  (
    'home_cta',
    '{
      "title": "Estamos aqui para ajudar, a qualquer hora",
      "description": "Fale agora com nossa equipe pelo telefone ou WhatsApp."
    }'::jsonb
  )
on conflict (key) do nothing;
