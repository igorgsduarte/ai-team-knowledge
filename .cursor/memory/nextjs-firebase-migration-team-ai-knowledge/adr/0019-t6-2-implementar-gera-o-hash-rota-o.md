# ADR 0019: T6.2 Implementar geração, hash, rotação e revogação de API keys

- Status: Accepted
- Data: 2026-05-28

## Contexto
Implementação da tarefa T6.2 do plano de migração Next.js + Firebase.

## Decisão
Aplicada implementação alinhada ao plano com foco em SSR, Server Actions, Firebase e isolamento por workspace.

## Consequências
A base da nova aplicação `apps/frontend` está estruturada e integrada aos fluxos MCP por workspace.
