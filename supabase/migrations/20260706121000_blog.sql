-- 11-BLOG.md — blog otimizado para SEO.

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  author_id uuid references public.users (id) on delete set null,
  author_name text,
  category text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

create policy "published posts are publicly readable" on public.blog_posts
  for select using (
    status = 'published' and (published_at is null or published_at <= now())
  );

create policy "staff can manage posts" on public.blog_posts
  for all using (public.is_staff()) with check (public.is_staff());
