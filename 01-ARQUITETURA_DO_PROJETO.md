# 01 - Arquitetura do Projeto

## Objetivo

Construir uma aplicação React escalável, modular e totalmente integrada
ao Supabase.

## Stack

- React 19
- Vite
- TypeScript
- TailwindCSS v4
- shadcn/ui
- Framer Motion
- TanStack Query
- React Router
- Zod
- React Hook Form

## Estrutura

    src/
      app/
      components/
        ui/
        layout/
        sections/
        admin/
      pages/
      modules/
      hooks/
      services/
      lib/
      contexts/
      routes/
      supabase/
      types/
      schemas/
      utils/

## Regras

- Componentes reutilizáveis.
- Nenhuma lógica de negócio dentro de componentes visuais.
- Toda chamada ao Supabase através de services.
- Separar módulos públicos e administrativos.
- Utilizar lazy loading nas páginas.
- ThemeProvider para cores e tipografia.
- Layout público e layout admin independentes.
