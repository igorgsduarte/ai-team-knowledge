---
name: "Épico 5: Team, Profile e Agent drawer"
todos:
  - id: T5.1
    content: "Mapa de skills do time"
    status: completed
  - id: T5.2
    content: "Página Profile conforme screenshot"
    status: completed
  - id: T5.3
    content: "Agent drawer e ocultar MCP"
    status: completed
decisions: D-01, D-04, D-06, D-08
goal: "Team mostra mapa por membro; Profile com avatar/bio/skills/editar; Agent via drawer; MCP invisível"
---

# Épico 5: Team, Profile e Agent drawer

> **Goal observável:** Team exibe cards por membro com skills e níveis; Profile espelha Meu Perfil do screenshot; Agents.md editável via drawer; painéis MCP removidos da UI.
>
> **Covers decisions:** D-01, D-04, D-06, D-08

- [x] **T5.1** — Mapa de skills do time

  ```yaml
  id: T5.1
  title: "Mapa de skills do time"
  action: |
    Criar src/components/team/team-member-card.tsx: avatar, nome, área com ícone, lista skill + badge nível.
    Reescrever src/app/(app)/team/page.tsx: PageHeader Mapa de Skills do Time + subtítulo; grid horizontal/wrap de TeamMemberCard para cada membro do workspace.
    Agregar userSkills + skills + users via repositórios.
    Não renderizar McpKeyPanel nem McpActivationForm (código permanece no repo, apenas não importado nesta página).
  files:
    - src/components/team/team-member-card.tsx
    - src/app/(app)/team/page.tsx
  depends_on: T4.4
  refs:
    - D-01
    - D-06
  verify: "Team page mostra 3 membros demo com skills/níveis; zero UI MCP visível"
  done: "Mapa de skills do time corresponde ao screenshot Team"
  ```

- [x] **T5.2** — Página Profile conforme screenshot

  ```yaml
  id: T5.2
  title: "Página Profile conforme screenshot"
  action: |
    Criar src/components/profile/profile-info-card.tsx: avatar grande roxo, nome, área, email, bio, botão Editar.
    Criar src/components/profile/profile-skills-card.tsx: título Minhas Skills (N), badges skill + nível colorido.
    Criar src/components/profile/profile-edit-drawer.tsx: editar name, area, bio (locale permanece em ProfileLanguageForm secundário ou integrado conforme layout).
    Reescrever src/app/(app)/profile/page.tsx substituindo cards técnicos atuais (userId/workspaceId) pelo layout Meu Perfil do screenshot.
    Manter seleção de idioma acessível (secção compacta ou dentro do drawer editar — assumir secção compacta abaixo das skills se couber).
  files:
    - src/components/profile/profile-info-card.tsx
    - src/components/profile/profile-skills-card.tsx
    - src/components/profile/profile-edit-drawer.tsx
    - src/app/(app)/profile/page.tsx
  depends_on: T5.1
  refs:
    - D-08
  verify: "Login demo@teamknowledge.dev exibe perfil igual ao screenshot Meu Perfil"
  done: "Profile deixa de mostrar IDs técnicos e espelha anexo"
  ```

- [x] **T5.3** — Agent drawer e ocultar MCP

  ```yaml
  id: T5.3
  title: "Agent drawer e ocultar MCP"
  action: |
    Criar src/components/agents/agents-edit-drawer.tsx na Profile ou secção Agents.md:
    Drawer com MarkdownEditor carregando conteúdo atual via agentsRepository.getContent SSR passado como prop.
    Botão publicar chama publishAgents.
    Secção Agents.md no perfil com preview truncado + CTA editar.
    Confirmar que componentes mcp/* não são renderizados em nenhuma rota app até nova decisão de produto.
    Verificação: grep em src/app/(app) não encontra imports de McpKeyPanel ou McpActivationForm.
  files:
    - src/components/agents/agents-edit-drawer.tsx
    - src/app/(app)/profile/page.tsx
  depends_on: T5.2
  refs:
    - D-04
    - D-06
  verify: "Drawer Agents abre editor markdown; publish persiste versão; grep src/app/(app) por McpKeyPanel|McpActivationForm retorna zero matches"
  done: "Gestão Agents.md via drawer; MCP oculto na UI"
  ```
