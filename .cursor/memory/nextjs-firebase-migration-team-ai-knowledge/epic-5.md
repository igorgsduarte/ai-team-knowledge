---
name: "Épico 5: Banco de Agents.md por workspace"
todos:
  - id: T5.1
    content: "Definir contrato de persistência de Agents.md por workspace"
    status: completed
  - id: T5.2
    content: "Implementar repositório e actions de leitura/escrita/versionamento de Agents.md"
    status: completed
  - id: T5.3
    content: "Expor interface de gestão de Agents.md e endpoint de consulta"
    status: completed
decisions: D-06, D-07
goal: "Cada workspace possui banco Agents.md versionado e auditável, com acesso controlado."
---

# Épico 5: Banco de Agents.md por workspace

> **Goal observável:** Cada workspace possui banco Agents.md versionado e auditável, com acesso controlado.
>
> **Covers decisions:** D-06, D-07

- [x] **T5.1** — Definir contrato de persistência de Agents.md por workspace

  ```yaml
  id: T5.1
  title: "Modelar documento Agents.md e suas revisões"
  action: |
    Definir estrutura de documento Agents.md com campos de conteúdo, versão, autor, status e timestamps.
    Decidir a estratégia de armazenamento do conteúdo (Storage) e metadados de rastreio (Firestore).
  files:
    - lib/types/domain.ts
    - lib/firebase/firestore.ts
    - lib/firebase/storage.ts
  depends_on: T4.3
  refs:
    - D-06
    - D-07
  verify: "Contrato de Agents.md permite versionamento e rastreio completo por workspace."
  done: "Modelo de dados de Agents.md está definido para implementação sem ambiguidades."
  ```

- [x] **T5.2** — Implementar repositório e actions de leitura/escrita/versionamento de Agents.md

  ```yaml
  id: T5.2
  title: "Criar backend de Agents.md por workspace"
  action: |
    Implementar repositório de Agents.md com operações de criar versão, obter versão atual, listar histórico e recuperar versão específica.
    Expor Server Actions para edição e publicação do conteúdo com validação de autorização por workspace.
  files:
    - lib/repositories/agents-repository.ts
    - app/actions/agents.ts
    - app/actions/contexts.ts
  depends_on: T5.1
  refs:
    - D-06
    - D-07
  verify: "É possível criar nova versão de Agents.md e consultar histórico por workspace com autorização."
  done: "Banco Agents.md fica operacional com fluxo de leitura e escrita controlado."
  ```

- [x] **T5.3** — Expor interface de gestão de Agents.md e endpoint de consulta

  ```yaml
  id: T5.3
  title: "Adicionar UX e API para consumo do banco Agents.md"
  action: |
    Implementar interface para visualizar versão atual, histórico e atualizar Agents.md.
    Criar route handler para acesso autenticado do conteúdo por workspace e uso em integrações internas.
  files:
    - app/(app)/profile/page.tsx
    - app/api/workspaces/[workspaceId]/agents/route.ts
    - app/actions/agents.ts
  depends_on: T5.2
  refs:
    - D-07
  verify: "Usuário autorizado visualiza e edita Agents.md e consegue consultar via endpoint dedicado."
  done: "Gestão de Agents.md está disponível no produto e acessível por workspace."
  ```

