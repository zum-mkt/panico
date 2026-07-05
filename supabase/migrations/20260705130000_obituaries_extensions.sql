-- 06-OBITUARIOS.md — agendamento de publicação e mensagens de homenagem.

alter table public.obituaries
  add column published_at timestamptz;

drop policy "published obituaries are publicly readable" on public.obituaries;

create policy "published obituaries are publicly readable" on public.obituaries
  for select using (
    status = 'published' and (published_at is null or published_at <= now())
  );

create table public.obituary_messages (
  id uuid primary key default gen_random_uuid(),
  obituary_id uuid not null references public.obituaries (id) on delete cascade,
  author_name text not null,
  message text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.obituary_messages enable row level security;

create policy "approved messages are publicly readable" on public.obituary_messages
  for select using (is_approved);

create policy "anyone can submit a homage message" on public.obituary_messages
  for insert with check (true);

create policy "staff can manage messages" on public.obituary_messages
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff can delete messages" on public.obituary_messages
  for delete using (public.is_staff());
