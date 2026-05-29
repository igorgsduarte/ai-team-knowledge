# ADR 0005: T1.4 Migrar mutações para Server Actions e remover dependência de API legado para UI nova

- Status: Accepted
- Data: 2026-05-28

## Contexto
Implementação da tarefa T1.4 do plano de migração Next.js + Firebase.

## Decisão
Aplicada implementação alinhada ao plano com foco em SSR, Server Actions, Firebase e isolamento por workspace.

## Consequências
A base da nova aplicação `apps/frontend` está estruturada e integrada aos fluxos MCP por workspace.
