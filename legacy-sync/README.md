# Sincronização com o sistema legado (ms_obituario)

Puxa os obituários do banco MySQL antigo (HostGator/cPanel, tabela
`ms_obituario`) para a tabela `obituaries` do Supabase (novo site).

- **Só leitura** no MySQL — o script nunca faz `INSERT`/`UPDATE`/`ALTER` em
  `ms_obituario`.
- **Idempotente** — usa a coluna `legacy_id` (= `obi_id`) para fazer upsert no
  Supabase, então rodar de novo não duplica nada.
- **Incremental** — guarda em `state.json` o maior `obi_id` já sincronizado,
  então cada execução só busca os registros novos.

## 1. Rodar a migration no Supabase

Antes de tudo, aplique a migration `20260706190000_obituaries_legacy_sync.sql`
(adiciona a coluna `legacy_id` na tabela `obituaries`).

## 2. Subir os arquivos no HostGator

Envie a pasta `legacy-sync/` para o mesmo servidor/hospedagem onde está o
`ms_obituario` (ex: via File Manager do cPanel ou FTP), fora da pasta pública
(`public_html`), para que ninguém acesse os arquivos por URL.

## 3. Configurar credenciais

Copie `config.example.php` para `config.php` (mesma pasta) e preencha:

- **mysql**: mesmas credenciais que você usa no phpMyAdmin (host geralmente
  `localhost`, já que o script roda no mesmo servidor do banco).
- **supabase.url**: URL do seu projeto (Project Settings > API).
- **supabase.service_role_key**: Service Role Key (Project Settings > API).
  Essa chave tem acesso total ao banco — nunca a coloque no frontend, só aqui.

`config.php` já está no `.gitignore` do projeto principal — não commitar.

## 4. Conferir o mapeamento de colunas

Em `sync-obituarios.php`, a função `map_row()` mapeia as colunas do MySQL para
os campos do Supabase:

| MySQL (`ms_obituario`)      | Supabase (`obituaries`) |
|------------------------------|--------------------------|
| `obi_id`                     | `legacy_id`              |
| `obi_nome`                   | `name`                   |
| `obi_dt_faleciment`          | `deceased_at`            |
| `obi_idade`                    | `age`                     |
| `obi_conj`                    | `spouse_name`             |
| `obi_filhos`                  | `children_names`          |
| `obi_velorio`                | `wake_location`          |
| *(não existe no legado)*     | `wake_at` *(sempre nulo)* |
| `obi_sep` + `obi_cid_sep`     | `burial_location`        |
| `obi_dt_sep` + `obi_hr_sep`   | `burial_at`              |
| *(não existe no legado)*     | `message` *(sempre nulo — livre para um texto/tributo adicionado manualmente no admin)* |
| *(não existe no legado)*     | `wake_map_url` / `burial_map_url` *(sempre nulos — preenchidos manualmente no admin com o link exato do Google Maps)* |
| `obi_msdata`                  | `created_at`             |

Confirmado com uma amostra real da tabela (`SELECT *` em uma linha) — os
nomes de coluna não têm o "o" final (`faleciment`, não `falecimento`), é
assim mesmo no banco legado, não é erro de digitação.

A consulta também pula registros com `can_data` preenchido, que indica que o
obituário foi **cancelado** no sistema legado.

## 5. Testar manualmente

Antes de agendar o cron, rode uma vez via SSH ou terminal do cPanel para
conferir se sincroniza sem erro:

```bash
php sync-obituarios.php
```

Confira no painel do Supabase (tabela `obituaries`) se os registros chegaram
corretamente. Se algo estiver errado, apague `state.json` para reprocessar
tudo do zero após corrigir o mapeamento.

## 6. Agendar o Cron Job no cPanel

Em cPanel > **Cron Jobs**, adicione (ajustando o caminho para o seu usuário):

```
*/15 * * * * php /home/SEUUSUARIO/legacy-sync/sync-obituarios.php >> /home/SEUUSUARIO/legacy-sync/sync.log 2>&1
```

Isso roda a cada 15 minutos. Novos óbitos cadastrados no sistema antigo
aparecem automaticamente no novo site nesse intervalo.

## 7. Publicação no novo site

Os registros chegam com `status = 'published'`. Se preferir revisar antes de
publicar (ex: conferir se a mensagem ficou bem formatada), altere a linha
`'status' => 'published'` em `map_row()` para `'draft'` — aí cada óbito
sincronizado entra como rascunho no admin (`/admin/obituarios`) até alguém
publicar manualmente.
