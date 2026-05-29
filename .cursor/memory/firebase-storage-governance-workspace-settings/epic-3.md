---
name: "Épico 3: Tela de configurações do workspace (owner)"
todos:
  - id: T3.1
    content: "Página SSR workspace/settings owner-only"
    status: completed
  - id: T3.2
    content: "Painel de rename e estatísticas de arquivos"
    status: completed
  - id: T3.3
    content: "Painel de membros e convites"
    status: completed
  - id: T3.4
    content: "Zona de perigo: exclusão e restauração"
    status: completed
  - id: T3.5
    content: "Navegação e i18n da área de settings"
    status: completed
decisions: D-04, D-07
goal: "Owner gere workspace numa única tela: nome, métricas, convites e exclusão/restauração com confirmação explícita."
---

# Épico 3: Tela de configurações do workspace (owner)

> **Goal observável:** Owner gere workspace numa única tela: nome, métricas, convites e exclusão/restauração com confirmação explícita.
>
> **Covers decisions:** D-04, D-07

- [x] **T3.1** — Página SSR workspace/settings owner-only

  ```yaml
  id: T3.1
  title: "Rota protegida de configurações"
  action: |
    Criar page.tsx em (app)/workspace/settings carregando workspace via repositório e stats via action.
    Se auth.role !== owner, renderizar estado 403 ou redirect para board.
    Usar AppShell com secção dedicada workspaceSettings.
  files:
    - src/app/(app)/workspace/settings/page.tsx
    - src/lib/firebase/workspace-access.ts
  depends_on: T2.4
  refs:
    - D-04
  verify: "Acesso como member retorna forbidden; como owner renderiza painel."
  done: "Rota de settings existe e só owner vê conteúdo de gestão."
  ```

- [x] **T3.2** — Painel de rename e estatísticas de arquivos

  ```yaml
  id: T3.2
  title: "Formulário de nome e cartões de métricas"
  action: |
    workspace-settings-panel.tsx com form de rename (server action), exibição de fileCount e memberCount, datas de criação e estado do workspace.
    Feedback de sucesso/erro acessível.
  files:
    - src/components/workspace/workspace-settings-panel.tsx
    - src/app/actions/workspace-settings.ts
  depends_on: T3.1
  refs:
    - D-04
  verify: "Alterar nome persiste em Firestore e reflete na UI após refresh."
  done: "Owner vê e edita nome e vê quantidade de arquivos versionados."
  ```

- [x] **T3.3** — Painel de membros e convites

  ```yaml
  id: T3.3
  title: "Listar membros e criar convites por e-mail"
  action: |
    workspace-members-panel.tsx lista membros atuais com role, formulário de convite (email), lista convites pendentes com revoke.
    Integrar actions workspace-invites e workspace-settings para listagens.
  files:
    - src/components/workspace/workspace-members-panel.tsx
    - src/app/actions/workspace-invites.ts
  depends_on: T3.2
  refs:
    - D-07
  verify: "Criar convite adiciona entrada pendente; revoke remove da lista."
  done: "Owner gere membros e convites na mesma página."
  ```

- [x] **T3.4** — Zona de perigo: exclusão e restauração

  ```yaml
  id: T3.4
  title: "Exclusão com confirmação e botão restaurar"
  action: |
    workspace-danger-zone.tsx: confirmação por digitação do nome do workspace para requestWorkspaceDeletion; se pending_deletion, mostrar purgeScheduledAt e botão restoreWorkspace.
    Mensagens claras sobre retenção de 30 dias.
  files:
    - src/components/workspace/workspace-danger-zone.tsx
    - src/app/actions/workspace-settings.ts
  depends_on: T3.3
  refs:
    - D-05
  verify: "Exclusão muda status e exibe opção restaurar; restore volta status active."
  done: "Fluxos de exclusão e restauração utilizáveis pelo owner na UI."
  ```

- [x] **T3.5** — Navegação e i18n da área de settings

  ```yaml
  id: T3.5
  title: "Link na sidebar e traduções"
  action: |
    app-shell.tsx: link Configurações do workspace visível apenas se role owner.
    Adicionar chaves em messages pt/en para settings, invites, danger zone, pending_deletion banner.
  files:
    - src/components/app-shell.tsx
    - messages/pt-BR.json
    - messages/en.json
    - messages/es.json
  depends_on: T3.4
  refs:
    - D-04
  verify: "Owner vê link; member não vê. Strings de WorkspaceSettings presentes em pt-BR, en e es."
  done: "Settings integrado na navegação principal com i18n."
  ```
