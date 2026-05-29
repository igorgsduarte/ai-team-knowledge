---
name: "Épico 1: Regras de segurança e governança de Storage"
todos:
  - id: T1.1
    content: "Definir política de paths e tipos de governança"
    status: completed
  - id: T1.2
    content: "Versionar storage.rules e firestore.rules com deny cliente"
    status: completed
  - id: T1.3
    content: "Configurar firebase.json para rules e functions"
    status: completed
  - id: T1.4
    content: "Endurecer storage.ts com validação de policy"
    status: completed
  - id: T1.5
    content: "Helpers requireWorkspaceMember e requireWorkspaceOwner"
    status: completed
  - id: T1.6
    content: "Aplicar governança nas actions e repositórios de arquivo"
    status: completed
decisions: D-02, D-03, D-04, D-08
goal: "Arquivos de knowledge, skills, agents e context ficam inacessíveis diretamente pelo cliente e isolados por workspace no backend."
---

# Épico 1: Regras de segurança e governança de Storage

> **Goal observável:** Arquivos de knowledge, skills, agents e context ficam inacessíveis diretamente pelo cliente e isolados por workspace no backend.
>
> **Covers decisions:** D-02, D-03, D-08

- [x] **T1.1** — Definir política de paths e tipos de governança

  ```yaml
  id: T1.1
  title: "Contratos de path, entity types e erros de governança"
  action: |
    Criar storage-policy.ts com funções para montar path canónico, validar que um path pertence ao workspaceId e entityType permitido (knowledge, skill, agents, context).
    Estender domain ou workspace-lifecycle.ts com códigos de erro de governança reutilizáveis.
    Documentar no tipo que nenhum URL público ou signed URL é exposto ao cliente nesta fase.
  files:
    - src/lib/firebase/storage-policy.ts
    - src/lib/types/workspace-lifecycle.ts
  depends_on: nenhum
  refs:
    - D-01
    - D-03
    - D-08
  verify: "Testes unitários ou de integração em storage-governance.test.ts cobrem path válido, path de outro workspace e entityType inválido."
  done: "Contrato de path e validação existem e são importáveis por storage.ts e repositórios."
  ```

- [x] **T1.2** — Versionar storage.rules e firestore.rules com deny cliente

  ```yaml
  id: T1.2
  title: "Regras Firebase que bloqueiam acesso direto a objetos"
  action: |
    storage.rules: match /workspaces/{workspaceId}/{allPaths=**} { allow read, write: if false; } — sem exceção para utilizadores autenticados.
    firestore.rules: restringir leitura/escrita de coleções sensíveis (files, agents metadados) a deny client ou exigir custom claims alinhados a membership; workspaces e workspace_invites com regras mínimas compatíveis com aceite de convite autenticado.
    Garantir que regras não permitem listagem cross-workspace.
  files:
    - storage.rules
    - firestore.rules
  depends_on: T1.1
  refs:
    - D-02
    - D-03
  verify: "Teste com emulador Firebase Rules confirma permission-denied para cliente autenticado em get/put sob workspaces/."
  done: "Ficheiros de rules existem no repo e refletem política backend-only para Storage."
  ```

- [x] **T1.3** — Configurar firebase.json para rules e functions

  ```yaml
  id: T1.3
  title: "Ligar rules e pasta functions no projeto Firebase"
  action: |
    Criar firebase.json apontando storage.rules, firestore.rules e source functions/.
    Atualizar .env.example com variáveis de projectId e invite base URL sem segredos.
    Atualizar package.json com script documentado para deploy de rules (nome estável para CI).
  files:
    - firebase.json
    - package.json
    - .env.example
  depends_on: T1.2
  refs:
    - D-02
    - D-06
  verify: "firebase.json válido referencia os três artefactos; script de deploy listado em package.json."
  done: "Projeto Firebase configurável a partir do repositório com rules versionadas."
  ```

- [x] **T1.4** — Endurecer storage.ts com validação de policy

  ```yaml
  id: T1.4
  title: "Upload e read apenas após validação de path e workspace"
  action: |
    Em uploadWorkspaceFile e readWorkspaceFile, invocar storage-policy antes de tocar no bucket.
    Rejeitar operações se workspaceId do input não coincidir com o segmento do path.
    Proibir path traversal (.., barras duplicadas, prefixos alternativos).
  files:
    - src/lib/firebase/storage.ts
    - src/lib/firebase/storage-policy.ts
  depends_on: T1.1
  refs:
    - D-03
    - D-08
  verify: "storage-governance.test.ts passa com bun test incluindo tentativa de leitura com path de outro workspace."
  done: "Todas as operações de Storage no backend passam pela policy."
  ```

- [x] **T1.5** — Helpers requireWorkspaceMember e requireWorkspaceOwner

  ```yaml
  id: T1.5
  title: "Autorização centralizada por workspace e role"
  action: |
    Criar workspace-access.ts com requireWorkspaceMember(auth, workspaceId) e requireWorkspaceOwner(auth, workspaceId).
    Atualizar auth.ts para carregar role do membro a partir do documento workspaces.members.
    Lançar erro tipado quando utilizador não pertence ao workspace ou não é owner.
  files:
    - src/lib/firebase/workspace-access.ts
    - src/lib/firebase/auth.ts
    - src/lib/types/domain.ts
  depends_on: T1.1
  refs:
    - D-04
  verify: "Teste de integração simula membro vs owner e confirma rejeição de owner-only para member."
  done: "Server Actions podem importar helpers únicos para autorização de workspace."
  ```

- [x] **T1.6** — Aplicar governança nas actions e repositórios de arquivo

  ```yaml
  id: T1.6
  title: "Enforcement em knowledge, skills e agents"
  action: |
    Antes de upload/read em agents-repository e fluxos que chamam uploadWorkspaceFile nas actions knowledge, skills, agents e contexts, chamar requireWorkspaceMember.
    Garantir entityType dentro do conjunto governado.
    Não expor storagePath bruto ao cliente em respostas JSON de API pública.
  files:
    - src/lib/repositories/agents-repository.ts
    - src/lib/repositories/knowledge-repository.ts
    - src/lib/repositories/skills-repository.ts
    - src/app/actions/knowledge.ts
    - src/app/actions/skills.ts
    - src/app/actions/agents.ts
    - src/app/actions/contexts.ts
  depends_on: T1.5
  refs:
    - D-02
    - D-08
  verify: "storage-governance.test.ts e fluxo manual documentado em verify: actions retornam erro sem membership."
  done: "Nenhum fluxo de arquivo no produto contorna membership nem policy de path."
  ```
