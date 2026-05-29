# T2.2: Recompor conteúdo funcional das telas privadas

## Status

Accepted

## Context

- Task: T2.2 — Recompor conteúdo funcional das telas privadas
- `done` criterion: "Fluxos centrais da aplicação estão operacionalmente restaurados."
- `verify` criterion: "Telas privadas exibem dados/estados reais e permitem mutações via actions sem quebrar isolamento de workspace."
- State before this task: board/knowledge/skills/team/profile com conteúdo textual mínimo.

## Decision

- Integradas listagens SSR reais por `workspaceId` em board/knowledge/skills.
- Mantidos formulários de criação conectados às Server Actions.
- Team/Profile receberam conteúdo operacional e contexto de sessão/workspace.

## Consequences

- Fluxo privado voltou a apresentar dados reais e estados vazios úteis.
