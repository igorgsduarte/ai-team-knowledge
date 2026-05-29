# Team AI Knowledge - AGENTS

## Produto
Plataforma colaborativa de conhecimento por workspace, com board, base de conhecimento, skills, comentários e integrações MCP.

## Stack atual
- Next.js App Router + SSR + Server Actions
- Dados/Auth/Storage alvo: Firebase (Firestore, Auth, Storage)

## Estrutura relevante
- `src/app`: rotas App Router, Server Actions e APIs
- `src/lib`: firebase, repositórios, tipos de domínio e MCP
- `src/components`: UI e formulários
- `src/tests/integration`: testes de integração
- `.cursor/memory/nextjs-firebase-migration-team-ai-knowledge`: plano, épicos, ADR e sessão

## Convenções
- SSR por padrão para páginas principais.
- Mutações via Server Actions.
- Repositórios sempre exigem `workspaceId` para isolamento.
- MCP valida `apiKey` + `workspaceId`.
