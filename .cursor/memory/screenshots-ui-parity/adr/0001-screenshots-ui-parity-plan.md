# 0001 — Plano de paridade UI com screenshots

## Status

Accepted

## Context

O TeamKnowledge migrou para Next.js + Firebase com UI funcional mínima (tema escuro, formulários inline, dashboard como entrada). O Human forneceu screenshots como referência definitiva para Board, Knowledge, Skills, Team e Profile, com requisitos adicionais: drawers com markdown editor, Board como home, seed demo rico, MCP oculto na UI, validação Playwright.

Restrições: reutilizar `globals.css` e padrões SSR/Server Actions; isolamento por `workspaceId`; biblioteca markdown `@uiw/react-md-editor`.

## Decision

Executar seis épicos lineares:

1. Tokens claros + primitivos (Drawer, MarkdownEditor, badges)
2. Extensão de domínio Firestore + seed acme
3. Board como página principal
4. Knowledge e Skills
5. Team, Profile e Agent drawer
6. Redirects, i18n e testes visuais Playwright

Exclusões: dashboard como produto; UI MCP visível; Tailwind/novo design system.

## Consequences

- **Positivo:** Paridade verificável com screenshots; demo workspace utilizável para QA visual.
- **Risco:** `@uiw/react-md-editor` pode exigir dynamic import e ajuste de bundle; comparação Playwright sensível a fontes/subpixel — threshold configurável.
- **Próximo passo:** Executar tarefas via dev-coder começando por T1.1.
