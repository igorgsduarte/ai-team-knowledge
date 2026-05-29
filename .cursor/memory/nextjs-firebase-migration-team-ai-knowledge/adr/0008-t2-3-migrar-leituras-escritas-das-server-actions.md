# ADR 0008: T2.3 Migrar leituras/escritas das Server Actions para Firestore

- Status: Accepted
- Data: 2026-05-28

## Contexto
Implementação da tarefa T2.3 do plano de migração Next.js + Firebase.

## Decisão
Aplicada implementação alinhada ao plano com foco em SSR, Server Actions, Firebase e isolamento por workspace.

## Consequências
A base da nova aplicação `apps/frontend` está estruturada e integrada aos fluxos MCP por workspace.
