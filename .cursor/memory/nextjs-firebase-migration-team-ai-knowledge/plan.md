---
name: "nextjs-firebase-migration-team-ai-knowledge"
status: completed
overview: "Migrar a aplicação de gestão de conhecimento para Next.js SSR + Server Actions com Firebase (Firestore, Auth, Storage) e suporte MCP por workspace."
todos:
  - id: epic-1
    content: "Fundação Next.js + shadcn + Tailwind"
    status: completed
  - id: epic-2
    content: "Migração de dados para Firestore"
    status: completed
  - id: epic-3
    content: "Migração de autenticação para Firebase Auth"
    status: completed
  - id: epic-4
    content: "Contextos salvos em Storage e base de conhecimento/skills"
    status: completed
  - id: epic-5
    content: "Banco de Agents.md por workspace"
    status: completed
  - id: epic-6
    content: "Geração de API_KEY MCP por workspace"
    status: completed
  - id: epic-7
    content: "Conexão e ativação MCP por workspace"
    status: completed
epics:
  - id: epic-1
    file: ./epic-1.md
  - id: epic-2
    file: ./epic-2.md
  - id: epic-3
    file: ./epic-3.md
  - id: epic-4
    file: ./epic-4.md
  - id: epic-5
    file: ./epic-5.md
  - id: epic-6
    file: ./epic-6.md
  - id: epic-7
    file: ./epic-7.md
isProject: false
---

# Plano: nextjs-firebase-migration-team-ai-knowledge

## Problema / objetivo

A aplicação atual está distribuída em artefatos Vite + Express + Drizzle/Clerk e precisa ser migrada para uma base única em Next.js com SSR e Server Actions, usando Firebase para dados, autenticação e storage, mantendo os fluxos de board, conhecimento, skills, comentários e colaboração por workspace.

## Proposta de solução

Executar migração faseada em sete épicos alinhados às fases pedidas: (1) estrutura Next.js + UI; (2) Firestore; (3) Firebase Auth; (4) storage para contextos e bases; (5) banco de Agents.md; (6) API key MCP por workspace; (7) runtime MCP validando key e workspace. O plano preserva comportamento funcional existente antes de adicionar os novos recursos MCP.

## Critérios globais de sucesso

- Aplicação roda em Next.js App Router com páginas principais renderizadas por SSR e mutações por Server Actions.
- Recursos de board, knowledge, skills, profile, team e comentários operam com Firestore e regras de workspace.
- Login e sessão funcionam via Firebase Auth, com proteção de rotas privadas e associação de perfil por workspace.
- Contextos salvos, base de conhecimento e skills suportam arquivo no Firebase Storage com metadados versionados no Firestore.
- Existe banco de Agents.md por workspace com leitura, escrita, versionamento e trilha de auditoria.
- Cada workspace pode gerar e revogar API_KEY MCP com armazenamento seguro (hash) e política de expiração.
- MCP só ativa conexão para requests com API_KEY válida e `workspace_id` compatível.
- Existe `AGENTS.md` na raiz com resumo do projeto, estrutura, stack, convenções e orientação operacional para melhorar discovery/performance do Codex.

## Decisões travadas (NON-NEGOTIABLE)

- D-01: Planeamento fica centralizado em `plan.md` + `epic-<n>.md` com YAML por tarefa. — motivo: execução determinística por dev-coder — origem: humano/skill
- D-02: Migração de frontend será para Next.js App Router com SSR e Server Actions como padrão. — motivo: requisito explícito — origem: humano
- D-03: UI base deverá usar shadcn/ui + Tailwind preservando cobertura funcional atual. — motivo: requisito explícito — origem: humano
- D-04: Persistência principal será Firebase Firestore em modelo orientado a workspace. — motivo: requisito explícito — origem: humano
- D-05: Autenticação e gestão de sessão serão Firebase Auth (substituindo Clerk). — motivo: requisito explícito — origem: humano
- D-06: Contextos salvos, knowledge e skills terão suporte a arquivos no Firebase Storage com metadados em Firestore. — motivo: requisito explícito — origem: humano
- D-07: MCP será habilitado por workspace e exigirá validação conjunta de API_KEY + workspace_id. — motivo: requisito explícito — origem: humano
- D-08: Deve existir documentação `AGENTS.md` na raiz com contexto operacional do projeto para acelerar discovery do Codex. — motivo: requisito explícito — origem: humano

## Ideias deferidas (NÃO planejar)

- Migração para multi-cloud além de Firebase — razão: fora do escopo atual.
- Motor de recomendação de conhecimento com IA — razão: pode entrar após estabilização da migração.
- App mobile nativo — razão: não faz parte das fases pedidas.

## Restrições técnicas conhecidas

- Sem cortes de escopo disfarçados: todo requisito das 7 fases deve ter tarefas explícitas.
- Sequência linear de dependências entre tarefas, sem grafo paralelo complexo.
- Tarefas devem apontar caminhos relativos ao futuro `apps/frontend/src/`.

## Épicos

- [Épico 1 — Fundação Next.js + shadcn + Tailwind](./epic-1.md)
- [Épico 2 — Migração para Firestore](./epic-2.md)
- [Épico 3 — Migração para Firebase Auth](./epic-3.md)
- [Épico 4 — Storage para contextos, knowledge e skills](./epic-4.md)
- [Épico 5 — Banco de Agents.md por workspace](./epic-5.md)
- [Épico 6 — API_KEY MCP por workspace](./epic-6.md)
- [Épico 7 — MCP por workspace com validação](./epic-7.md)

## Organização de ficheiros alvo

Referência: `apps/frontend/src/` será criada como raiz da nova app Next.js.

### Criar (novos)

| Caminho | Tipo | Nota |
| ------- | ---- | ---- |
| AGENTS.md | Documento | Guia operacional do projeto para discovery/performance do Codex |
| apps/frontend/src/app/layout.tsx | App Router | Shell global e providers |
| apps/frontend/src/app/page.tsx | App Router | Landing/home |
| apps/frontend/src/app/(app)/dashboard/page.tsx | App Router | Dashboard SSR |
| apps/frontend/src/app/(app)/board/page.tsx | App Router | Board SSR |
| apps/frontend/src/app/(app)/knowledge/page.tsx | App Router | Knowledge SSR |
| apps/frontend/src/app/(app)/knowledge/[id]/page.tsx | App Router | Knowledge detail SSR |
| apps/frontend/src/app/(app)/skills/page.tsx | App Router | Skills SSR |
| apps/frontend/src/app/(app)/skills/[id]/page.tsx | App Router | Skill detail SSR |
| apps/frontend/src/app/(app)/team/page.tsx | App Router | Team SSR |
| apps/frontend/src/app/(app)/profile/page.tsx | App Router | Profile SSR |
| apps/frontend/src/app/(auth)/sign-in/page.tsx | App Router | Login Firebase |
| apps/frontend/src/app/(auth)/sign-up/page.tsx | App Router | Cadastro Firebase |
| apps/frontend/src/app/actions/boards.ts | Server Actions | CRUD board |
| apps/frontend/src/app/actions/knowledge.ts | Server Actions | CRUD knowledge |
| apps/frontend/src/app/actions/skills.ts | Server Actions | CRUD skills |
| apps/frontend/src/app/actions/comments.ts | Server Actions | Comentários |
| apps/frontend/src/app/actions/workspaces.ts | Server Actions | Gestão de workspace |
| apps/frontend/src/app/actions/contexts.ts | Server Actions | Contextos em Storage |
| apps/frontend/src/app/actions/agents.ts | Server Actions | Banco Agents.md |
| apps/frontend/src/app/actions/mcp-keys.ts | Server Actions | Geração/revogação API key |
| apps/frontend/src/app/actions/mcp-connections.ts | Server Actions | Ativação MCP |
| apps/frontend/src/lib/firebase/client.ts | Lib | SDK client Firebase |
| apps/frontend/src/lib/firebase/admin.ts | Lib | SDK admin Firebase |
| apps/frontend/src/lib/firebase/auth.ts | Lib | Sessão/auth helpers |
| apps/frontend/src/lib/firebase/firestore.ts | Lib | Acesso Firestore |
| apps/frontend/src/lib/firebase/storage.ts | Lib | Upload/download Storage |
| apps/frontend/src/lib/mcp/key-hash.ts | Lib | Hash e comparação API key |
| apps/frontend/src/lib/mcp/validator.ts | Lib | Validação key + workspace |
| apps/frontend/src/lib/repositories/boards-repository.ts | Repo | Persistência boards |
| apps/frontend/src/lib/repositories/knowledge-repository.ts | Repo | Persistência knowledge |
| apps/frontend/src/lib/repositories/skills-repository.ts | Repo | Persistência skills |
| apps/frontend/src/lib/repositories/comments-repository.ts | Repo | Persistência comentários |
| apps/frontend/src/lib/repositories/agents-repository.ts | Repo | Persistência Agents.md |
| apps/frontend/src/lib/repositories/mcp-repository.ts | Repo | Persistência MCP |
| apps/frontend/src/lib/types/domain.ts | Tipos | Contratos compartilhados |
| apps/frontend/src/lib/types/mcp.ts | Tipos | Contratos MCP |
| apps/frontend/src/components/app-shell.tsx | UI | Shell autenticado |
| apps/frontend/src/components/knowledge/knowledge-form.tsx | UI | Form knowledge |
| apps/frontend/src/components/skills/skill-form.tsx | UI | Form skills |
| apps/frontend/src/components/board/board-form.tsx | UI | Form board |
| apps/frontend/src/components/mcp/mcp-key-panel.tsx | UI | Painel de API keys |
| apps/frontend/src/components/mcp/mcp-activation-form.tsx | UI | Ativação MCP |
| apps/frontend/src/middleware.ts | Middleware | Proteção de rotas |
| apps/frontend/src/app/api/mcp/connect/route.ts | Route Handler | Endpoint MCP |
| apps/frontend/src/app/api/mcp/status/route.ts | Route Handler | Saúde/conexão MCP |
| apps/frontend/src/app/api/workspaces/[workspaceId]/agents/route.ts | Route Handler | Leitura Agents.md |
| apps/frontend/src/tests/integration/mcp-connection.test.ts | Teste | Fluxo de validação MCP |
| apps/frontend/src/tests/integration/workspace-data.test.ts | Teste | Isolamento por workspace |
| apps/frontend/src/tests/integration/firebase-auth.test.ts | Teste | Auth e sessão |

### Alterar (existentes)

| Caminho | Nota |
| ------- | ---- |
| package.json | scripts para app Next.js e workflow de migração |
| pnpm-workspace.yaml | incluir novo pacote `apps/frontend` |
| artifacts/team-knowledge/src/pages/*.tsx | mapear e migrar regras de UI para App Router |
| artifacts/api-server/src/routes/*.ts | mapear regras de negócio para Server Actions/Route Handlers |
| lib/db/src/schema/*.ts | base para mapeamento relacional -> documentos Firestore |

### Deletar (quando migração estiver estável)

| Caminho | Nota |
| ------- | ---- |
| artifacts/team-knowledge | substituir frontend legado Vite após validação |
| artifacts/api-server | substituir API Express após paridade funcional |
