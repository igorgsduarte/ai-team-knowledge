---
name: "Épico 2: Domínio, repositórios e seed demo"
todos:
  - id: T2.1
    content: "Estender tipos de domínio e perfil"
    status: completed
  - id: T2.2
    content: "Estender repositórios Firestore"
    status: completed
  - id: T2.3
    content: "Atualizar Server Actions"
    status: completed
  - id: T2.4
    content: "Expandir seed demo acme com conteúdo dos screenshots"
    status: completed
decisions: D-04, D-07, D-10
goal: "Modelo de dados e seed demo permitem renderizar cards ricos idênticos aos screenshots"
---

# Épico 2: Domínio, repositórios e seed demo

> **Goal observável:** Board com status/tags/autor; Knowledge com tipo link/artigo e URL; Skills com descrição/tags; UserSkills com nível; perfil com bio/área; seed acme populado.
>
> **Covers decisions:** D-04, D-07, D-10

- [x] **T2.1** — Estender tipos de domínio e perfil

  ```yaml
  id: T2.1
  title: "Estender tipos de domínio e perfil"
  action: |
    Em src/lib/types/domain.ts adicionar:
    - BoardStatus: learning | doing | done; Board.tags: string[]; Board.status
    - KnowledgeType: link | article; KnowledgeItem.url opcional; KnowledgeItem.summary opcional (body permanece markdown)
    - Skill.description, Skill.tags, Skill.category opcional
    - UserSkill: userId, skillId, level (beginner | intermediate | advanced), workspaceId
    - Enriquecer UserProfile em users-repository: name, email, area, bio, avatarUrl alinhados ao seed/screenshots
    Exportar tipos compartilhados sem breaking changes desnecessários (defaults sensatos onde campo novo).
  files:
    - src/lib/types/domain.ts
    - src/lib/repositories/users-repository.ts
  depends_on: T1.5
  refs:
    - D-07
    - D-10
  verify: "bun run type-check passa com novos tipos referenciados"
  done: "Tipos estendidos cobrem campos visíveis nos screenshots"
  ```

- [x] **T2.2** — Estender repositórios Firestore

  ```yaml
  id: T2.2
  title: "Estender repositórios Firestore"
  action: |
    Atualizar boards-repository, knowledge-repository, skills-repository para persistir novos campos.
    Criar src/lib/repositories/user-skills-repository.ts com listByUser, listByWorkspace, add, remove, countBySkill.
    Estender users-repository com updateProfile e getUsersByWorkspace (via memberships/workspaces.members).
    Registrar coleção userSkills em firestore collections se necessário.
    Manter filtro workspaceId em todas as queries.
  files:
    - src/lib/repositories/boards-repository.ts
    - src/lib/repositories/knowledge-repository.ts
    - src/lib/repositories/skills-repository.ts
    - src/lib/repositories/user-skills-repository.ts
    - src/lib/repositories/users-repository.ts
    - src/lib/firebase/firestore.ts
  depends_on: T2.1
  refs:
    - D-07
    - D-10
  verify: "bun run type-check passa; métodos CRUD compilam"
  done: "Repositórios leem/escrevem campos estendidos com isolamento por workspaceId"
  ```

- [x] **T2.3** — Atualizar Server Actions

  ```yaml
  id: T2.3
  title: "Atualizar Server Actions"
  action: |
    Atualizar createBoard, createKnowledge, createSkill para aceitar status/tags/type/url/description via FormData ou payload serializado do drawer.
    Adicionar deleteBoard, deleteKnowledge actions onde ícone lixeira aparece nos screenshots.
    Criar actions em src/app/actions/user-skills.ts: addUserSkill, removeUserSkill.
    Criar src/app/actions/profile.ts updateProfile (name, area, bio) preservando updateLocale existente.
    publishAgents permanece; garantir action aceita markdown completo do drawer.
    revalidatePath nas rotas afetadas.
  files:
    - src/app/actions/boards.ts
    - src/app/actions/knowledge.ts
    - src/app/actions/skills.ts
    - src/app/actions/user-skills.ts
    - src/app/actions/profile.ts
    - src/app/actions/agents.ts
  depends_on: T2.2
  refs:
    - D-04
    - D-07
    - D-10
  verify: "bun run type-check passa; após seed:demo createBoard com status/tags persiste campos no Firestore"
  done: "Server Actions cobrem criar/editar/remover entidades exibidas nas telas"
  ```

- [x] **T2.4** — Expandir seed demo acme com conteúdo dos screenshots

  ```yaml
  id: T2.4
  title: "Expandir seed demo acme com conteúdo dos screenshots"
  action: |
    Estender scripts/seed-demo-acme.mjs:
    - Adicionar usuário demo@teamknowledge.dev (Demo User, QA/Demonstração) alinhado ao screenshot de perfil
    - Renomear display names para Alice Ferreira e Bob Oliveira quando aplicável
    - Seed board entries (6 itens) com status, tags, descrições dos screenshots
    - Seed knowledge (5 entradas link/artigo) com tags e URLs
    - Seed skills (10 skills) com descrições e tags
    - Seed userSkills com níveis Avançado/Intermediário/Iniciante por membro
    - Seed agents.md publicado com conteúdo markdown de demonstração (3 seções: papel, stack, convenções)
    - Seed comentários opcionais onde screenshot mostra contagem > 0
    Script idempotente (merge/set) como padrão atual.
  files:
    - scripts/seed-demo-acme.mjs
  depends_on: T2.3
  refs:
    - D-07
  verify: "bun run seed:demo popula Firestore; login demo exibe cards nos screenshots"
  done: "Workspace acme contém dados espelhando os anexos para validação visual"
  ```
