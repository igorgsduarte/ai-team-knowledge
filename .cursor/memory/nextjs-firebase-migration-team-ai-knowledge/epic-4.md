---
name: "Épico 4: Storage para contextos, knowledge e skills"
todos:
  - id: T4.1
    content: "Definir modelo de arquivos e metadados em Storage + Firestore"
    status: completed
  - id: T4.2
    content: "Implementar upload, versionamento e recuperação de arquivos"
    status: completed
  - id: T4.3
    content: "Integrar UI e Server Actions para contextos salvos, knowledge e skills com arquivos"
    status: completed
decisions: D-06
goal: "A aplicação suporta arquivos em Storage para contextos, knowledge e skills com metadados rastreáveis por workspace."
---

# Épico 4: Storage para contextos, knowledge e skills

> **Goal observável:** A aplicação suporta arquivos em Storage para contextos, knowledge e skills com metadados rastreáveis por workspace.
>
> **Covers decisions:** D-06

- [x] **T4.1** — Definir modelo de arquivos e metadados em Storage + Firestore

  ```yaml
  id: T4.1
  title: "Modelar estrutura de objetos e metadados versionados"
  action: |
    Definir convenção de paths no Storage por workspace/entidade e documento de metadados no Firestore.
    Incluir campos de versão, autor, hash de conteúdo, tipo de arquivo e histórico de atualização.
  files:
    - lib/firebase/storage.ts
    - lib/types/domain.ts
    - lib/firebase/firestore.ts
  depends_on: T3.3
  refs:
    - D-06
  verify: "Modelo de arquivos e metadados contempla criação, atualização e leitura histórica por workspace."
  done: "Contratos de armazenamento e metadados ficam definidos e prontos para consumo pelas actions."
  ```

- [x] **T4.2** — Implementar upload, versionamento e recuperação de arquivos

  ```yaml
  id: T4.2
  title: "Criar serviços de Storage para persistência de contexto e conteúdo"
  action: |
    Implementar operações de upload, recuperação, atualização de versão e deleção lógica para arquivos de contextos, knowledge e skills.
    Garantir validação de workspace e permissões antes de qualquer operação de arquivo.
  files:
    - lib/firebase/storage.ts
    - app/actions/contexts.ts
    - app/actions/knowledge.ts
    - app/actions/skills.ts
  depends_on: T4.1
  refs:
    - D-06
  verify: "Fluxos de upload e leitura retornam metadados consistentes e respeitam escopo de workspace."
  done: "Arquivos relevantes passam a ser persistidos e versionados em Storage com rastreabilidade."
  ```

- [x] **T4.3** — Integrar UI e Server Actions para contextos salvos, knowledge e skills com arquivos

  ```yaml
  id: T4.3
  title: "Expor suporte a arquivos na experiência de uso"
  action: |
    Atualizar formulários e páginas para anexar, listar e recuperar arquivos vinculados a contextos, knowledge e skills.
    Exibir estado de versão e autor para cada arquivo associado na interface.
  files:
    - components/knowledge/knowledge-form.tsx
    - components/skills/skill-form.tsx
    - app/(app)/knowledge/[id]/page.tsx
    - app/(app)/skills/[id]/page.tsx
    - app/actions/contexts.ts
  depends_on: T4.2
  refs:
    - D-06
  verify: "Usuário consegue anexar e recuperar arquivos e visualiza metadados de versão nas telas relevantes."
  done: "Gestão de contextos e bases de conhecimento/skills inclui armazenamento em arquivo no produto."
  ```

