-- 06-OBITUARIOS.md — inscrição pública para aviso por e-mail de novos óbitos.
-- Fase 1: apenas e-mail (WhatsApp fica para uma fase seguinte, mas o schema
-- já reserva espaço para não precisar reescrever nada).

-- ---------------------------------------------------------------------------
-- Idempotência: nunca notificar o mesmo obituário duas vezes.
-- ---------------------------------------------------------------------------

alter table public.obituaries add column notified_at timestamptz;

-- Backfill crítico: já existem milhares de obituários publicados antes
-- desta feature existir. Sem isso, o trigger/cron (criados mais abaixo)
-- veriam todos eles com notified_at NULL e tentariam notificar a base
-- inteira de inscritos sobre TODO o histórico assim que fossem ativados.
-- Marca tudo que já existe como "já notificado" — só óbitos publicados
-- DAQUI PRA FRENTE (ou passados por esta linha após o deploy) disparam aviso.
update public.obituaries set notified_at = now() where notified_at is null;

-- ---------------------------------------------------------------------------
-- Inscritos
-- ---------------------------------------------------------------------------

create table public.notification_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token uuid not null default gen_random_uuid(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index notification_subscribers_email_key
  on public.notification_subscribers (lower(email));

alter table public.notification_subscribers enable row level security;

create policy "anyone can subscribe" on public.notification_subscribers
  for insert to anon, authenticated
  with check (status = 'pending' and confirmed_at is null and unsubscribed_at is null);

create policy "staff can view subscribers" on public.notification_subscribers
  for select using (public.is_staff());
create policy "staff can delete subscribers" on public.notification_subscribers
  for delete using (public.is_staff());

-- Confirmação (double opt-in) e descadastro via token — nunca um UPDATE
-- direto exposto por RLS (não daria pra restringir o WHERE que o cliente
-- manda). A função pina a query no token, como is_staff() já faz hoje.

create or replace function public.confirm_subscription(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_subscribers
  set status = 'confirmed', confirmed_at = now()
  where confirm_token = token and status = 'pending' and unsubscribed_at is null;
  return found;
end;
$$;
grant execute on function public.confirm_subscription(uuid) to anon, authenticated;

create or replace function public.unsubscribe_subscription(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_subscribers
  set status = 'unsubscribed', unsubscribed_at = now()
  where unsubscribe_token = token and unsubscribed_at is null;
  return found;
end;
$$;
grant execute on function public.unsubscribe_subscription(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Histórico de disparos (visibilidade no admin — quantos e-mails saíram/
-- falharam por obituário). Escrito só pela Edge Function (service_role
-- ignora RLS), por isso não existe policy de insert.
-- ---------------------------------------------------------------------------

create table public.notification_runs (
  id uuid primary key default gen_random_uuid(),
  obituary_id uuid references public.obituaries (id) on delete set null,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  error text,
  created_at timestamptz not null default now()
);

alter table public.notification_runs enable row level security;

create policy "staff can view notification runs" on public.notification_runs
  for select using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Disparo: trigger (publicar agora) + varredura por cron (publicação
-- agendada, que hoje é só um filtro de leitura — nada dispara sozinho
-- quando a hora chega) chamando a mesma Edge Function.
-- ---------------------------------------------------------------------------

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- Segredo compartilhado entre Postgres e as Edge Functions, para a function
-- confirmar que a chamada veio do nosso próprio trigger/cron (a chave anon
-- já é pública no bundle do site, então não serve pra autenticar isso).
-- Gerado manualmente, fora desta migration:
--   select vault.create_secret('<valor aleatório>', 'obituary_webhook_secret');
-- (o MESMO valor precisa estar setado como secret da Edge Function
-- WEBHOOK_SHARED_SECRET.)

create or replace function public.trigger_obituary_notification()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  webhook_secret text;
begin
  if new.status = 'published'
     and (new.published_at is null or new.published_at <= now())
     and new.notified_at is null
  then
    select decrypted_secret into webhook_secret
      from vault.decrypted_secrets where name = 'obituary_webhook_secret';

    if webhook_secret is not null then
      perform net.http_post(
        url := 'https://zlfhmstvxuamukekeojy.supabase.co/functions/v1/notify-obituary-subscribers',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-webhook-secret', webhook_secret
        ),
        body := jsonb_build_object('obituary_id', new.id)
      );
    end if;
  end if;
  return new;
end;
$$;

create trigger obituaries_notify_on_publish
  after insert or update on public.obituaries
  for each row execute function public.trigger_obituary_notification();

create or replace function public.trigger_subscription_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  webhook_secret text;
begin
  select decrypted_secret into webhook_secret
    from vault.decrypted_secrets where name = 'obituary_webhook_secret';

  if webhook_secret is not null then
    perform net.http_post(
      url := 'https://zlfhmstvxuamukekeojy.supabase.co/functions/v1/send-subscription-confirmation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-secret', webhook_secret
      ),
      body := jsonb_build_object('subscriber_id', new.id)
    );
  end if;
  return new;
end;
$$;

create trigger notification_subscribers_send_confirmation
  after insert on public.notification_subscribers
  for each row execute function public.trigger_subscription_confirmation();

-- Varredura a cada 5 min: cobre obituários com published_at agendado (o
-- trigger acima só cobre o momento do INSERT/UPDATE) e serve de rede de
-- segurança caso o trigger falhe (pg_net é fire-and-forget, sem retry).
select cron.schedule(
  'obituary-notifications-sweep',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://zlfhmstvxuamukekeojy.supabase.co/functions/v1/notify-obituary-subscribers',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'obituary_webhook_secret'
      )
    ),
    body := jsonb_build_object('mode', 'scan')
  );
  $$
);
