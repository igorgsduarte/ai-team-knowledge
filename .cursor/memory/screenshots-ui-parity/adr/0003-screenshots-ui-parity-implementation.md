# T1.2–T6.3: Paridade UI screenshots

## Status

Accepted

## Context

- Plano `screenshots-ui-parity` com 6 épicos e 23 tarefas após T1.1.
- Screenshots de referência do Human não estão versionados no repo; validação visual usa baselines Playwright em `tests/visual/fixtures/`.

## Decision

- Épicos 1–6 entregues: tema claro, Drawer/MarkdownEditor, AppShell sem Dashboard, primitivos UI, domínio/repos/seed, páginas Board/Knowledge/Skills/Team/Profile, redirects `/board`, i18n pt-BR/en/es, suite Playwright.
- MCP permanece no código mas fora de `src/app/(app)`.
- Fixtures PNG: gerar com `bun run test:visual:update` ou copiar screenshots do Human para `tests/visual/fixtures/`.

## Consequences

- Comparar com screenshots originais exige fixtures ou `--update-snapshots` após revisão visual manual.
- Login demo depende de `bun run seed:demo` e Firebase configurado.
