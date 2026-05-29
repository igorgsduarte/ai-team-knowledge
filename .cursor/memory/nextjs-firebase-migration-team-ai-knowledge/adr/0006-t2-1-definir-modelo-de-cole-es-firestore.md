# ADR 0006: T2.1 Definir modelo de coleções Firestore orientado a workspace

- Status: Accepted
- Data: 2026-05-28

## Contexto
Implementação da tarefa T2.1 do plano de migração Next.js + Firebase.

## Decisão
Aplicada implementação alinhada ao plano com foco em SSR, Server Actions, Firebase e isolamento por workspace.

## Consequências
A base da nova aplicação `apps/frontend` está estruturada e integrada aos fluxos MCP por workspace.
