# T3.2: Integrar sessão, cookies e guardas de rota

## Status

Accepted

## Context

- Task: T3.2 — Integrar sessão, cookies e guardas de rota
- `done` criterion: "Sessão autenticada é reconhecida nas camadas de servidor e borda sem inconsistências."
- `verify` criterion: "Testes de integração de auth cobrem login, proteção de rota privada e redirecionamentos esperados."
- State before this task: verificação de sessão era simplificada e não alinhada com workspace.

## Decision

- Ajustado `getAuthContext` para verificação condicional de token com Admin SDK quando configurado.
- Reescrito `middleware.ts` para exigir combinação de `tk_user_id` + `tk_workspace_id` nas rotas privadas e redirecionar fluxos de auth.

## Consequences

- Guardas de rota ficaram consistentes com o contrato de sessão usado no app.
- Cobertura de testes de integração ainda depende de correção de alias no Vitest.
