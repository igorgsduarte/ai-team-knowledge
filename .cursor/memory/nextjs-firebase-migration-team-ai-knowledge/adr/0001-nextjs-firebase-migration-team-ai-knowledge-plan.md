# ADR 0001: Plano de migração Next.js + Firebase

- Status: Accepted
- Data: 2026-05-28

## Context

O produto atual está distribuído entre frontend Vite (`artifacts/team-knowledge`), API Express (`artifacts/api-server`) e schema Drizzle/Postgres (`lib/db`).  
O objetivo aprovado é migrar para Next.js com SSR e Server Actions, além de substituir dados, auth e storage por Firebase, incluindo funcionalidades MCP por workspace.

## Decision

Adotar plano em sete épicos sequenciais:

1. Fundação Next.js + shadcn + Tailwind.
2. Migração de dados para Firestore.
3. Migração de autenticação para Firebase Auth.
4. Contextos, knowledge e skills com arquivos em Storage.
5. Banco de Agents.md por workspace.
6. Geração e gestão de API_KEY MCP por workspace.
7. Conexão MCP com validação obrigatória de API_KEY + workspace_id.

Cada épico usa tarefas YAML pequenas (`T<e>.<t>`) com `depends_on` linear para execução por `dev-coder`.

## Consequences

- A migração ocorre com trilha auditável e critérios verificáveis por fase.
- Existe risco de regressão funcional durante troca de stack; mitigação via testes de integração por workspace e validação de auth/MCP.
- Próximo passo operacional é executar os épicos em ordem, mantendo `session.md` e ADRs atualizados por entrega.

