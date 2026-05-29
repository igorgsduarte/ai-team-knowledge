---
name: "screenshots-ui-parity"
status: implementation complete
overview: "Implementar paridade visual/comportamental com os screenshots anexados: tema claro, Board como home, drawers com markdown editor, seed demo e validação Playwright."
todos:
  - id: epic-1
    content: "Tokens, shell e primitivos UI"
    status: completed
  - id: epic-2
    content: "Domínio, repositórios e seed demo"
    status: completed
  - id: epic-3
    content: "Board — página principal"
    status: completed
  - id: epic-4
    content: "Knowledge e Skills"
    status: completed
  - id: epic-5
    content: "Team, Profile e Agent drawer"
    status: completed
  - id: epic-6
    content: "Rotas, i18n e validação Playwright"
    status: completed
epics:
  - id: epic-1
    file: ./epic-1.md
  - id: epic-2
    file: ./epic-2.md
  - id: epic-3
    file: ./epic-3.md
  - id: epic-4
    file: ./epic-4.md
  - id: epic-5
    file: ./epic-5.md
  - id: epic-6
    file: ./epic-6.md
isProject: false
---

# Plano: screenshots-ui-parity

## Problema / objetivo

A UI atual do TeamKnowledge (tema escuro, formulários inline, dashboard como entrada, perfil técnico) não corresponde aos screenshots fornecidos como referência. O objetivo é restaurar paridade visual e comportamental nas páginas Board, Knowledge, Skills, Team e Profile, com Board como tela principal e formulários de criação em drawer com editor markdown.

## Proposta de solução

Seis épicos em sequência linear: (1) atualizar tokens CSS e primitivos compartilhados (Drawer, MarkdownEditor, badges); (2) estender domínio Firestore e seed demo acme; (3–5) reescrever cada página contra os screenshots; (6) redirects, i18n e suite Playwright comparando capturas com os anexos. Reutilizar `globals.css`, Server Actions e repositórios existentes — sem Tailwind nem segundo design system.

## Critérios globais de sucesso

- Board, Knowledge, Skills, Team e Profile renderizam layout, hierarquia e componentes equivalentes aos screenshots (tema claro, cards, badges, grids responsivos).
- Formulários de criação de Knowledge, Skill e Agent usam Drawer com `@uiw/react-md-editor` como campo principal.
- Board é a rota default pós-autenticação; Dashboard removido da navegação.
- Ícones da sidebar sem background; mesma cor do texto.
- Workspace demo `acme` contém dados de validação (board, knowledge, skills, user skills, agents).
- Painéis MCP não aparecem na UI (código backend preservado).
- Suite Playwright confirma paridade visual das cinco rotas contra imagens referência.

## Decisões travadas (NON-NEGOTIABLE)

- D-01: Screenshots e notas do Human são fonte de verdade visual/comportamental. — motivo: requisito explícito — origem: humano
- D-02: Reutilizar tokens/utilities em `src/app/globals.css`; proibido sistema paralelo (ex.: Tailwind). — motivo: convenção do repo — origem: humano/discovery
- D-03: Board como página principal; Dashboard removido da nav e redirects atualizados para `/board`. — motivo: requisito explícito — origem: humano
- D-04: Drawers de criação Board/Knowledge/Skill/Agent com `@uiw/react-md-editor` como campo principal de descrição/conteúdo. — motivo: escolha confirmada via AskQuestion + assunção Board drawer — origem: humano
- D-05: Ícones da sidebar sem background; cor igual ao texto do link. — motivo: requisito explícito — origem: humano
- D-06: UI MCP oculta até decisão futura; não deletar código backend MCP. — motivo: escolha confirmada via AskQuestion — origem: humano
- D-07: Seed demo `acme` deve incluir conteúdo espelhando os screenshots (incl. demo@teamknowledge.dev). — motivo: requisito explícito — origem: humano
- D-08: Página Profile deve corresponder ao screenshot Meu Perfil (avatar, bio, área, skills com nível, editar). — motivo: requisito explícito — origem: humano
- D-09: Validação final com Playwright (spec automatizada + iteração via Playwright MCP durante implementação). — motivo: requisito explícito — origem: humano
- D-10: Manter Next.js App Router, SSR, Server Actions e isolamento `workspaceId` nos repositórios. — motivo: AGENTS.md — origem: discovery

## Ideias deferidas (NÃO planejar)

- Página Dashboard como produto — razão: Human confirmou que não é necessária
- UI de gestão MCP visível — razão: aguardando decisão de produto
- Redesign além do que os screenshots especificam — razão: fora do escopo

## Restrições técnicas conhecidas

- Stack: Next.js 16, React 19, Firebase Firestore, CSS custom em `globals.css`, lucide-react, next-intl.
- Baseline em `/Users/igor.duarte/Downloads/Knowledge-Hub` inacessível no sandbox; screenshots anexados substituem como referência.
- `@uiw/react-md-editor` requer import client-only (dynamic) para evitar quebra SSR.
- Assunção: Board create drawer usa modal lateral (drawer) em vez de modal central do screenshot — comportamento drawer conforme nota do Human.

## Épicos

- [Épico 1 — Tokens, shell e primitivos UI](./epic-1.md)
- [Épico 2 — Domínio, repositórios e seed demo](./epic-2.md)
- [Épico 3 — Board — página principal](./epic-3.md)
- [Épico 4 — Knowledge e Skills](./epic-4.md)
- [Épico 5 — Team, Profile e Agent drawer](./epic-5.md)
- [Épico 6 — Rotas, i18n e validação Playwright](./epic-6.md)

## Organização de ficheiros alvo

Referência: estrutura atual em `src/` na raiz do repositório.

### Criar (novos)

| Caminho | Tipo | Nota |
| ------- | ---- | ---- |
| src/components/ui/drawer.tsx | component | Drawer reutilizável |
| src/components/ui/markdown-editor.tsx | component | Wrapper @uiw/react-md-editor |
| src/components/ui/user-avatar.tsx | component | Avatar iniciais |
| src/components/ui/status-badge.tsx | component | Badges status/tipo |
| src/components/ui/tag-list.tsx | component | Pills de tags |
| src/components/ui/relative-time.tsx | component | Timestamps relativos |
| src/components/page-header.tsx | component | Título + subtítulo + actions |
| src/components/board/board-card.tsx | component | Card board |
| src/components/board/board-create-drawer.tsx | component | Drawer nova entrada |
| src/components/knowledge/knowledge-card.tsx | component | Card conhecimento |
| src/components/knowledge/knowledge-toolbar.tsx | component | Busca/filtro |
| src/components/knowledge/knowledge-create-drawer.tsx | component | Drawer nova entrada |
| src/components/skills/my-skills-panel.tsx | component | Minhas skills |
| src/components/skills/skill-card.tsx | component | Card skill |
| src/components/skills/skill-create-drawer.tsx | component | Drawer nova skill |
| src/components/skills/add-skill-button.tsx | component | Adicionar skill ao usuário |
| src/components/team/team-member-card.tsx | component | Card membro + skills |
| src/components/profile/profile-info-card.tsx | component | Card perfil |
| src/components/profile/profile-skills-card.tsx | component | Skills do usuário |
| src/components/profile/profile-edit-drawer.tsx | component | Editar perfil |
| src/components/agents/agents-edit-drawer.tsx | component | Editor Agents.md |
| src/lib/repositories/user-skills-repository.ts | repository | UserSkill CRUD |
| src/app/actions/user-skills.ts | server action | add/remove user skill |
| playwright.config.ts | config | Playwright visual tests |
| tests/visual/screenshots-parity.spec.ts | test | Comparação vs screenshots |
| tests/visual/fixtures/board.png | fixture | Referência visual Board |
| tests/visual/fixtures/knowledge.png | fixture | Referência visual Knowledge |
| tests/visual/fixtures/skills.png | fixture | Referência visual Skills |
| tests/visual/fixtures/team.png | fixture | Referência visual Team |
| tests/visual/fixtures/profile.png | fixture | Referência visual Profile |
| .cursor/memory/screenshots-ui-parity/adr/README.md | adr index | Primeiro uso do slug |
| .cursor/memory/screenshots-ui-parity/adr/0001-screenshots-ui-parity-plan.md | adr | ADR inicial |

### Alterar (existentes)

| Caminho | Nota |
| ------- | ---- |
| src/app/globals.css | Tema claro + estilos cards/drawer/sidebar |
| src/components/app-shell.tsx | Nav sem dashboard; ícones flat |
| package.json | @uiw/react-md-editor, @playwright/test |
| src/lib/types/domain.ts | Campos estendidos |
| src/lib/firebase/firestore.ts | Coleção userSkills |
| src/lib/repositories/boards-repository.ts | Campos status/tags |
| src/lib/repositories/knowledge-repository.ts | Campos type/url |
| src/lib/repositories/skills-repository.ts | Campos description/tags |
| src/lib/repositories/users-repository.ts | Perfil enriquecido |
| src/app/actions/boards.ts | Payload drawer + delete |
| src/app/actions/knowledge.ts | Payload drawer + delete |
| src/app/actions/skills.ts | Payload drawer |
| src/app/actions/agents.ts | Markdown drawer |
| src/app/actions/user-skills.ts | add/remove user skill |
| src/app/actions/profile.ts | updateProfile |
| scripts/seed-demo-acme.mjs | Conteúdo demo completo |
| src/app/(app)/board/page.tsx | Grid cards + drawer |
| src/app/(app)/knowledge/page.tsx | Grid + toolbar + drawer |
| src/app/(app)/skills/page.tsx | Minhas skills + grid |
| src/app/(app)/team/page.tsx | Mapa membros; sem MCP UI |
| src/app/(app)/profile/page.tsx | Layout Meu Perfil |
| src/app/(app)/dashboard/page.tsx | Redirect para /board |
| src/proxy.ts | Redirects /board |
| messages/pt-BR.json | Copy nova UI |
| messages/en.json | Copy nova UI |
| src/components/demo-login-card.tsx | Redirect /board |
| src/app/api/auth/sign-in/route.ts | Redirect /board |
| src/app/api/auth/sign-up/route.ts | Redirect /board |

### Deletar (quando migrado)

| Caminho | Nota |
| ------- | ---- |
| src/components/board/board-form.tsx | Substituído por drawer |
| src/components/knowledge/knowledge-form.tsx | Substituído por drawer |
| src/components/skills/skill-form.tsx | Substituído por drawer |
