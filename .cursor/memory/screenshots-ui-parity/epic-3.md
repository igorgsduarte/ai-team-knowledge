---
name: "Épico 3: Board — página principal"
todos:
  - id: T3.1
    content: "BoardCard e contagem de comentários"
    status: completed
  - id: T3.2
    content: "BoardCreateDrawer com markdown editor"
    status: completed
  - id: T3.3
    content: "Reescrever página Board"
    status: completed
decisions: D-01, D-03, D-04
goal: "Board do Time corresponde ao screenshot com grid de cards, status, tags e drawer de criação"
---

# Épico 3: Board — página principal

> **Goal observável:** Página /board exibe grid responsivo de entradas com autor, timestamp, badge de status, tags, descrição, contagem de comentários e CTA Nova Entrada abrindo drawer.
>
> **Covers decisions:** D-01, D-03, D-04

- [x] **T3.1** — BoardCard e contagem de comentários

  ```yaml
  id: T3.1
  title: "BoardCard e contagem de comentários"
  action: |
    Criar src/components/board/board-card.tsx: header com UserAvatar, nome, RelativeTime, StatusBadge, ícone delete (server action).
    Corpo: título bold, TagList, descrição truncada (markdown plain ou strip).
    Footer: ícone MessageCircle + contagem comentários via commentsRepository.listByEntity no server parent.
    Props tipadas com Board + author profile resolvido.
  files:
    - src/components/board/board-card.tsx
  depends_on: T2.4
  refs:
    - D-01
  verify: "Card renderiza estrutura equivalente ao screenshot Board"
  done: "BoardCard compõe avatar, status, tags, comentários e delete"
  ```

- [x] **T3.2** — BoardCreateDrawer com markdown editor

  ```yaml
  id: T3.2
  title: "BoardCreateDrawer com markdown editor"
  action: |
    Criar src/components/board/board-create-drawer.tsx client component.
    Trigger botão + Nova Entrada; Drawer com campos: título, MarkdownEditor como descrição principal, select status (Aprendendo/Fazendo/Concluído), tags separadas por vírgula.
    Submit chama createBoard via form action ou useTransition + FormData incluindo body markdown.
    Fechar drawer após sucesso.
    Remover board-form.tsx inline antigo após migração.
  files:
    - src/components/board/board-create-drawer.tsx
  depends_on: T3.1
  refs:
    - D-04
  verify: "Drawer abre pelo CTA; submit cria entrada e lista atualiza após revalidate"
  done: "Criação de board ocorre exclusivamente via drawer com markdown editor"
  ```

- [x] **T3.3** — Reescrever página Board

  ```yaml
  id: T3.3
  title: "Reescrever página Board"
  action: |
    Reescrever src/app/(app)/board/page.tsx SSR:
    PageHeader título Board do Time, subtítulo dos screenshots, actions com BoardCreateDrawer.
    Grid 2 colunas desktop / 1 mobile de BoardCard.
    Resolver autores via usersRepository para cada createdBy.
    Empty state quando lista vazia.
    Remover formulário inline antigo.
    Adicionar chaves i18n usadas nesta página em messages/pt-BR.json e messages/en.json.
  files:
    - src/app/(app)/board/page.tsx
    - src/components/board/board-form.tsx
    - messages/pt-BR.json
    - messages/en.json
  depends_on: T3.2
  refs:
    - D-01
    - D-03
  verify: "Página /board com seed demo reproduz layout do screenshot Board"
  done: "Board é a experiência principal pós-login alinhada ao anexo"
  ```
