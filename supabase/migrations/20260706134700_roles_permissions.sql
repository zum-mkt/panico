-- 17-USUARIOS_E_PERMISSOES.md — perfis (Super Admin, Administrador,
-- Editor, Marketing, Atendimento) já existem na tabela public.users
-- desde a migration inicial. Esta migration corrige uma falha real:
-- a policy "users can update own profile" só checava `id = auth.uid()`
-- sem restringir quais colunas podiam mudar, então qualquer membro da
-- equipe podia se autopromover a super_admin com um UPDATE na própria
-- linha.

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and is_active and role = any(roles)
  );
$$;

-- Trigger: só super_admin pode alterar role/is_active de qualquer
-- usuário, inclusive o próprio (evita autopromoção).
create or replace function public.enforce_user_role_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.is_active is distinct from old.is_active) then
    if not public.has_role(array['super_admin']) then
      raise exception 'Apenas Super Admin pode alterar papel ou status de usuários.';
    end if;
  end if;
  return new;
end;
$$;

create trigger enforce_user_role_changes
  before update on public.users
  for each row execute function public.enforce_user_role_changes();

-- Permite que super_admin edite qualquer usuário (a policy existente só
-- cobria a própria linha).
create policy "super_admin can update any user" on public.users
  for update using (public.has_role(array['super_admin']));

create policy "super_admin can delete users" on public.users
  for delete using (public.has_role(array['super_admin']));
