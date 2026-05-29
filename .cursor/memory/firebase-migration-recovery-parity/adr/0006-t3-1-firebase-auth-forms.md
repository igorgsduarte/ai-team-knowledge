# T3.1: Implementar forms reais de sign-in e sign-up

## Status

Accepted

## Context

- Task: T3.1 — Implementar forms reais de sign-in e sign-up
- `done` criterion: "Páginas sign-in/sign-up estão conectadas ao Firebase Auth real."
- `verify` criterion: "Usuário consegue cadastrar e autenticar com Firebase em fluxo completo nas telas de autenticação."
- State before this task: páginas de autenticação eram estáticas sem integração real.

## Decision

- Criados `sign-in-form.tsx` e `sign-up-form.tsx` com `firebase/auth`.
- Implementada emissão de cookies de sessão (`tk_user_id`, `tk_workspace_id`, `tk_auth_token`, `tk_email`) no login/cadastro.

## Consequences

- Fluxo de autenticação real passou a existir e alimenta middleware/SSR.
