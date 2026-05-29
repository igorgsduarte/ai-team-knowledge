---
name: "Épico 2: Domínio workspace, convites e lifecycle"
todos:
  - id: T2.1
    content: "Modelar lifecycle e convites no domínio"
    status: completed
  - id: T2.2
    content: "Implementar workspaces-repository"
    status: completed
  - id: T2.3
    content: "Implementar workspace-invites-repository"
    status: completed
  - id: T2.4
    content: "Server Actions de configurações do workspace"
    status: completed
  - id: T2.5
    content: "Server Actions e fluxo de aceite de convite"
    status: completed
  - id: T2.6
    content: "Bloquear app quando workspace pending_deletion"
    status: completed
decisions: D-05, D-07
goal: "Workspace suporta estados active e pending_deletion, convites por token e operações owner de rename, stats e soft delete."
---

# Épico 2: Domínio workspace, convites e lifecycle

> **Goal observável:** Workspace suporta estados active e pending_deletion, convites por token e operações owner de rename, stats e soft delete.
>
> **Covers decisions:** D-05, D-07

- [x] **T2.1** — Modelar lifecycle e convites no domínio

  ```yaml
  id: T2.1
  title: "Tipos Workspace status, purgeScheduledAt e WorkspaceInvite"
  action: |
    Estender Workspace com status (active | pending_deletion), deletedAt, purgeScheduledAt, updatedBy.
    Definir WorkspaceInvite com tokenHash, email, workspaceId, invitedBy, expiresAt, acceptedAt, revokedAt.
    Registar coleção workspace_invites em firestore.ts.
  files:
    - src/lib/types/domain.ts
    - src/lib/types/workspace-lifecycle.ts
    - src/lib/firebase/firestore.ts
  depends_on: T1.6
  refs:
    - D-05
    - D-07
  verify: "Tipos exportados sem any; campos de data em ISO string alinhados ao resto do domínio."
  done: "Contratos de lifecycle e convite prontos para repositórios."
  ```

- [x] **T2.2** — Implementar workspaces-repository

  ```yaml
  id: T2.2
  title: "Repositório com rename, soft delete, restore e contagem"
  action: |
    Métodos getById, updateName, markPendingDeletion (define deletedAt e purgeScheduledAt +30 dias), restoreActive, countFilesByWorkspace (query coleção files por workspaceId).
    Impedir operações de negócio em workspace pending_deletion exceto restore e leitura para settings.
  files:
    - src/lib/repositories/workspaces-repository.ts
    - src/lib/repositories/knowledge-repository.ts
    - src/lib/repositories/skills-repository.ts
  depends_on: T2.1
  refs:
    - D-05
    - D-08
  verify: "workspace-lifecycle.test.ts cobre transição active -> pending_deletion -> restore e rejeição de create em knowledge/skills quando pending_deletion."
  done: "Repositório centraliza mutações de lifecycle do workspace."
  ```

- [x] **T2.3** — Implementar workspace-invites-repository

  ```yaml
  id: T2.3
  title: "CRUD de convites com token hash e expiração"
  action: |
    createInvite gera token aleatório, persiste hash, expiração configurável (ex. 7 dias), email normalizado.
    findByTokenHash, revokeInvite, listPendingByWorkspace.
    acceptInvite adiciona membro ao workspace e marca acceptedAt.
  files:
    - src/lib/repositories/workspace-invites-repository.ts
  depends_on: T2.1
  refs:
    - D-07
  verify: "workspace-invites.test.ts cobre criação, expiração e aceite."
  done: "Convites persistidos e associáveis a membership."
  ```

- [x] **T2.4** — Server Actions de configurações do workspace

  ```yaml
  id: T2.4
  title: "Actions owner: rename, stats, delete, restore"
  action: |
    workspace-settings.ts com renameWorkspace, getWorkspaceStats (nome, fileCount, memberCount, status, purgeScheduledAt), requestWorkspaceDeletion, restoreWorkspace.
    Todas chamam requireWorkspaceOwner e delegam ao workspaces-repository.
    requestWorkspaceDeletion não apaga Storage imediatamente.
  files:
    - src/app/actions/workspace-settings.ts
    - src/lib/firebase/workspace-access.ts
  depends_on: T2.2
  refs:
    - D-04
    - D-05
  verify: "Teste de integração confirma que member recebe erro ao chamar rename ou delete."
  done: "Owner pode mutar lifecycle e metadados via Server Actions."
  ```

- [x] **T2.5** — Server Actions e fluxo de aceite de convite

  ```yaml
  id: T2.5
  title: "Convite por e-mail e página de aceite"
  action: |
    workspace-invites.ts: createWorkspaceInvite (owner), revokeWorkspaceInvite, listWorkspaceInvites.
    Integrar envio de e-mail com link contendo token opaco (serviço configurável via env, falha explícita se SMTP/API ausente).
    Página invite/[token] valida token, exige sessão Firebase, chama acceptInvite e redireciona para board.
  files:
    - src/app/actions/workspace-invites.ts
    - src/app/(auth)/invite/[token]/page.tsx
  depends_on: T2.3
  refs:
    - D-07
  verify: "workspace-invites.test.ts cobre aceite válido e token expirado/revogado."
  done: "Fluxo de convite por link funciona para utilizador autenticado."
  ```

- [x] **T2.6** — Bloquear app quando workspace pending_deletion

  ```yaml
  id: T2.6
  title: "Middleware e troca de workspace respeitam status"
  action: |
    proxy.ts redireciona rotas (app) para workspace/settings com banner se status pending_deletion, exceto settings, sign-out e restore action.
    workspaces.ts setActiveWorkspace recusa workspace em pending_deletion para membros não-owner.
  files:
    - src/proxy.ts
    - src/app/actions/workspaces.ts
    - src/lib/repositories/workspaces-repository.ts
  depends_on: T2.4
  refs:
    - D-05
  verify: "workspace-lifecycle.test.ts asserta redirect de membro não-owner de /board para /workspace/settings quando status pending_deletion."
  done: "App deixa de servir conteúdo operacional durante período de retenção."
  ```
