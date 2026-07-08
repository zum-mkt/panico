-- Título/descrição das páginas estáticas para /admin/seo — ver
-- 12-SEO_E_MARKETING.md. Seed com o texto que já estava fixo no código de
-- cada página, para o admin começar editando o que o site já mostra.

insert into public.settings (key, value)
values (
  'seo_pages',
  '{
    "home": {
      "title": "Cuidado, respeito e acolhimento em cada momento",
      "description": "Funerária Paníco: planos funerários, obituários, cemitério parque e atendimento 24h com serenidade e profissionalismo."
    },
    "planos": {
      "title": "Planos Funerários",
      "description": "Conheça os planos funerários da Paníco: assistência 24h, sem burocracia e com cobertura para toda a família."
    },
    "coroas": {
      "title": "Coroas de Flores",
      "description": "Catálogo de coroas de flores da Funerária Paníco, com encomenda rápida pelo WhatsApp."
    },
    "cemiterio": {
      "title": "Cemitério Parque",
      "description": "Conheça o Cemitério Parque Paníco: estrutura, galeria, localização e horários de funcionamento."
    },
    "obituarios": {
      "title": "Obituários",
      "description": "Consulte homenagens e informações de velório e sepultamento da Funerária Paníco."
    },
    "blog": {
      "title": "Blog",
      "description": "Conteúdos sobre luto, planejamento funerário e acolhimento da Funerária Paníco."
    },
    "contato": {
      "title": "Contato",
      "description": "Fale com a Funerária Paníco. Preencha o formulário e nossa equipe retorna o quanto antes."
    }
  }'::jsonb
)
on conflict (key) do nothing;
