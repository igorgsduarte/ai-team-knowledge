# T1.2: Corrigir baseline de execução local para permitir navegação

## Status

Accepted

## Context

- Task: T1.2 — Corrigir baseline de execução local para permitir navegação
- `done` criterion: "Ambiente local está navegável para validar visual e comportamento da migração."
- `verify` criterion: "Aplicação inicializa sem erro bloqueante e permite abrir home, auth e ao menos uma rota privada autenticada."
- State before this task: build quebrava por inicialização precoce de Firebase Admin e páginas dinâmicas sem fallback seguro.

## Decision

- Aplicada inicialização lazy para Firebase Admin e Firebase Client, removendo falha no import durante build.
- Ajustadas páginas de detalhe para usar `workspaceId` da sessão e fallback explícito para casos sem contexto.
- Atualizado `.env.example` com `NEXT_PUBLIC_DEFAULT_WORKSPACE_ID`.

## Consequences

- `bun run build` passa a concluir sem falha por env ausente no momento de prerender.
- Base técnica ficou pronta para restaurar telas e autenticação real nos próximos tasks.
