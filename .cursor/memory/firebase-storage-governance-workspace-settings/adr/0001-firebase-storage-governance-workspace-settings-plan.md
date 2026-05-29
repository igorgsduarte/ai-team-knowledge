# ADR 0001: Governança Firebase Storage e gestão de workspace

## Status

Accepted

## Context

A aplicação persiste arquivos de knowledge, skills, agents e context em `workspaces/{workspaceId}/...` via Firebase Admin SDK, sem `storage.rules` no repositório. É necessário impedir acesso direto pelo cliente, isolar workspaces, oferecer configurações exclusivas do owner (rename, métricas, convites, exclusão) e reter dados 30 dias antes do purge automático.

Restrições: Next.js Server Actions, Cloud Functions onSchedule (escolha humana), convites por token de e-mail com restauração dentro do período de retenção.

## Decision

- Quatro épicos: (1) rules + policy + workspace-access; (2) lifecycle e convites; (3) UI settings owner; (4) CF purge + workspace-purge.
- Storage rules: deny all client access under `workspaces/**`.
- Backend-only reads/writes com validação de path e membership.
- Soft delete com `pending_deletion` e `purgeScheduledAt`; job diário remove Storage e Firestore.

## Consequences

- Deploy obrigatório de rules e functions antes de produção; cliente Firebase SDK não deve ser usado para Storage de conteúdo.
- Custo e cold start da função agendada; monitorizar falhas de purge no Cloud Logging.
- Envio de e-mail de convite depende de provedor configurado (falha explícita se ausente).
- Próximo passo: executar tarefas via dev-coder a partir de `epic-1.md`.
