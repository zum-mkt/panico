-- 10-AREA_DO_CLIENTE.md — login próprio (Supabase Auth), carteirinha
-- digital, dependentes, histórico, downloads e atualização cadastral.
-- RLS obrigatória: cada cliente só acessa os próprios dados; a equipe
-- (is_staff) acessa tudo.

create table public.clients (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  cpf text,
  plan_id uuid references public.plans (id) on delete set null,
  card_number text not null default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  member_since date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.client_dependents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  birth_date date,
  relationship text,
  created_at timestamptz not null default now()
);

create table public.client_documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table public.client_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  description text not null,
  occurred_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.client_dependents enable row level security;
alter table public.client_documents enable row level security;
alter table public.client_history enable row level security;

-- clients: cadastro é feito pelo próprio cliente (signup); equipe gerencia tudo.
create policy "clients can view own profile" on public.clients
  for select using (id = auth.uid() or public.is_staff());
create policy "clients can create own profile" on public.clients
  for insert with check (id = auth.uid());
create policy "clients can update own profile" on public.clients
  for update using (id = auth.uid() or public.is_staff());
create policy "staff can delete clients" on public.clients
  for delete using (public.is_staff());

-- dependentes: o próprio cliente administra os seus.
create policy "clients manage own dependents" on public.client_dependents
  for all
  using (client_id = auth.uid() or public.is_staff())
  with check (client_id = auth.uid() or public.is_staff());

-- documentos e histórico: somente leitura para o cliente, gerenciados pela equipe.
create policy "clients view own documents" on public.client_documents
  for select using (client_id = auth.uid() or public.is_staff());
create policy "staff manage documents" on public.client_documents
  for insert with check (public.is_staff());
create policy "staff update documents" on public.client_documents
  for update using (public.is_staff());
create policy "staff delete documents" on public.client_documents
  for delete using (public.is_staff());

create policy "clients view own history" on public.client_history
  for select using (client_id = auth.uid() or public.is_staff());
create policy "staff manage history" on public.client_history
  for insert with check (public.is_staff());
create policy "staff update history" on public.client_history
  for update using (public.is_staff());
create policy "staff delete history" on public.client_history
  for delete using (public.is_staff());

-- Storage: documentos pessoais — bucket privado, acesso via signed URL.
insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;

create policy "clients read own documents" on storage.objects
  for select using (
    bucket_id = 'client-documents'
    and (public.is_staff() or (storage.foldername(name))[1] = auth.uid()::text)
  );

create policy "staff upload client documents" on storage.objects
  for insert with check (bucket_id = 'client-documents' and public.is_staff());

create policy "staff delete client documents" on storage.objects
  for delete using (bucket_id = 'client-documents' and public.is_staff());
