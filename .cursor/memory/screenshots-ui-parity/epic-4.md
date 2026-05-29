---
name: "Épico 4: Knowledge e Skills"
todos:
  - id: T4.1
    content: "KnowledgeCard, filtros e drawer"
    status: completed
  - id: T4.2
    content: "Reescrever página Knowledge"
    status: completed
  - id: T4.3
    content: "Skills: Minhas Skills, grid e drawer"
    status: completed
  - id: T4.4
    content: "Reescrever página Skills"
    status: completed
decisions: D-01, D-04
goal: "Banco de Conhecimento e Banco de Skills correspondem aos screenshots"
---

# Épico 4: Knowledge e Skills

> **Goal observável:** Knowledge com busca/filtro, cards link/artigo e drawer; Skills com Minhas Skills, grid 3 colunas, adicionar/remover skill do usuário e drawer de criação.
>
> **Covers decisions:** D-01, D-04

- [x] **T4.1** — KnowledgeCard, filtros e drawer

  ```yaml
  id: T4.1
  title: "KnowledgeCard, filtros e drawer"
  action: |
    Criar src/components/knowledge/knowledge-card.tsx com badge Link/Artigo, autor, tags, summary, URL clicável quando type=link, delete, footer comentários.
    Criar src/components/knowledge/knowledge-toolbar.tsx client: input busca + select filtro Todos/Link/Artigo (filtragem client-side sobre lista SSR ou searchParams).
    Criar src/components/knowledge/knowledge-create-drawer.tsx: Drawer com título, MarkdownEditor corpo principal, select tipo, URL condicional, tags; submit createKnowledge.
    Remover knowledge-form.tsx inline após migração.
  files:
    - src/components/knowledge/knowledge-card.tsx
    - src/components/knowledge/knowledge-toolbar.tsx
    - src/components/knowledge/knowledge-create-drawer.tsx
  depends_on: T3.3
  refs:
    - D-01
    - D-04
  verify: "Drawer knowledge abre; cards distinguem Link vs Artigo"
  done: "Componentes Knowledge prontos para composição da página"
  ```

- [x] **T4.2** — Reescrever página Knowledge

  ```yaml
  id: T4.2
  title: "Reescrever página Knowledge"
  action: |
    Reescrever src/app/(app)/knowledge/page.tsx:
    PageHeader Banco de Conhecimento + subtítulo + KnowledgeCreateDrawer.
    KnowledgeToolbar abaixo do header.
    Grid 2 colunas de KnowledgeCard com autores resolvidos e contagem comentários.
  files:
    - src/app/(app)/knowledge/page.tsx
    - src/components/knowledge/knowledge-form.tsx
  depends_on: T4.1
  refs:
    - D-01
  verify: "Página /knowledge com seed reproduz screenshot Knowledge"
  done: "Banco de Conhecimento alinhado ao anexo"
  ```

- [x] **T4.3** — Skills: Minhas Skills, grid e drawer

  ```yaml
  id: T4.3
  title: "Skills: Minhas Skills, grid e drawer"
  action: |
    Criar src/components/skills/my-skills-panel.tsx: lista skills do usuário autenticado com badge de nível e botão remover.
    Criar src/components/skills/skill-card.tsx: nome, descrição, tags, contagem usuários, botão + Adicionar ou badge Sua skill.
    Criar src/components/skills/skill-create-drawer.tsx: Drawer com nome, MarkdownEditor descrição/prompt principal, tags/categoria; submit createSkill.
    Criar src/components/skills/add-skill-button.tsx client para addUserSkill com seleção de nível quando necessário.
    Remover skill-form.tsx inline após migração.
  files:
    - src/components/skills/my-skills-panel.tsx
    - src/components/skills/skill-card.tsx
    - src/components/skills/skill-create-drawer.tsx
    - src/components/skills/add-skill-button.tsx
  depends_on: T4.2
  refs:
    - D-01
    - D-04
  verify: "Minhas Skills renderiza níveis; Adicionar associa skill ao usuário"
  done: "Componentes Skills cobrem screenshot de Skills"
  ```

- [x] **T4.4** — Reescrever página Skills

  ```yaml
  id: T4.4
  title: "Reescrever página Skills"
  action: |
    Reescrever src/app/(app)/skills/page.tsx SSR:
    PageHeader Banco de Skills + subtítulo + SkillCreateDrawer.
    MySkillsPanel, barra busca, grid 3 colunas SkillCard com userSkill state por skill.
    Resolver contagens via userSkillsRepository.
  files:
    - src/app/(app)/skills/page.tsx
    - src/components/skills/skill-form.tsx
  depends_on: T4.3
  refs:
    - D-01
  verify: "Página /skills com seed reproduz screenshot Skills"
  done: "Banco de Skills alinhado ao anexo"
  ```
