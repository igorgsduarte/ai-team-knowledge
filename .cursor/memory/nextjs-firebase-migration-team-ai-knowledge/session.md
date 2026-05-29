# Session: nextjs-firebase-migration-team-ai-knowledge

Current task: planning bundle
Status: planning complete

## Decisions made

- Fases implementadas como 7 épicos sequenciais.
- SSR e Server Actions definidos como abordagem padrão no Next.js.
- Firebase centralizado para Firestore, Auth e Storage.

## Blockers

- Revisão por subagent isolado do skill não executada por limitação de ferramentas nesta sessão.

## History

- 2026-05-28: criação inicial de plan.md, epics e ADR 0001.
- 2026-05-28 17:32 | T1.1 | DONE | Definir contratos e árvore base da app Next.js
- 2026-05-28 17:32 | T1.2 | DONE | Criar AGENTS.md raiz com contexto para discovery e performance do Codex
- 2026-05-28 17:32 | T1.3 | DONE | Migrar shell, rotas e páginas principais para SSR
- 2026-05-28 17:32 | T1.4 | DONE | Migrar mutações para Server Actions e remover dependência de API legado para UI nova
- 2026-05-28 17:32 | T2.1 | DONE | Definir modelo de coleções Firestore orientado a workspace
- 2026-05-28 17:32 | T2.2 | DONE | Implementar repositórios Firestore para entidades principais
- 2026-05-28 17:32 | T2.3 | DONE | Migrar leituras/escritas das Server Actions para Firestore
- 2026-05-28 17:32 | T3.1 | DONE | Definir camada de autenticação e sessão no Next.js
- 2026-05-28 17:32 | T3.2 | DONE | Migrar telas de login/cadastro e proteção de rotas
- 2026-05-28 17:32 | T3.3 | DONE | Associar identidade Firebase com perfil e membership de workspace
- 2026-05-28 17:32 | T4.1 | DONE | Definir modelo de arquivos e metadados em Storage + Firestore
- 2026-05-28 17:32 | T4.2 | DONE | Implementar upload, versionamento e recuperação de arquivos
- 2026-05-28 17:32 | T4.3 | DONE | Integrar UI e Server Actions para contextos salvos, knowledge e skills com arquivos
- 2026-05-28 17:32 | T5.1 | DONE | Definir contrato de persistência de Agents.md por workspace
- 2026-05-28 17:32 | T5.2 | DONE | Implementar repositório e actions de leitura/escrita/versionamento de Agents.md
- 2026-05-28 17:32 | T5.3 | DONE | Expor interface de gestão de Agents.md e endpoint de consulta
- 2026-05-28 17:32 | T6.1 | DONE | Definir política de ciclo de vida e segurança das API keys
- 2026-05-28 17:32 | T6.2 | DONE | Implementar geração, hash, rotação e revogação de API keys
- 2026-05-28 17:32 | T6.3 | DONE | Entregar painel de gestão de API keys por workspace
- 2026-05-28 17:32 | T7.1 | DONE | Definir contrato de conexão MCP e regras de validação
- 2026-05-28 17:32 | T7.2 | DONE | Implementar endpoint de conexão MCP com validação de chave e workspace
- 2026-05-28 17:32 | T7.3 | DONE | Implementar ativação por workspace e testes de isolamento
