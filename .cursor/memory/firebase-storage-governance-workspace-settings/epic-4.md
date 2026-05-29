---
name: "Épico 4: Exclusão, restauração e purge agendado (CF)"
todos:
  - id: T4.1
    content: "Scaffold Cloud Functions v2 onSchedule"
    status: completed
  - id: T4.2
    content: "Implementar purge-deleted-workspaces"
    status: completed
  - id: T4.3
    content: "Serviço de purge Storage e Firestore no backend"
    status: completed
  - id: T4.4
    content: "Testes de integração do lifecycle completo"
    status: completed
  - id: T4.5
    content: "ADR e checklist de deploy operacional"
    status: completed
decisions: D-05, D-06
goal: "Após 30 dias em pending_deletion sem restauração, job agendado remove Storage e dados Firestore do workspace de forma idempotente."
---

# Épico 4: Exclusão, restauração e purge agendado (CF)

> **Goal observável:** Após 30 dias em pending_deletion sem restauração, job agendado remove Storage e dados Firestore do workspace de forma idempotente.
>
> **Covers decisions:** D-05, D-06

- [x] **T4.1** — Scaffold Cloud Functions v2 onSchedule

  ```yaml
  id: T4.1
  title: "Pacote functions com onSchedule diário"
  action: |
    Criar functions/package.json com firebase-functions (geração 2, onSchedule) e firebase-admin.
    index.ts exporta função purgeDeletedWorkspaces agendada (ex. diária 03:00 UTC).
    Configurar região e service account mínima para Storage e Firestore.
  files:
    - functions/package.json
    - functions/src/index.ts
    - firebase.json
  depends_on: T1.3
  refs:
    - D-06
  verify: "Build local do pacote functions conclui sem erro de TypeScript."
  done: "Esqueleto CF deployável referenciado no firebase.json."
  ```

- [x] **T4.2** — Implementar purge-deleted-workspaces

  ```yaml
  id: T4.2
  title: "Job que seleciona workspaces elegíveis e executa purge"
  action: |
    purge-deleted-workspaces.ts consulta workspaces com status pending_deletion e purgeScheduledAt <= now.
    Para cada um, invocar serviço de purge; marcar workspace como purged ou apagar documento workspace após sucesso.
    Logging estruturado por workspaceId; continuar em falha parcial com retry na próxima execução.
  files:
    - functions/src/scheduled/purge-deleted-workspaces.ts
    - functions/src/index.ts
  depends_on: T4.1
  refs:
    - D-05
    - D-06
  verify: "Teste emulador ou teste unitário com Firestore mock confirma query de elegíveis."
  done: "Função agendada implementada e exportada."
  ```

- [x] **T4.3** — Serviço de purge Storage e Firestore no backend

  ```yaml
  id: T4.3
  title: "Apagar prefixo Storage e coleções por workspaceId"
  action: |
    Criar workspace-purge.ts no app com deleteAllFilesUnderPrefix workspaces/{id}/ e remoção em lote dos documentos files, agents, knowledge, skills, boards, comments, userSkills, mcp_keys, mcp_workspace_settings, workspace_invites e workspace; a Cloud Function importa ou duplica a lógica via pacote partilhado no monorepo.
    Garantir idempotência se executado duas vezes.
    Reutilizar mesma lógica se necessário em script admin futuro (exportar função pura).
  files:
    - functions/src/scheduled/purge-deleted-workspaces.ts
    - src/lib/firebase/workspace-purge.ts
  depends_on: T4.2
  refs:
    - D-02
    - D-05
  verify: "workspace-lifecycle.test.ts com emulador ou mock verifica que prefixo e contagem files zeram após purge."
  done: "Purge remove Storage e metadados Firestore do workspace."
  ```

- [x] **T4.4** — Testes de integração do lifecycle completo

  ```yaml
  id: T4.4
  title: "Cobertura delete -> restore e delete -> purge"
  action: |
    Estender workspace-lifecycle.test.ts e storage-governance.test.ts para cenário completo: soft delete define purgeScheduledAt, restore limpa datas, purge elegível após data simulada.
  files:
    - src/tests/integration/workspace-lifecycle.test.ts
    - src/tests/integration/storage-governance.test.ts
  depends_on: T4.3
  refs:
    - D-05
    - D-08
  verify: "bun test src/tests/integration/workspace-lifecycle.test.ts passa."
  done: "CI local cobre transições críticas de lifecycle e isolamento."
  ```

- [x] **T4.5** — ADR e checklist de deploy operacional

  ```yaml
  id: T4.5
  title: "ADR 0001 e instruções de deploy rules + CF"
  action: |
    Criar adr/0001-firebase-storage-governance-workspace-settings-plan.md com contexto, decisão CF onSchedule, consequências (custo, cold start, monitorização).
    Checklist: deploy storage.rules, firestore.rules, functions; configurar INVITE_BASE_URL e segredos de e-mail; validar job no console Firebase.
  files:
    - .cursor/memory/firebase-storage-governance-workspace-settings/adr/0001-firebase-storage-governance-workspace-settings-plan.md
    - .cursor/memory/firebase-storage-governance-workspace-settings/adr/README.md
  depends_on: T4.4
  refs:
    - D-01
    - D-06
  verify: "ADR Accepted com secções Context, Decision, Consequences preenchidas."
  done: "Memória de planeamento fechada para handoff dev-coder com passos operacionais."
  ```
