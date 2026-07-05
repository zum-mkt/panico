-- Conteúdo de exemplo para validar a Home visualmente.
-- Substitua pelo conteúdo real via /admin quando o CMS estiver pronto.
-- Idempotente: seguro rodar mais de uma vez (usa `where not exists`
-- porque estas tabelas não têm uma chave natural única).

insert into public.settings (key, value) values
  ('site', jsonb_build_object(
    'phone', '(11) 4000-0000',
    'whatsapp', '5511900000000',
    'address', 'Av. Principal, 1000 — São Paulo, SP',
    'instagram', 'https://instagram.com',
    'facebook', 'https://facebook.com'
  )),
  ('about', jsonb_build_object(
    'title', 'Tradição e cuidado há mais de 25 anos',
    'text', 'A Funerária Paníco acompanha famílias nos momentos mais delicados com serenidade, respeito e estrutura completa — do velório ao sepultamento.',
    'image_url', ''
  ))
on conflict (key) do nothing;

insert into public.services (title, description, icon, position)
select * from (values
  ('Velório', 'Salas confortáveis e equipadas para receber familiares e amigos.', 'Church', 1),
  ('Sepultamento', 'Cuidamos de toda a organização e documentação necessária.', 'Flower2', 2),
  ('Remoção e Traslado', 'Atendimento 24h para remoção em qualquer horário.', 'Truck', 3),
  ('Assistência a Planos', 'Suporte completo para famílias com plano contratado.', 'ShieldCheck', 4)
) as v(title, description, icon, position)
where not exists (select 1 from public.services s where s.title = v.title);

insert into public.plans (title, description, price, benefits, is_featured, position)
select * from (values
  ('Essencial', 'Cobertura básica para você e sua família.', 49.90,
   '["Assistência 24h", "Urna padrão", "Velório incluso"]'::jsonb, false, 1),
  ('Completo', 'Nosso plano mais contratado, com cobertura ampliada.', 89.90,
   '["Assistência 24h", "Urna especial", "Velório incluso", "Translado sem limite de km"]'::jsonb, true, 2),
  ('Família', 'Proteção completa para até 4 dependentes.', 149.90,
   '["Assistência 24h", "Urna especial", "Velório incluso", "4 dependentes"]'::jsonb, false, 3)
) as v(title, description, price, benefits, is_featured, position)
where not exists (select 1 from public.plans p where p.title = v.title);

insert into public.testimonials (author_name, content, rating, position)
select * from (values
  ('Maria Souza', 'Fomos muito bem acolhidos em um momento difícil. Equipe atenciosa do início ao fim.', 5, 1),
  ('João Pereira', 'Profissionalismo e respeito em todos os detalhes.', 5, 2),
  ('Ana Lima', 'Recomendo pela seriedade e cuidado com a família.', 5, 3)
) as v(author_name, content, rating, position)
where not exists (select 1 from public.testimonials t where t.author_name = v.author_name);

insert into public.faq (question, answer, context, position)
select * from (values
  ('Como funciona o atendimento 24h?', 'Nossa central está disponível todos os dias, a qualquer hora, pelo telefone e WhatsApp.', 'home', 1),
  ('Como contratar um plano?', 'Entre em contato pelo telefone ou WhatsApp e nossa equipe apresenta as opções disponíveis.', 'home', 2),
  ('Como emitir a segunda via de um plano?', 'Acesse a Área do Cliente com seu login para emitir a segunda via.', 'home', 3)
) as v(question, answer, context, position)
where not exists (
  select 1 from public.faq f where f.question = v.question and f.context = v.context
);

insert into public.partners (name, position)
select * from (values
  ('Parceiro 1', 1),
  ('Parceiro 2', 2),
  ('Parceiro 3', 3)
) as v(name, position)
where not exists (select 1 from public.partners p where p.name = v.name);
