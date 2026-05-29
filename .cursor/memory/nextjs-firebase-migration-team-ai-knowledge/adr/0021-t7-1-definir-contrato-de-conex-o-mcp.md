# ADR 0021: T7.1 Definir contrato de conexão MCP e regras de validação

- Status: Accepted
- Data: 2026-05-28

## Contexto
Implementação da tarefa T7.1 do plano de migração Next.js + Firebase.

## Decisão
Aplicada implementação alinhada ao plano com foco em SSR, Server Actions, Firebase e isolamento por workspace.

## Consequências
A base da nova aplicação `apps/frontend` está estruturada e integrada aos fluxos MCP por workspace.
