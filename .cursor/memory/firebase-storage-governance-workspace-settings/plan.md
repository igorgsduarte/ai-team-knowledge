---
name: "firebase-storage-governance-workspace-settings"
status: implementation complete
overview: "Governança rígida do Firebase Storage por workspace, acesso exclusivo via backend, e gestão owner do workspace com exclusão soft de 30 dias e purge agendado."
todos:
  - id: epic-1
    content: "Regras de segurança e governança de Storage"
    status: completed
  - id: epic-2
    content: "Domínio workspace, convites e lifecycle"
    status: completed
  - id: epic-3
    content: "Tela de configurações do workspace (owner)"
    status: completed
  - id: epic-4
    content: "Exclusão, restauração e purge agendado (CF)"
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
isProject: false
---

# Plano: firebase-storage-governance-workspace-settings

## Problema / objetivo

Os arquivos de knowledge, skills e agents já são persistidos no Firebase Storage com prefixo por workspace, mas não há regras de segurança implantadas nem governança formal que impeça acesso direto ou cross-workspace. Falta também uma área de configurações do workspace para o owner gerir nome, membros, métricas de arquivos e exclusão com retenção de 30 dias antes do purge definitivo de Storage e Firestore.

## Proposta de solução

Quatro épicos em sequência: (1) política de paths, regras Firebase (Storage e Firestore) negando acesso cliente a objetos de arquivo, e endurecimento do backend Admin SDK com validação de membership e owner; (2) modelo de lifecycle do workspace, convites por token de e-mail e repositórios/actions; (3) página de configurações acessível apenas ao owner com rename, contagem de arquivos, convites e fluxos de exclusão/restauração; (4) Cloud Function v2 agendada que executa purge após `purgeScheduledAt` para workspaces em estado `pending_deletion`, removendo prefixo de Storage e documentos Firestore do workspace. Alternativa Cloud Run Job descartada após escolha explícita por CF onSchedule.

## Critérios globais de sucesso

- Cada workspace possui prefixo isolado em Storage (`workspaces/{workspaceId}/...`) e nenhum membro autenticado consegue ler ou escrever objetos de outro workspace.
- Clientes (SDK web/mobile) não conseguem ler, escrever nem obter URL pública de arquivos de knowledge, skills, agents ou contextos; todo acesso passa por Server Actions ou Route Handlers com Admin SDK.
- Regras de Storage e Firestore estão versionadas no repositório e aplicáveis via deploy do projeto Firebase.
- Owner acede a `/workspace/settings` para renomear workspace, ver total de arquivos versionados, gerir convites por e-mail com link/token e iniciar exclusão do workspace.
- Exclusão marca o workspace como `pending_deletion`, bloqueia uso normal da app e agenda purge para 30 dias depois; owner pode restaurar dentro desse prazo.
- Após 30 dias sem restauração, job agendado (Cloud Functions v2 onSchedule) remove objetos Storage do prefixo e apaga dados Firestore associados ao workspace.
- Testes de integração cobrem isolamento de paths, negação de acesso cross-workspace e transições de lifecycle.

## Decisões travadas (NON-NEGOTIABLE)

- D-01: Planeamento em `plan.md` + `epic-<n>.md` com YAML por tarefa para execução por dev-coder. — motivo: skill dev-planner — origem: skill
- D-02: Regras de Firebase Storage negam `read`/`write`/`delete` para clientes em `workspaces/**`; apenas Admin SDK no backend da aplicação e na Cloud Function de purge. — motivo: requisito de governança — origem: humano
- D-03: Convenção de path obrigatória `workspaces/{workspaceId}/{entityType}/{entityId}/v{version}.md` com validação server-side antes de qualquer operação; tentativa de path fora do workspaceId da sessão falha. — motivo: isolamento — origem: discovery/humano
- D-04: Tela e mutações de configurações do workspace restritas ao role `owner` (admin e member sem acesso). — motivo: requisito explícito — origem: humano
- D-05: Exclusão de workspace é soft: retenção 30 dias, restauração pelo owner durante o período, purge definitivo após `purgeScheduledAt`. — motivo: requisito explícito — origem: humano
- D-06: Purge agendado implementado com Cloud Functions v2 `onSchedule` (não Cloud Run Job). — motivo: escolha humana — origem: humano
- D-07: Convites de membros via e-mail com link/token único e expiração; aceite associa membership ao workspace. — motivo: escolha humana — origem: humano
- D-08: Governança cobre entity types `knowledge`, `skill`, `agents` e `context` já suportados em `FileMetadata`. — motivo: escopo do produto — origem: humano/discovery

## Ideias deferidas (NÃO planejar)

- CDN com URLs assinadas de longa duração para download direto pelo browser — razão: conflita com acesso exclusivo via backend.
- Multi-região ou replicação cross-cloud do Storage — razão: fora do escopo.
- Billing por consumo de Storage na UI — razão: produto futuro.

## Restrições técnicas conhecidas

- Stack: Next.js App Router, Server Actions, Firebase Admin SDK, Firestore, Storage, Cloud Functions v2.
- Caminhos de código relativos à raiz `src/` do repositório (app Next.js na raiz, não `apps/frontend`).
- Bun para scripts locais e testes (`bun test`).
- Deploy de `storage.rules`, `firestore.rules` e functions exige projeto Firebase configurado (variáveis em `.env` / secrets de CI).

## Épicos

- [Épico 1 — Regras de segurança e governança de Storage](./epic-1.md)
- [Épico 2 — Domínio workspace, convites e lifecycle](./epic-2.md)
- [Épico 3 — Tela de configurações do workspace (owner)](./epic-3.md)
- [Épico 4 — Exclusão, restauração e purge agendado (CF)](./epic-4.md)

## Organização de ficheiros alvo

Referência: raiz do app Next.js em `src/`.

### Criar (novos)

| Caminho | Tipo | Nota |
| ------- | ---- | ---- |
| firebase.json | Config Firebase | Liga rules e diretório functions |
| storage.rules | Regras Storage | Deny all em `workspaces/**` para clientes |
| firestore.rules | Regras Firestore | Reforço de membership; sem leitura ampla de `files` |
| functions/package.json | Cloud Functions | Pacote CF v2 |
| functions/src/index.ts | Cloud Functions | Export da função agendada |
| functions/src/scheduled/purge-deleted-workspaces.ts | Cloud Functions | Purge pós-30 dias |
| src/lib/firebase/storage-policy.ts | Lib | Validação de paths e prefixo por workspace |
| src/lib/firebase/workspace-access.ts | Lib | `requireWorkspaceMember`, `requireWorkspaceOwner` |
| src/lib/repositories/workspaces-repository.ts | Repo | CRUD, lifecycle, contagem de arquivos |
| src/lib/repositories/workspace-invites-repository.ts | Repo | Tokens de convite |
| src/lib/types/workspace-lifecycle.ts | Tipos | Status, convites, purge |
| src/app/(app)/workspace/settings/page.tsx | Página SSR | Configurações owner |
| src/app/(auth)/invite/[token]/page.tsx | Página | Aceite de convite |
| src/app/actions/workspace-settings.ts | Server Actions | Rename, delete, restore, stats |
| src/app/actions/workspace-invites.ts | Server Actions | Criar/revogar/listar convites |
| src/components/workspace/workspace-settings-panel.tsx | UI | Painel principal |
| src/components/workspace/workspace-members-panel.tsx | UI | Membros e convites |
| src/components/workspace/workspace-danger-zone.tsx | UI | Exclusão e restauração |
| src/tests/integration/storage-governance.test.ts | Teste | Paths e negação cross-workspace |
| src/tests/integration/workspace-lifecycle.test.ts | Teste | Soft delete, restore, purge query |
| src/tests/integration/workspace-invites.test.ts | Teste | Token de convite |
| src/lib/firebase/workspace-purge.ts | Lib | Purge Storage + Firestore por workspaceId |
| .cursor/memory/firebase-storage-governance-workspace-settings/adr/README.md | ADR | Índice ADR do slug |
| .cursor/memory/firebase-storage-governance-workspace-settings/adr/0001-firebase-storage-governance-workspace-settings-plan.md | ADR | Decisão de planeamento Nygard |

### Alterar (existentes)

| Caminho | Nota |
| ------- | ---- |
| src/lib/firebase/storage.ts | Validar policy antes de upload/read |
| src/lib/firebase/auth.ts | Resolver `role` do membro no workspace ativo |
| src/lib/types/domain.ts | Campos de lifecycle no `Workspace` |
| src/lib/firebase/firestore.ts | Coleções `workspace_invites`, índices |
| src/lib/repositories/agents-repository.ts | Usar helpers de acesso |
| src/lib/repositories/knowledge-repository.ts | Respeitar workspace `active` vs `pending_deletion` |
| src/lib/repositories/skills-repository.ts | Idem |
| src/app/actions/knowledge.ts | Checagem membership + workspace ativo |
| src/app/actions/skills.ts | Idem |
| src/app/actions/agents.ts | Idem |
| src/app/actions/workspaces.ts | Integrar troca de workspace com status |
| src/components/app-shell.tsx | Link condicional para settings (owner) |
| src/proxy.ts | Bloquear rotas app se workspace `pending_deletion` exceto settings |
| package.json | Script deploy rules/functions se aplicável |
| .env.example | Variáveis de projeto Firebase e URL base de convite |
| messages/pt-BR.json | i18n | Strings da área de settings |
| messages/en.json | i18n | Strings da área de settings |
| messages/es.json | i18n | Strings da área de settings |
| src/app/actions/contexts.ts | Server Actions | Governança de arquivos context |

### Deletar

| Caminho | Nota |
| ------- | ---- |
| — | Nenhum neste plano |
