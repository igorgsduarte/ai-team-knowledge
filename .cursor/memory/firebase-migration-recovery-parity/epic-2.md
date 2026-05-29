---
name: "Épico 2: Restauração das telas e componentes principais"
todos:
  - id: T2.1
    content: "Restaurar shell e navegação principal"
    status: completed
  - id: T2.2
    content: "Recompor conteúdo funcional das telas privadas"
    status: completed
decisions: D-01, D-02, D-04
goal: "Telas principais deixam estado de placeholder e retomam fluxo funcional por workspace."
---

# Épico 2: Restauração das telas e componentes principais

> **Goal observável:** Telas principais deixam estado de placeholder e retomam fluxo funcional por workspace.
>
> **Covers decisions:** D-01, D-02, D-04

- [x] **T2.1** — Restaurar shell e navegação principal

  ```yaml
  id: T2.1
  title: "Reestabelecer estrutura de navegação consistente"
  action: |
    Reorganizar shell, links e pontos de entrada para que o usuário consiga percorrer home, dashboard, board, knowledge, skills, team e profile de forma contínua.
    Garantir que a estrutura preserve SSR nas páginas principais e não dependa de fallback textual mínimo.
  files:
    - src/app/page.tsx
    - src/components/app-shell.tsx
    - src/app/(app)/dashboard/page.tsx
    - src/app/(app)/board/page.tsx
    - src/app/(app)/team/page.tsx
    - src/app/(app)/profile/page.tsx
  depends_on: T1.2
  refs:
    - D-01
    - D-02
  verify: "Navegação por links internos cobre todas as rotas principais sem páginas vazias."
  done: "Shell e rotas principais apresentam conteúdo estrutural utilizável."
  ```

- [x] **T2.2** — Recompor conteúdo funcional das telas privadas

  ```yaml
  id: T2.2
  title: "Recuperar fluxos de board, knowledge e skills com isolamento por workspace"
  action: |
    Trocar textos genéricos por leitura de dados e ações reais nas páginas privadas críticas.
    Garantir exibição de estados vazios, detalhes por id e integração com Server Actions e repositórios com workspaceId.
  files:
    - src/app/(app)/knowledge/page.tsx
    - src/app/(app)/knowledge/[id]/page.tsx
    - src/app/(app)/skills/page.tsx
    - src/app/(app)/skills/[id]/page.tsx
    - src/components/knowledge/knowledge-form.tsx
    - src/components/skills/skill-form.tsx
    - src/components/board/board-form.tsx
  depends_on: T2.1
  refs:
    - D-01
    - D-02
    - D-04
  verify: "Telas privadas exibem dados/estados reais e permitem mutações via actions sem quebrar isolamento de workspace."
  done: "Fluxos centrais da aplicação estão operacionalmente restaurados."
  ```
