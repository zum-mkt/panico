-- 02-SUPABASE_E_DATABASE.md — tabelas iniciais
-- Todo texto, imagem, botão, SEO e ordem de exibição devem vir do banco.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- users (equipe com acesso ao /admin — ver 17-USUARIOS_E_PERMISSOES.md)
-- ---------------------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'editor'
    check (role in ('super_admin', 'administrador', 'editor', 'marketing', 'atendimento')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and is_active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- settings (configurações globais — ver 18-CONFIGURACOES_GERAIS.md)
-- ---------------------------------------------------------------------------

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- menus
-- ---------------------------------------------------------------------------

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  parent_id uuid references public.menus (id) on delete cascade,
  position integer not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- pages + page_sections (construtor de páginas — ver 16-CONSTRUTOR_DE_PAGINAS.md)
-- ---------------------------------------------------------------------------

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  content jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.page_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- banners — ver 15-SISTEMA_DE_BANNERS.md
-- ---------------------------------------------------------------------------

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_desktop_url text,
  image_tablet_url text,
  image_mobile_url text,
  link_url text,
  cta_label text,
  position integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- services — seção "Serviços" da Home (05-HOME_PAGE.md)
-- ---------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  image_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- plans — ver 07-PLANOS_FUNERARIOS.md
-- ---------------------------------------------------------------------------

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(12, 2),
  benefits jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  position integer not null default 0,
  is_active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- obituaries — ver 06-OBITUARIOS.md
-- ---------------------------------------------------------------------------

create table public.obituaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  deceased_at date not null,
  wake_location text,
  wake_at timestamptz,
  burial_location text,
  burial_at timestamptz,
  message text,
  status text not null default 'published' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- cemetery — blocos de conteúdo da página Cemitério Parque (09-CEMITERIO_PARQUE.md)
-- ---------------------------------------------------------------------------

create table public.cemetery (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  content jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  link_url text,
  position integer not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_photo_url text,
  content text not null,
  rating smallint check (rating between 1 and 5),
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- faq
-- ---------------------------------------------------------------------------

create table public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  context text,
  position integer not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- media — biblioteca de mídia (14-BIBLIOTECA_DE_MIDIA.md)
-- ---------------------------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  url text not null,
  alt_text text,
  tags text[] not null default '{}',
  folder text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.settings enable row level security;
alter table public.menus enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.banners enable row level security;
alter table public.services enable row level security;
alter table public.plans enable row level security;
alter table public.obituaries enable row level security;
alter table public.cemetery enable row level security;
alter table public.partners enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq enable row level security;
alter table public.media enable row level security;

-- users: staff enxerga a equipe toda; cada um edita o próprio perfil.
create policy "staff can view users" on public.users
  for select using (public.is_staff());
create policy "users can update own profile" on public.users
  for update using (id = auth.uid());

-- settings: público (telefones, endereços, redes sociais precisam ser lidos pelo site).
create policy "settings are publicly readable" on public.settings
  for select using (true);
create policy "staff can manage settings" on public.settings
  for all using (public.is_staff()) with check (public.is_staff());

-- conteúdo público: leitura liberada, escrita só para staff.
create policy "menus are publicly readable" on public.menus
  for select using (is_active);
create policy "staff can manage menus" on public.menus
  for all using (public.is_staff()) with check (public.is_staff());

create policy "published pages are publicly readable" on public.pages
  for select using (status = 'published');
create policy "staff can manage pages" on public.pages
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active page sections are publicly readable" on public.page_sections
  for select using (is_active);
create policy "staff can manage page sections" on public.page_sections
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active banners are publicly readable" on public.banners
  for select using (is_active);
create policy "staff can manage banners" on public.banners
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active services are publicly readable" on public.services
  for select using (is_active);
create policy "staff can manage services" on public.services
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active plans are publicly readable" on public.plans
  for select using (is_active);
create policy "staff can manage plans" on public.plans
  for all using (public.is_staff()) with check (public.is_staff());

create policy "published obituaries are publicly readable" on public.obituaries
  for select using (status = 'published');
create policy "staff can manage obituaries" on public.obituaries
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active cemetery sections are publicly readable" on public.cemetery
  for select using (is_active);
create policy "staff can manage cemetery" on public.cemetery
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active partners are publicly readable" on public.partners
  for select using (is_active);
create policy "staff can manage partners" on public.partners
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active testimonials are publicly readable" on public.testimonials
  for select using (is_active);
create policy "staff can manage testimonials" on public.testimonials
  for all using (public.is_staff()) with check (public.is_staff());

create policy "active faq are publicly readable" on public.faq
  for select using (is_active);
create policy "staff can manage faq" on public.faq
  for all using (public.is_staff()) with check (public.is_staff());

create policy "media is publicly readable" on public.media
  for select using (true);
create policy "staff can manage media" on public.media
  for all using (public.is_staff()) with check (public.is_staff());
