-- 06-OBITUARIOS.md — backfill de spouse_name/children_names a partir do campo
-- message legado (cônjuge/filhos amontoados em texto pelo sync antigo, antes
-- de existirem colunas estruturadas). Só afeta registros ainda não ajustados
-- manualmente no admin (spouse_name e children_names ambos nulos), então
-- nenhum ajuste manual já feito é sobrescrito.

update public.obituaries
set
  spouse_name = case
    when message like 'Cônjuge:%' then trim(substring(split_part(message, E'\n', 1) from 10))
    else null
  end,
  children_names = case
    when message like 'Cônjuge:%' and position(E'\n' in message) > 0
      then trim(substring(message from position(E'\n' in message) + 1))
    when message not like 'Cônjuge:%' then trim(message)
    else null
  end,
  message = null
where message is not null
  and spouse_name is null
  and children_names is null;
