-- Vários serviços caíram com o ícone padrão (Church) por falta de opção mais
-- específica no seletor do admin. Agora que existem ícones novos no mapa do
-- front-end (Flame, Users, Sparkles, Megaphone, BookOpen), ajusta os
-- registros afetados para usar um ícone distinto e mais representativo.
update public.services set icon = 'Flame' where title = 'Cremação';
update public.services set icon = 'Users' where title = 'Cerimonial de Despedida';
update public.services set icon = 'Sparkles' where title = 'Decoração da Capela';
update public.services set icon = 'Megaphone' where title = 'Divulgação do Falecimento';
update public.services set icon = 'BookOpen' where title = 'Missa de 7º dia';
