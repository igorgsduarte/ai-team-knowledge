# T2.1: Restaurar shell e navegação principal

## Status

Accepted

## Context

- Task: T2.1 — Restaurar shell e navegação principal
- `done` criterion: "Shell e rotas principais apresentam conteúdo estrutural utilizável."
- `verify` criterion: "Navegação por links internos cobre todas as rotas principais sem páginas vazias."
- State before this task: shell simplificado e rotas privadas sem estrutura de navegação equivalente.

## Decision

- Refeito `AppShell` com navegação consistente entre áreas principais.
- Atualizada home para entrada real (entrar/criar conta).
- Dashboard passou a exibir métricas SSR e links rápidos.

## Consequences

- Navegação principal deixou de depender de páginas mínimas e voltou a ter fluxo contínuo.
