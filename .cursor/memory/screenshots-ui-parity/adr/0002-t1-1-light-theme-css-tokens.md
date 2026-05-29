# T1.1: Tema claro e tokens CSS

## Status

Accepted

## Context

- Task: T1.1 — Atualizar tokens CSS para tema claro dos screenshots
- `done` criterion: globals.css expõe tokens claros e classes de layout/card compatíveis com os screenshots
- `verify` criterion: bun run build conclui; inspeção visual confirma fundo claro e primário navy nos cards/botões
- Estado anterior: tema escuro com primário violeta em `:root` e `color-scheme: dark`.

## Decision

- Reescrever `:root` para paleta clara (#F9FAFB fundo, #111827 texto, #E5E7EB bordas, #1E1B4B primário navy).
- Adicionar classes `.status-badge` para estados de board, tipos knowledge e níveis de skill.
- Atualizar layout (sidebar branca, cards com sombra leve, inputs/botões navy) mantendo utilitários existentes; sem Tailwind.
- `html { color-scheme: light }` e remoção de gradiente escuro no `body`.

## Consequences

- Páginas ainda não refatoradas passam a renderizar em tema claro globalmente; T1.2–T1.5 podem compor sobre estes tokens.
- Contraste de componentes legados (se houver classes hardcoded dark) pode precisar ajuste em tarefas seguintes.
