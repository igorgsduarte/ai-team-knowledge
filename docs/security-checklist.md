# Security Checklist — Team AI Knowledge

Baseline alinhado com [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security), [Authgear](https://www.authgear.com/post/nextjs-security-best-practices/) e [Arcjet](https://blog.arcjet.com/next-js-security-checklist/).

Última revisão: 2026-05-29

## Dependências e supply chain

| Item | Status | Notas |
|------|--------|-------|
| Next.js ≥ 15.2.3 / 14.2.25+ (CVE-2025-29927) | ✅ | Next.js 16.2.6 |
| Lockfile versionado (`bun.lock`) | ✅ | |
| `bun audit` no CI | ✅ | `.github/workflows/security.yml` |
| Dependabot semanal | ✅ | `.github/dependabot.yml` |

## Autenticação e sessão

| Item | Status | Notas |
|------|--------|-------|
| Tokens em cookies `httpOnly` | ✅ | `__session`, `tk_*` em `server-session.ts` |
| Sem tokens em `localStorage` | ✅ | |
| Sessão verificada no servidor (DAL) | ✅ | `src/lib/dal/session.ts` |
| Sem fallback `tk_user_id` em produção | ✅ | Opt-in dev: `ALLOW_INSECURE_DEV_AUTH=true` |
| Auth em cada Server Action | ✅ | `requireEnrichedAuthContext` |
| Auth em cada API route sensível | ✅ | `verifySession` + workspace check |
| Middleware só para UX (redirect) | ✅ | Comentário em `middleware.ts` |
| Rate limit em sign-in/sign-up/MCP | ✅ | `src/lib/security/rate-limit.ts` |

## Autorização e dados

| Item | Status | Notas |
|------|--------|-------|
| Isolamento por `workspaceId` nos repositórios | ✅ | |
| Firestore rules deny-all no cliente | ✅ | `firestore.rules` |
| Storage rules deny-all no cliente | ✅ | `storage.rules` |
| Validação Zod em APIs críticas | ✅ | auth + MCP |
| `server-only` em módulos sensíveis | ✅ | admin, repos, DAL, MCP |

## Headers e superfície HTTP

| Item | Status | Notas |
|------|--------|-------|
| Content-Security-Policy | ✅ | `next.config.ts` |
| HSTS (produção) | ✅ | |
| X-Content-Type-Options | ✅ | |
| Referrer-Policy | ✅ | |
| Permissions-Policy | ✅ | |
| X-Frame-Options / frame-ancestors | ✅ | |
| Redirect seguro (`getSafeRedirect`) | ✅ | `src/lib/security/redirect.ts` |

## Validação contínua

| Item | Status | Notas |
|------|--------|-------|
| `bun run security:audit` | ✅ | `scripts/security-audit.mjs` |
| Testes de auth/regressão | ✅ | `src/tests/integration/*auth*` |
| CI security workflow | ✅ | `.github/workflows/security.yml` |

## Futuro / fora do escopo MVP

| Item | Status | Notas |
|------|--------|-------|
| MFA / passkeys | ⏳ | Firebase Auth ou IdP externo |
| WAF / bot detection | ⏳ | Reavaliar com tráfego público |
| Rate limit distribuído (Upstash) | ⏳ | MVP in-memory documentado |
| CSP sem `unsafe-inline` (nonces) | ⏳ | Requer ajuste de bundler/styles |

## Como validar localmente

```bash
bun run type-check
bun test
bun run security:audit
bun run build
```

Critério de conclusão: checklist ≥ 90% ✅ nos itens aplicáveis, CI verde, nenhuma API sensível sem auth.
