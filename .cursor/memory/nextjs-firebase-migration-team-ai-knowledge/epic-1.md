---
name: "Épico 1: Fundação Next.js + shadcn + Tailwind"
todos:
  - id: T1.1
    content: "Definir contratos e árvore base da app Next.js"
    status: completed
  - id: T1.2
    content: "Criar AGENTS.md raiz com contexto para discovery e performance do Codex"
    status: completed
  - id: T1.3
    content: "Migrar shell, rotas e páginas principais para SSR"
    status: completed
  - id: T1.4
    content: "Migrar mutações para Server Actions e remover dependência de API legado para UI nova"
    status: completed
decisions: D-01, D-02, D-03, D-08
goal: "A nova app Next.js renderiza os fluxos principais em SSR e usa Server Actions para mutações com UI shadcn/Tailwind."
---

# Épico 1: Fundação Next.js + shadcn + Tailwind

> **Goal observável:** A nova app Next.js renderiza os fluxos principais em SSR e usa Server Actions para mutações com UI shadcn/Tailwind.
>
> **Covers decisions:** D-01, D-02, D-03, D-08

- [x] **T1.1** — Definir contratos e árvore base da app Next.js

  ```yaml
  id: T1.1
  title: "Definir contratos de domínio e estrutura inicial da app"
  action: |
    Criar a estrutura inicial de App Router, providers e contratos de domínio compartilhados.
    Garantir que tipos base de board, knowledge, skill, comment e workspace sejam exportados de um ponto único para suportar SSR e Server Actions sem duplicação.
  files:
    - lib/types/domain.ts
    - app/layout.tsx
    - app/page.tsx
    - components/app-shell.tsx
  depends_on: nenhum
  refs:
    - D-01
    - D-02
  verify: "Estrutura App Router criada e tipos de domínio compilam sem imports circulares."
  done: "Existe árvore mínima de app e um módulo de tipos compartilhados usado por páginas e actions."
  ```

- [x] **T1.2** — Criar AGENTS.md raiz com contexto para discovery e performance do Codex

  ```yaml
  id: T1.2
  title: "Documentar AGENTS.md na raiz do projeto"
  action: |
    Criar o arquivo AGENTS.md na raiz do repositório com resumo do projeto, objetivo de produto, stack atual e stack-alvo.
    Incluir mapa de estrutura de pastas, responsabilidades dos módulos, convenções de desenvolvimento, fluxo recomendado de discovery para agentes e critérios para atualização do documento.
  files:
    - AGENTS.md
  depends_on: T1.1
  refs:
    - D-01
    - D-08
  verify: "AGENTS.md existe na raiz e cobre resumo, estrutura, stack e orientação prática de discovery para Codex."
  done: "Documentação raiz orienta rapidamente um agente sobre o projeto e reduz tempo de descoberta."
  ```

- [x] **T1.3** — Migrar shell, rotas e páginas principais para SSR

  ```yaml
  id: T1.3
  title: "Migrar páginas principais para App Router com renderização server-side"
  action: |
    Implementar as rotas dashboard, board, knowledge, knowledge detail, skills, skill detail, team e profile em App Router.
    Cada página deve carregar dados no servidor e entregar UI em componentes coerentes com a base shadcn/Tailwind.
  files:
    - app/(app)/dashboard/page.tsx
    - app/(app)/board/page.tsx
    - app/(app)/knowledge/page.tsx
    - app/(app)/knowledge/[id]/page.tsx
    - app/(app)/skills/page.tsx
    - app/(app)/skills/[id]/page.tsx
    - app/(app)/team/page.tsx
    - app/(app)/profile/page.tsx
  depends_on: T1.2
  refs:
    - D-02
    - D-03
  verify: "As rotas principais renderizam no servidor e exibem dados sem depender de cliente para bootstrap inicial."
  done: "Navegação principal da aplicação está disponível no App Router com páginas SSR funcionais."
  ```

- [x] **T1.4** — Migrar mutações para Server Actions e remover dependência de API legado para UI nova

  ```yaml
  id: T1.4
  title: "Criar Server Actions base para CRUD principal"
  action: |
    Implementar Server Actions para boards, knowledge, skills, comments e workspaces.
    Atualizar formulários e fluxos de criação/edição para usar estas actions e invalidar dados renderizados no servidor após mutações.
  files:
    - app/actions/boards.ts
    - app/actions/knowledge.ts
    - app/actions/skills.ts
    - app/actions/comments.ts
    - app/actions/workspaces.ts
    - components/board/board-form.tsx
    - components/knowledge/knowledge-form.tsx
    - components/skills/skill-form.tsx
  depends_on: T1.3
  refs:
    - D-02
    - D-03
  verify: "Operações de criar/editar/remover entidades principais executam por Server Actions e refletem no SSR."
  done: "Fluxos de mutação essenciais funcionam sem depender de chamadas diretas ao backend legado."
  ```
