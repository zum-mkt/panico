-- Chave 'marketing' nunca foi semeada, causando 406 (0 linhas) em toda
-- página pública ao consultar getSetting("marketing") — ver
-- src/components/seo/MarketingScripts.tsx e 12-SEO_E_MARKETING.md.

insert into public.settings (key, value)
values ('marketing', '{}'::jsonb)
on conflict (key) do nothing;
