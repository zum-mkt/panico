-- A inscrição pública pede só o e-mail; o nome fica opcional.

alter table public.notification_subscribers
  alter column name set default '';

alter table public.notification_subscribers
  alter column name drop not null;
