---
name: "Épico 6: Rotas, i18n e validação Playwright"
todos:
  - id: T6.1
    content: "Redirects e remoção Dashboard da navegação"
    status: completed
  - id: T6.2
    content: "Strings i18n pt-BR/en para nova UI"
    status: completed
  - id: T6.3
    content: "Validação visual Playwright contra screenshots"
    status: completed
decisions: D-03, D-09
goal: "Board como home pós-auth; copy localizada; validação Playwright confirma paridade visual"
---

# Épico 6: Rotas, i18n e validação Playwright

> **Goal observável:** Redirects apontam para /board; mensagens i18n completas; suite Playwright captura e compara telas-chave com referências.
>
> **Covers decisions:** D-03, D-09

- [x] **T6.1** — Redirects e remoção Dashboard da navegação

  ```yaml
  id: T6.1
  title: "Redirects e remoção Dashboard da navegação"
  action: |
    Atualizar src/proxy.ts: redirect pós-login/sign-up de /dashboard para /board; redirect /dashboard para /board.
    Opcional: manter src/app/(app)/dashboard/page.tsx como redirect server-side para /board ou remover rota — preferir redirect explícito.
    Atualizar links em demo-login-card e sign-in success para /board.
    Garantir src/app/page.tsx landing inalterada salvo links internos.
  files:
    - src/proxy.ts
    - src/app/(app)/dashboard/page.tsx
    - src/components/demo-login-card.tsx
    - src/app/api/auth/sign-in/route.ts
    - src/app/api/auth/sign-up/route.ts
  depends_on: T5.3
  refs:
    - D-03
  verify: "Login demo redireciona para /board; acesso /dashboard redireciona /board"
  done: "Board é rota default autenticada"
  ```

- [x] **T6.2** — Strings i18n pt-BR/en para nova UI

  ```yaml
  id: T6.2
  title: "Strings i18n pt-BR/en para nova UI"
  action: |
    Auditar messages/pt-BR.json e messages/en.json: completar chaves faltantes para subtítulos, drawers, status, níveis, empty states.
    Garantir paridade pt-BR/en para todas as chaves novas adicionadas nas tarefas T3.3–T5.3.
    Remover chaves Dashboard órfãs se não referenciadas.
  files:
    - messages/pt-BR.json
    - messages/en.json
  depends_on: T6.1
  refs:
    - D-01
  verify: "bun run type-check passa; páginas não exibem chaves cruas"
  done: "UI nova totalmente localizada pt-BR e en"
  ```

- [x] **T6.3** — Validação visual Playwright contra screenshots

  ```yaml
  id: T6.3
  title: "Validação visual Playwright contra screenshots"
  action: |
    Adicionar @playwright/test como devDependency e playwright.config.ts apontando baseURL localhost:3000.
    Copiar screenshots referência do Human para tests/visual/fixtures/{board,knowledge,skills,team,profile}.png.
    Criar tests/visual/screenshots-parity.spec.ts que:
    1) faz login demo (demo@teamknowledge.dev)
    2) navega board, knowledge, skills, team, profile
    3) captura screenshot via Playwright
    4) compara com fixtures locais (threshold 0.15)
    Fluxo de iteração: dev server running, bun run seed:demo, executar testes, ajustar CSS até passar.
    Usar Playwright MCP durante desenvolvimento conforme pedido do Human.
  files:
    - playwright.config.ts
    - tests/visual/screenshots-parity.spec.ts
    - tests/visual/fixtures/board.png
    - tests/visual/fixtures/knowledge.png
    - tests/visual/fixtures/skills.png
    - tests/visual/fixtures/team.png
    - tests/visual/fixtures/profile.png
    - package.json
  depends_on: T6.2
  refs:
    - D-09
  verify: "Playwright spec executa e screenshots das 5 rotas passam threshold vs referências"
  done: "Suite visual automatizada valida paridade com anexos"
  ```
