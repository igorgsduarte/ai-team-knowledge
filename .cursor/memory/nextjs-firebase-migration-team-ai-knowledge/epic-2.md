---
name: "Épico 2: Migração para Firestore"
todos:
  - id: T2.1
    content: "Definir modelo de coleções Firestore orientado a workspace"
    status: completed
  - id: T2.2
    content: "Implementar repositórios Firestore para entidades principais"
    status: completed
  - id: T2.3
    content: "Migrar leituras/escritas das Server Actions para Firestore"
    status: completed
decisions: D-04
goal: "Boards, knowledge, skills, comments e membership persistem em Firestore com isolamento por workspace."
---

# Épico 2: Migração para Firestore

> **Goal observável:** Boards, knowledge, skills, comments e membership persistem em Firestore com isolamento por workspace.
>
> **Covers decisions:** D-04

- [x] **T2.1** — Definir modelo de coleções Firestore orientado a workspace

  ```yaml
  id: T2.1
  title: "Especificar estrutura documental e índices de leitura"
  action: |
    Definir collections/subcollections para users, workspaces, boards, knowledge, skills, comments e memberships.
    Explicitar chave de particionamento por workspace e campos de ordenação/filtro para substituir consultas atuais do modelo relacional.
  files:
    - lib/firebase/firestore.ts
    - lib/types/domain.ts
  depends_on: T1.3
  refs:
    - D-04
  verify: "Modelo Firestore cobre todas as entidades atuais e suas consultas principais por workspace."
  done: "Estrutura documental e convenções de ids/campos ficam definidas em contratos reutilizáveis."
  ```

- [x] **T2.2** — Implementar repositórios Firestore para entidades principais

  ```yaml
  id: T2.2
  title: "Criar camada de repositórios para CRUD e listagens"
  action: |
    Implementar repositórios para boards, knowledge, skills e comments com contratos consistentes de leitura, escrita, paginação e filtros.
    Garantir que cada método receba workspaceId e aplique escopo obrigatório.
  files:
    - lib/repositories/boards-repository.ts
    - lib/repositories/knowledge-repository.ts
    - lib/repositories/skills-repository.ts
    - lib/repositories/comments-repository.ts
  depends_on: T2.1
  refs:
    - D-04
  verify: "Cada repositório expõe operações principais usando Firestore e exige contexto de workspace."
  done: "Camada de dados principal troca Drizzle/Postgres por Firestore sem perda de capacidades funcionais."
  ```

- [x] **T2.3** — Migrar leituras/escritas das Server Actions para Firestore

  ```yaml
  id: T2.3
  title: "Conectar Server Actions aos novos repositórios Firestore"
  action: |
    Atualizar Server Actions criadas no épico 1 para consumir a camada de repositórios Firestore.
    Remover acoplamento com rotas Express legadas nas operações de board, knowledge, skills e comments.
  files:
    - app/actions/boards.ts
    - app/actions/knowledge.ts
    - app/actions/skills.ts
    - app/actions/comments.ts
  depends_on: T2.2
  refs:
    - D-04
  verify: "Mutações e leituras das telas principais executam via Firestore com escopo de workspace."
  done: "Fluxos principais usam Firestore ponta a ponta na nova aplicação."
  ```

