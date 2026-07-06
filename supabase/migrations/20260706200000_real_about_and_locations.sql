-- Conteúdo real fornecido pelo cliente (site legado): texto da seção
-- "Sobre Nós" e as 3 unidades físicas (endereço, telefone, e-mail) exibidas
-- na página de Contato — ver 18-CONFIGURACOES_GERAIS.md ("Endereços").

update public.settings
set value = '{
  "title": "Sobre Nós",
  "text": "A Funerária Paníco surgiu com um objetivo bem definido de amenizar a dor que sentimos quando perdemos alguém que amamos.\n\nO falecimento, por si só, já é traumático para quem fica. Além da saudade, lidar com burocracias, despesas e outras obrigações torna esse momento ainda mais difícil.",
  "image_url": ""
}'::jsonb
where key = 'about';

insert into public.settings (key, value)
values (
  'locations',
  '[
    {
      "name": "Lençóis Paulista - SP",
      "address": "Rua Geraldo Pereira de Barros, 393 - Centro - 18682-041",
      "phone": "(14) 3269-1373",
      "email": "atendimento@funerariapanico.com"
    },
    {
      "name": "Lençóis Paulista - SP",
      "address": "Av. Jacomo Augusto Paccola, 2740 - Santa Terezinha - 18683-753",
      "phone": "(14) 3269-1373",
      "email": "atendimento@funerariapanico.com"
    },
    {
      "name": "Macatuba - SP",
      "address": "Avenida Coronel Virgilio Rocha, 18-05 - Centro - 17290-000",
      "phone": "(14) 3268-1291",
      "email": "atendimento@funerariapanico.com"
    }
  ]'::jsonb
)
on conflict (key) do update set value = excluded.value;
