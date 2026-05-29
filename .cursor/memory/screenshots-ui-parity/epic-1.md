---
name: "Épico 1: Tokens, shell e primitivos UI"
todos:
  - id: T1.1
    content: "Atualizar tokens CSS para tema claro dos screenshots"
    status: completed
  - id: T1.2
    content: "Criar componente Drawer reutilizável"
    status: completed
  - id: T1.3
    content: "Criar MarkdownEditor com @uiw/react-md-editor"
    status: completed
  - id: T1.4
    content: "Refatorar AppShell e cabeçalho de página"
    status: completed
  - id: T1.5
    content: "Criar primitivos visuais compartilhados"
    status: completed
decisions: D-01, D-02, D-03, D-05
goal: "Shell e primitivos UI alinhados aos screenshots, prontos para composição das páginas"
---

# Épico 1: Tokens, shell e primitivos UI

> **Goal observável:** Tema claro, sidebar sem ícones com background, Drawer e MarkdownEditor reutilizáveis, cabeçalho de página com título/subtítulo e slot de ação.
>
> **Covers decisions:** D-01, D-02, D-03, D-05

- [x] **T1.1** — Atualizar tokens CSS para tema claro dos screenshots

  ```yaml
  id: T1.1
  title: "Atualizar tokens CSS para tema claro dos screenshots"
  action: |
    Reescrever variáveis em src/app/globals.css para paleta clara dos screenshots: fundo branco/cinza claro, texto escuro, bordas #E5E7EB, primário navy (#1E1B4B ou equivalente), badges de status (aprendendo/fazendo/concluído, link/artigo, níveis de skill).
    Ajustar estilos de app-layout, app-sidebar (fundo branco, borda direita), app-card, list-card, pill-link, tag-pill, botões primários e inputs para corresponder à hierarquia visual dos anexos.
    Preservar utilitários existentes; não introduzir Tailwind nem segundo sistema de tokens.
    Garantir breakpoints mobile: sidebar colapsável ou empilhada conforme padrão já iniciado em globals.css.
  files:
    - src/app/globals.css
  depends_on: nenhum
  refs:
    - D-01
    - D-02
  verify: "bun run build conclui; inspeção visual confirma fundo claro e primário navy nos cards/botões"
  done: "globals.css expõe tokens claros e classes de layout/card compatíveis com os screenshots"
  ```

- [x] **T1.2** — Criar componente Drawer reutilizável

  ```yaml
  id: T1.2
  title: "Criar componente Drawer reutilizável"
  action: |
    Criar src/components/ui/drawer.tsx como client component: overlay escurecido, painel lateral direito (desktop) ou full-width inferior (mobile), título, botão fechar, área scrollável para formulário, trap de foco básico.
    Expor props open, onOpenChange, title, children.
    Estilizar apenas com classes/tokens de globals.css.
  files:
    - src/components/ui/drawer.tsx
  depends_on: T1.1
  refs:
    - D-02
    - D-04
  verify: "Componente montado em página de prova: open=true renderiza painel; clique overlay chama onOpenChange(false); Tab mantém foco dentro do painel"
  done: "Componente Drawer exportado e utilizável por formulários de criação"
  ```

- [x] **T1.3** — Criar MarkdownEditor com @uiw/react-md-editor

  ```yaml
  id: T1.3
  title: "Criar MarkdownEditor com @uiw/react-md-editor"
  action: |
    Adicionar dependência @uiw/react-md-editor ao projeto.
    Criar src/components/ui/markdown-editor.tsx encapsulando o editor com value/onChange, altura mínima generosa (campo principal do drawer), tema claro alinhado aos tokens CSS.
    Garantir compatibilidade com React 19 e import dinâmico se necessário para evitar SSR break.
  files:
    - src/components/ui/markdown-editor.tsx
    - package.json
  depends_on: T1.2
  refs:
    - D-04
  verify: "bun run build conclui; editor renderiza toolbar e área de edição no client"
  done: "MarkdownEditor reutilizável exportado com API controlada value/onChange"
  ```

- [x] **T1.4** — Refatorar AppShell e cabeçalho de página

  ```yaml
  id: T1.4
  title: "Refatorar AppShell e cabeçalho de página"
  action: |
    Atualizar src/components/app-shell.tsx: remover item Dashboard da navegação; brand link aponta para /board.
    Remover background colorido dos ícones da sidebar (svg herda cor do texto; span wrapper sem bg).
    Estado active: highlight no link inteiro (bg suave + texto primário), não no ícone isolado.
    Criar src/components/page-header.tsx com title, subtitle opcional e actions slot (botão Nova Entrada etc.).
    Integrar PageHeader no AppShell substituindo header atual sem eyebrow de workspace quando página fornecer subtitle próprio via prop ou children pattern acordado.
    Footer sidebar: perfil Demo + Log out conforme screenshots.
    Atualizar src/proxy.ts e demo-login-card para redirect pós-auth para /board (não /dashboard).
  files:
    - src/components/app-shell.tsx
    - src/components/page-header.tsx
    - src/proxy.ts
    - src/components/demo-login-card.tsx
  depends_on: T1.3
  refs:
    - D-01
    - D-03
    - D-05
  verify: "Navegação não lista Dashboard; ícones sidebar sem caixa colorida; link active estiliza texto e ícone igualmente"
  done: "AppShell reflete screenshots de sidebar; PageHeader disponível para páginas"
  ```

- [x] **T1.5** — Criar primitivos visuais compartilhados

  ```yaml
  id: T1.5
  title: "Criar primitivos visuais compartilhados"
  action: |
    Criar componentes em src/components/ui/: user-avatar.tsx (iniciais circulares), status-badge.tsx (Aprendendo/Fazendo/Concluído e Link/Artigo), tag-list.tsx (pills cinza), relative-time.tsx (1 day ago via Intl/formatDistance).
    Usar lucide-react para ícones conforme screenshots.
    Sem lógica de dados; apenas apresentação tipada.
  files:
    - src/components/ui/user-avatar.tsx
    - src/components/ui/status-badge.tsx
    - src/components/ui/tag-list.tsx
    - src/components/ui/relative-time.tsx
  depends_on: T1.4
  refs:
    - D-01
    - D-02
  verify: "Componentes compilam e renderizam badges/tags/avatar coerentes com screenshots"
  done: "Primitivos UI exportados para uso nas páginas Board/Knowledge/Skills/Team/Profile"
  ```
