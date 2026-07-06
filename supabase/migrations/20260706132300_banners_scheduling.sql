-- 15-SISTEMA_DE_BANNERS.md — a policy original só checava is_active,
-- sem respeitar o agendamento (starts_at/ends_at).

drop policy "active banners are publicly readable" on public.banners;

create policy "scheduled banners are publicly readable" on public.banners
  for select using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );
