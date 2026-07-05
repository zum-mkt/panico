# Funerária Paníco — novo site

Ver [00-LEIA_PRIMEIRO.md](./00-LEIA_PRIMEIRO.md) para as diretrizes obrigatórias do projeto (missão, stack, design system, CMS).

## Stack

React 19 + TypeScript + Vite + TailwindCSS v4 + shadcn/ui, com Supabase (database, storage, auth) como backend. Deploy em Cloudflare Workers (assets estáticos).

## Desenvolvimento

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha as variáveis do Supabase.

## Build e deploy

```bash
npm run build     # gera dist/
npm run deploy    # build + wrangler deploy
```

O deploy também roda automaticamente via Cloudflare Workers Builds a cada push na branch `main`.

## Estrutura

- `legacy/` — cópia estática do site antigo (funerariapanico.com.br), mantida como referência de conteúdo e design.
- `supabase/` — configuração do projeto Supabase (migrations, config.toml).
- `src/` — aplicação React.
